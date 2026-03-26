import requests
BASE = 'http://127.0.0.1:5000'

# Login first to get token
res = requests.post(f'{BASE}/auth/login', json={
    'email': 'test@test.com', 'password': 'test123'
})
token = res.json()['token']
headers = {'Authorization': f'Bearer {token}'}

# Upload — no auth needed
with open('storage/uploads/titanic.csv', 'rb') as f:
    res = requests.post(f'{BASE}/upload', files={'file': f})
upload_data = res.json()
print("Upload:", upload_data['file_id'])

# Train — protected, needs token
res = requests.post(f'{BASE}/train', json={
    'file_id'    : upload_data['file_id'],
    'filename'   : upload_data['filename'],
    'target_col' : 'Survived'
}, headers=headers)
train_data = res.json()
print("Train:", train_data.get('best_model'))
print("Job ID:", train_data.get('job_id'))

# Predict — protected, needs token
res = requests.post(f'{BASE}/predict', json={
    'job_id'    : train_data['job_id'],
    'input_data': {'Pclass': 1, 'Sex': 'female', 'Age': 28,
                   'SibSp': 0, 'Parch': 0, 'Fare': 100, 'Embarked': 'S'}
}, headers=headers)
print("Predict:", res.json())