# Handles all data cleaning automatically - no user input needed.

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

def preprocess(df,target_col):
    '''
    Takes a raw dataframe and target column name.
    Returns: x_train, x_test, y_train, y_test, feature_names
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
    X= df.drop(columns= [target_col])
    y=df[target_col]
    
    # Step 3: Fill missing values
    
    # Here we have done that for numerical columns we fill missing values with median and for categorical columns we fill missing values with mode.
    for col in X.columns:
        if X[col].dtype in ['float64','int64']:
            X[col]=X[col].fillna(X[col].median())
        else:
            X[col]=X[col].fillna(X[col].mode()[0])
    
    # Step 4 : Encode categorical columns
    # Convert text categories into numbers that sklearn can understand
    X=pd.get_dummies(X, drop_first=True)
    
    # Step 5: Encode target column if it is text
    if y.dtype == 'object':
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
    
    return X_train, X_test, y_train, y_test, feature_names,scaler
    
        
    
