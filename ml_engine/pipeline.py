#  Master orchestrator - this is the ONE function Flask will call
# Takes a CSV path + target column, returns results + saves best model

import os
import joblib
import pandas as pd

from ml_engine.preprocessor import preprocess
from ml_engine.test_detector import detect_task
from ml_engine.trainer import train_all_models
from ml_engine.evaluator import evaluate_All_models

def run_pipeline(csv_path, target_col, job_id, models_dir='storage/models'):
    
    try:
        
        # --- Step 1: Load the CSV ---------
        print(f"[Pipeline] Loading dataset from {csv_path}")
        df= pd.read_csv(csv_path)
        print(f"[Pipeline] Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
        
        # ---- Step 2: Detect task type ------
        task = detect_task(df, target_col)
        print(f"[Pipeline]  Task detected: {task}")
        
        # ---- Step 3 : Preprocess ------
        print(f'[Pipeline] Preprocessing data...')
        X_train, X_test, y_train,y_test, feature_names, scaler = preprocess(df, target_col)
        print(f'[Pipeline] Preprocessing done - {len(feature_names)} features')
        
        # ----- Step 4: Train all models ------
        print(f'[Pipeline] Training models...')
        trained_models = train_all_models(X_train, y_train, task)
        
        # ----- Step 5: Evaluate all models -----
        print(f'[Pipeline] Evaluating models:...')
        results = evaluate_All_models(trained_models, X_test, y_test, task)
        
        # ----- Step 6: Save the best model as a .pkl file -----
        best_name= results[0]['model']
        best_model = next(m for name, m in trained_models if name == best_name)
        
        os.makedirs(models_dir, exist_ok = True)
        model_path = os.path.join(models_dir, f'model_{job_id}.pkl')
        
        
        # Save both the model and the scaler together
        # scaler is needed later for transforming new data before prediction
        joblib.dump({
            'model' : best_model,
            'scaler': scaler,
            'feature_names': feature_names,
            'task': task,}, model_path)
        
        print(f'[Pipeline] Best model {best_name} saved to {model_path}')
        
        # --- Step 7: Return everything -----
        return {
            'status': 'completed',
            'task': task,
            'results': results,
            'best_model': best_name,    
            'model_path': model_path,
            'features': feature_names
        }
        
    except Exception as e:
        # If anything crashes , return a clean error instead of crashing Flask
        print(f'[Pipeline] Error: {str(e)}')
        return {
            'status': 'failed',
            'error': str(e)
        }
    """
    Full DataPilot pipeline in one function call.

    Args:
        csv_path   : path to the uploaded CSV file
        target_col : name of the column to predict
        job_id     : unique ID for this training job (used to name saved model)
        models_dir : folder where trained models are saved

    Returns a dict with:
        - task       : 'classification' or 'regression'
        - results    : list of model metrics (sorted best to worst)
        - best_model : name of the winning model
        - model_path : path to the saved .pkl file
        - features   : list of feature column names used
        - status     : 'completed' or 'failed'
        - error      : error message if status is 'failed'
    """