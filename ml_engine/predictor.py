# Loads a saved .pkl model and runs prediction on new user input

import joblib
import pandas as pd
import numpy as np

def predict(model_path, input_data):
    '''
    Loads the saved model and makes a prediction on new input.
    
    Args:
        model_path : path to the saved .pkl file
        input_data : dict of feature values from the user
                     e.g. {'Pclass': 1, 'Sex': 'female', 'Age': 28}

    Returns a dict with:
        - prediction     : the predicted value (0/1 or a number)
        - label          : human-readable result e.g. 'Survived' / 'Did not survive'
        - confidence     : confidence % (classification only)
        - model_used     : name of the model that made the prediction
        - task           : 'classification' or 'regression'
    '''
    
    try:
        # Step 1 : Load the saved model bundle
        bundle = joblib.load(model_path)
        model = bundle['model']
        scaler = bundle['scaler']
        feature_names = bundle['feature_names']
        task = bundle['task']
        
        # Step 2: Convert input dict to a DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Step 3: Encode Categorical columns
        # Same encoding used during training 
        input_df = pd.get_dummies(input_df , drop_first=True)
        
        # Step 4: Align columns with training features
        # reindex fills missing columns with 0 so model doesnt crash
        input_df = input_df.reindex(columns=feature_names, fill_value=0)
        
        # Step 5: Scale using the SAME scaler from training
        input_scaled = scaler.transform(input_df)
        
        # Step 6: Make Predictions
        prediction = model.predict(input_scaled)[0]
        
        # Step 7: Build result based on task type
        if task =='classification':
            try:
                proba= model.predict_proba(input_scaled)[0]
                confidence= round(float(np.max(proba)*100),2)
            except:
                confidence = None
            return {
                'status': 'success',
                'task' : task,
                'prediction' : int(prediction),
                'label': str(prediction),
                'confidence' : confidence,
                'model_used': type(model).__name__,
            }
        else:
            return {
                'status': 'success',
                'task': task,
                'prediction': round(float(prediction),4),
                'label': str(round(float(prediction),2)),
                'confidence': None,
                'model_used': type(model).__name__,
                }
    except Exception as e:
        return {
            'status':'failed',
            'error' : str(e)
        }
