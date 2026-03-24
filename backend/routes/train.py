# Receives file_id and target_col, runs full ML pipeline

import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from ml_engine.pipeline import run_pipeline

train_bp= Blueprint('train',__name__)
@train_bp.route('/train', methods=['POST'])
def train_model():
    """
    Receives file_id and target_col from React.
    Finds the uploaded CSV, runs the full ML pipeline,
    and returns model comparison results.
    """
    # Step 1: Get data from request body (JSON)
    data= request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    file_id = data.get('file_id')
    target_col= data.get('target_col')
    filename = data.get('filename')
    
    # Step 2: Validate inputs
    if not file_id or not target_col or not filename:
        return jsonify({'error': 'file_id, filename and target_col are required'}), 400
    
    # Step 3 : Build the CSV path from file_id
    upload_dir = current_app.config['UPLOAD_FOLDER']
    csv_path = os.path.join(upload_dir, filename)
    
    if not os.path.exists(csv_path):
        return jsonify({'error': 'CSV file not found - please upload again'}), 400
    
    # Step 4: Generate unique job id for this training run
    job_id =str(uuid.uuid4())[:8]
    models_dir = current_app.config['MODELS_FOLDER']
    
    # Step 5 : Run the full ML Pipeline
    print(f'[Train] Starting job_id {job_id} - target: {target_col}')
    result= run_pipeline(
        csv_path= csv_path,
        target_col = target_col,
        job_id = job_id,
        models_dir = models_dir
    )
    
    # Step 6: Return results or error
    if result['status']=='failed':
        return jsonify({'error':result['error']}),500
    return jsonify({
        'status': 'success',
        'job_id': job_id,
        'task': result['task'],
        'best_model' : result['best_model'],
        'results'    : result['results'],
        'features'   : result['features'],
        'model_path' : result['model_path'],
    }), 200