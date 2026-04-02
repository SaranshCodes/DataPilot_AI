from backend import create_app
import os
from flask import send_from_directory

app = create_app()

# Resolve build directory using the directory of this file (not os.getcwd())
# This ensures it works correctly on Render and other deployment platforms
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(BASE_DIR, 'frontend', 'build')

# List of API route prefixes to exclude from the React catch-all
API_PREFIXES = ('auth', 'upload', 'update_eda', 'train', 'predict')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    # Don't intercept API routes — let Flask blueprints handle them
    if path and path.split('/')[0] in API_PREFIXES:
        from flask import abort
        abort(404)

    # Serve static files (JS, CSS, images, etc.)
    static_file = os.path.join(build_dir, path)
    if path and os.path.isfile(static_file):
        return send_from_directory(build_dir, path)

    # Everything else → serve React's index.html (for client-side routing)
    return send_from_directory(build_dir, 'index.html')

if __name__ == '__main__':
    app.run(debug=False, port=5000)