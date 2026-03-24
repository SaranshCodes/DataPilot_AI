import requests

BASE = 'http://127.0.0.1:5000'


# Step 1 : Uploading CSV file
print('Testing file upload...')
with open('storage/uploads/titanic.csv', 'rb') as f:
    res = requests.post(f'{BASE}/upload', files={'file': f})

upload_data = res.json()
print("Status:", res.status_code)
print("file_id :", upload_data['file_id'])
print("filename:", upload_data['filename'])

# Step 2: Train using the uploaded file
print('Testing /train')
train_res= requests.post(f'{BASE}/train', json={
    'file_id': upload_data['file_id'],
    'filename': upload_data['filename'],
    'target_col': 'Survived'  
})
'''train_data= train_res.json()
print('Status:', train_res.status_code)
print('Job ID:', train_data.get('job_id'))
print("Best model :", train_data.get('best_model'))'''
#print("Results    :")
#for r in train_data.get('results', []):
#    print(f"  {r['model']:<25} accuracy: {r['accuracy']}%")                  
train_data = train_res.json()
job_id = train_data.get('job_id')
print("job_id     :", job_id)
print("best_model :", train_data.get('best_model'))
# Step 3 : Predict
print('---/predict----')
predict_res = requests.post(f'{BASE}/predict', json ={
    'job_id' : job_id,
    'input_data': {
        'Pclass'   : 1,
        'Sex'      : 'female',
        'Age'      : 28,
        'SibSp'    : 0,
        'Parch'    : 0,
        'Fare'     : 100,
        'Embarked' : 'S'
    }
})
pred_data = predict_res.json()
print("Prediction :", pred_data.get('prediction'))
print("Confidence :", pred_data.get('confidence'), "%")
print("Model used :", pred_data.get('model_used'))