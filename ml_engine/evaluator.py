# Computes performance metrics for every trained model

from sklearn.metrics import (accuracy_score, f1_score, roc_auc_score, mean_absolute_error, mean_squared_error, r2_score)
import numpy as np

def evaluate_All_models(trained_models, X_test, y_test, task):
    '''
    Evaluates every trained model on the test set.
    Returns a list of result dicts, sorted best -> worst.
    '''
    results=[]
    for name , model in trained_models:
        y_pred = model.predict(X_test)
        if task=='classification':
            acc = accuracy_score(y_test,y_pred)
            f1 = f1_score(y_test, y_pred, average='weighted')
            
            # ROC- AUC needs probability scores, not just predictions
            try:
                y_prob= model.predict_proba(X_test)[:,1]
                auc= roc_auc_score(y_test, y_prob)
            except:
                auc= None
            results.append({
                'model':name,
                'accuracy': round(acc*100,2),
                'f1_score': round(f1,4),
                'roc_auc': round(auc,4) if auc else 'N/A', 
            })
            
        else:
            mae= mean_absolute_error(y_test, y_pred)
            mse= mean_squared_error(y_test, y_pred)
            rmse= np.sqrt(mse)
            r2= r2_score(y_test, y_pred)
            results.append({
                'model': name,
                'mae': round(mae,4),
                'rmse': round(rmse,4),
                'r2': round(r2,4)
            })
    # Sort results
    # Classification -> highest accuracy first
    # regression -> Hifhest R2 score first
    sort_key = 'accuracy' if task=='classification' else 'r2'
    results.sort(key=lambda x: x[sort_key], reverse=True)
    return results