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
                     e.g. {'Pclass': 1, 'Sex': 'male', 'Age': 28}

    Returns a dict with:
        - prediction     : the predicted value (0/1 or a number)
        - label          : human-readable result
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
        original_features = bundle.get('original_features', [])
        
        # Step 2: Build a row of zeros matching the encoded feature columns
        input_df = pd.DataFrame(0, index=[0], columns=feature_names, dtype=float)
        
        if original_features:
            # ---- NEW approach: manually encode using saved metadata ----
            # This avoids the broken pd.get_dummies-on-single-row problem
            for feat in original_features:
                name = feat['name']
                if name not in input_data:
                    continue
                value = input_data[name]
                
                if feat['type'] == 'numerical':
                    # Numerical: set value directly (column name is unchanged)
                    if name in feature_names:
                        input_df[name] = float(value)
                else:
                    # Categorical: find the matching dummy column and set it to 1
                    # During training, pd.get_dummies(drop_first=True) creates
                    # columns like "Sex_male" for all categories except the first
                    # (alphabetically). If the user picks the dropped-first category,
                    # all dummy columns stay 0 — which is correct.
                    dummy_col = f"{name}_{value}"
                    if dummy_col in feature_names:
                        input_df[dummy_col] = 1
                    # else: value is the dropped-first category → all dummies stay 0 ✓
        else:
            # ---- FALLBACK for models saved before this update ----
            temp_df = pd.DataFrame([input_data])
            temp_df = pd.get_dummies(temp_df, drop_first=True)
            for col in temp_df.columns:
                if col in feature_names:
                    input_df[col] = temp_df[col].values[0]
        
        # Step 3: Scale using the SAME scaler from training
        input_scaled = scaler.transform(input_df)
        
        # Step 4: Make Predictions
        prediction = model.predict(input_scaled)[0]
        
        # Step 5: Build result based on task type
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
