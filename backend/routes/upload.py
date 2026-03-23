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