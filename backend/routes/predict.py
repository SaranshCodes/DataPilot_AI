# Receives input data + model path , returns prediction

import os
from flask import Blueprint, request, jsonify, current_app
from ml_engine.predictor import predict
from backend.utils.auth_helper import token_required

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
@token_required
def make_prediction(current_user):
    """
    Receives job_id + input_data from React.
    Loads the saved model for that job and returns prediction.
    """
    # Step 1: Get JSON body
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    job_id = data.get('job_id')
    input_data = data.get('input_data')
    
    # Step 2: Validate
    if not job_id or not input_data:
        return jsonify({'error':'job_id and input_data are required'}), 400
    
    # Step 3: Build model path from job_id
    models_dir= current_app.config['MODELS_FOLDER']
    model_path= os.path.join(models_dir, f'model_{job_id}.pkl')
    if not os.path.exists(model_path):
        return jsonify({'error':f'No model found for job {job_id}'}),404
    
    # Step 4 : Run prediction
    result = predict(model_path, input_data)
    if result['status'] == 'failed':
        return jsonify({'error': result['error']}), 500
    return jsonify({
        'status':'success',
        'prediction' : result['prediction'],
        'confidence': result['confidence'],
        'model_used': result['model_used'],
        'task': result['task'],
    }), 200