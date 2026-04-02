from backend import create_app
import os

app = create_app()

# Serve React frontend in production
from flask import send_from_directory

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    build_dir = os.path.join(os.getcwd(), 'frontend', 'build')
    if path and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    return send_from_directory(build_dir, 'index.html')

if __name__ == '__main__':
    app.run(debug=False, port=5000)