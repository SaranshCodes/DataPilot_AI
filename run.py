from backend import create_app

app = create_app()

@app.route('/')
def home():
    return {"message": "DataPilot AI is running!", "status": "ok"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
