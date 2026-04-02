from backend import create_app
import os
from flask import send_from_directory

app = create_app()

build_dir = os.path.join(os.getcwd(), 'frontend', 'build')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # Serve API routes normally — don't intercept them
    if path.startswith('auth') or path.startswith('upload') or \
       path.startswith('train') or path.startswith('predict'):
        from flask import abort
        abort(404)

    # Serve static files (JS, CSS, images)
    static_file = os.path.join(build_dir, path)
    if path and os.path.exists(static_file):
        return send_from_directory(build_dir, path)

    # Everything else → serve React's index.html
    return send_from_directory(build_dir, 'index.html')

if __name__ == '__main__':
    app.run(debug=False, port=5000)