# POST /upload - accepts a CSV file ,saves it, runs EDA , returns results
import os
import uuid  # Generating unique file ids
from flask import Blueprint, request, jsonify, current_app
from ml_engine.eda import run_eda
import pandas as pd

upload_bp= Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    '''
    Accepts a CSV file uplaod.
    Saves it to storage/uploads/ with a unique filename.
    Runs EDA and returns column names + stat + charts.
    '''
    # Step 1: Check a file was actually sent
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}),400
    file =request.files['file']
    # Step 2: Check it's actually  a CSV
    
    if file.filename=='':
        return jsonify({'error': ' No file selected'}),400
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Only CSV files are supported'}), 400
    
    # Step 3: Save with unique filename to avoid conflicts
    unique_id = str(uuid.uuid4())[:8]
    filename= f'{unique_id}_{file.filename}'
    upload_dir = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_dir, exist_ok= True)
    csv_path= os.path.join(upload_dir, filename)
    file.save(csv_path)
    
    # Step 4: Load CSV and get basic info
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        return jsonify({'error': f'Could not read CSV: {str(e)}'}),400
    
    # Step 5: Run EDA ( no taregt column yet - user picks it next)
    eda_result = run_eda(csv_path)
    
    # Step 6: Return everything React needs
    return jsonify({
        'status': 'success',
        'file_id': unique_id,
        'filename':filename,
        'csv_path': csv_path,
        'rows': int(df.shape[0]),
        'columns': df.columns.tolist(),
        'eda': eda_result,
    }),200

@upload_bp.route('/update_eda', methods=['POST'])
def update_eda():
    '''
    Re-runs EDA when a target column is selected on the frontend
    so that the target distribution chart is generated.
    '''
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    filename = data.get('filename')
    target_col = data.get('target_col')
    
    if not filename:
        return jsonify({'error': 'Filename is required'}), 400
        
    upload_dir = current_app.config['UPLOAD_FOLDER']
    csv_path = os.path.join(upload_dir, filename)
    
    if not os.path.exists(csv_path):
        return jsonify({'error': 'CSV file not found on server'}), 400
        
    try:
        eda_result = run_eda(csv_path, target_col=target_col)
        return jsonify({
            'status': 'success',
            'eda': eda_result
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to update EDA: {str(e)}'}), 500