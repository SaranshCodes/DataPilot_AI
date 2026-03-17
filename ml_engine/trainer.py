# Trains 5 ML models and returns all of them with their names

from sklearn.linear_model import LogisticRegression,LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from xgboost import XGBClassifier, XGBRegressor

def get_models(task):
    '''
    Returns a list of (model_name, model_object) tuples based on whether the task is calssification or regression.
    '''
    if task == 'classification':
        return[
            ('Logistic Regression', LogisticRegression(max_iter=1000)),
            ('Random_Forest',RandomForestClassifier(n_estimators=100, random_state=42)),
            ('XGBoost',XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss')),
            ('SVM',SVC(kernel='rbf', probability=True)),
            ('KNN', KNeighborsClassifier(n_neighbors=5))
            ]
    else:
        return[
            ('Linear Regression', LinearRegression()),
            ('Random Forest', RandomForestRegressor(n_estimators=100, random_state=42)),
            ('XGBoost', XGBRegressor(n_estimators=100, random_state=42)),
            ('SVR', SVR(kernel='rbf')),
            ('KNN', KNeighborsRegressor(n_neighbors=5))
        ]

def train_all_models(X_train, y_train, task):
    '''
    Trains all 5 models on the training data.
    Returns a list of (model_name, trained_model) tuples.'''
    models = get_models(task)
    trained=[]
    for name,model in models:
        print(f" Training {name}...")
        model.fit(X_train, y_train)
        trained.append((name,model))
        print(f" {name} trained.")
    return trained