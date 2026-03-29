# Handles all data cleaning automatically - no user input needed.

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

def preprocess(df,target_col):
    '''
    Takes a raw dataframe and target column name.
    Returns: x_train, x_test, y_train, y_test, feature_names, scaler, original_features
    '''
    
    # Step 1: Drop columns that are useless for ML
    df=df.copy()
    cols_to_drop = []
    for col in df.columns:
        if col == target_col:
            continue
        if df[col].nunique() > 0.9 * len(df):
            cols_to_drop.append(col)
    df=df.drop(columns= cols_to_drop)
    
    # Step 2: Separate features(X) and target(y)
    X= df.drop(columns= [target_col]).copy()
    # Step 1c: Convert numeric-looking string columns to float
    for col in X.columns:
        if X[col].dtype == 'object':
            # Strip whitespace first — common issue with exported CSVs
            X[col] = X[col].str.strip()
            # Replace empty strings with NaN (e.g. TotalCharges in churn datasets)
            X[col] = X[col].replace('', np.nan)
            try:
                converted = pd.to_numeric(X[col], errors='coerce')
                # Only convert if more than 80% of non-null values became numeric
                non_null_count = X[col].notna().sum()
                if non_null_count > 0 and converted.notna().sum() / non_null_count > 0.8:
                    X[col] = converted
            except:
                pass
    y=df[target_col]
    
    # Step 1b: Drop high-cardinality categoricals BEFORE encoding
    HIGH_CARDINALITY_THRESHOLD = 20
    for col in X.columns:
        if X[col].dtype == 'object' and X[col].nunique() > HIGH_CARDINALITY_THRESHOLD:
            X = X.drop(columns=[col])
        
    # Step 3: Fill missing values
    
    # Here we have done that for numerical columns we fill missing values with median and for categorical columns we fill missing values with mode.
    for col in X.columns:
        if pd.api.types.is_numeric_dtype(X[col]):
            X[col]=X[col].fillna(X[col].median())
        else:
            X[col]=X[col].fillna(X[col].mode()[0] if not X[col].mode().empty else 'unknown')
    
    # Step 3b: Capture original feature metadata BEFORE encoding
    # This is used by the Predict page to show user-friendly inputs
    original_features = []
    for col in X.columns:
        if X[col].dtype == 'object':
            original_features.append({
                'name': col,
                'type': 'categorical',
                'categories': sorted(X[col].unique().tolist())
            })
        else:
            original_features.append({
                'name': col,
                'type': 'numerical',
            })
    
    # Step 4 : Encode categorical columns
    # Convert text categories into numbers that sklearn can understand
    X=pd.get_dummies(X, drop_first=True)
    
    # Step 5: Encode target column if it is non-numeric (e.g. 'Yes'/'No')
    if not pd.api.types.is_numeric_dtype(y):
        le= LabelEncoder()
        y=le.fit_transform(y)
    
    # Step 6: Scale all features to same range
    feature_names = X.columns.tolist()
    scaler= StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Step 7: Split into train and test
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled,y ,test_size=0.2, random_state=42
    )
    
    return X_train, X_test, y_train, y_test, feature_names, scaler, original_features
