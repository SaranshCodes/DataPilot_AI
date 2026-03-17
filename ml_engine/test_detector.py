# This file automatically figures out if the problem is classification or regression.

def detect_task(df,target_col):
    '''
    Returns 'classification' or 'regression' based on the target column.
    '''
    target = df[target_col]
    
    # If target is text, then its definitely calssification.
    if target.dtype == 'object':
        return 'classification'
    
    # If target has 10 or fewer unique values -> classification
    if target.nunique() <=10:
        return 'classification'
    # Otherwise, its regression
    return 'regression'