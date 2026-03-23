import requests

url = 'http://127.0.0.1:5000/upload'

with open('storage/uploads/titanic.csv', 'rb') as f:
    response = requests.post(url, files={'file': f})

print("Status:", response.status_code)
print("Response:", response.json())