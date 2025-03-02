from flask import Flask, jsonify, request, send_file, send_from_directory, redirect, url_for
from flask_cors import CORS
import os
import json


FRONTEND_BUILD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/build"))
app = Flask(__name__, static_folder=FRONTEND_BUILD_FOLDER, static_url_path="")
CORS(app)


# DATA_PATH = 'data'
DATA_PATH = '/var/data/feedback-data'
USERS_FILE = f'{DATA_PATH}/users.json'
VOTES_FILE = f'{DATA_PATH}/votes.json'
COMMENTS_FILE = f'{DATA_PATH}/comments.json'
os.makedirs(f'{DATA_PATH}', exist_ok=True)


def load_data(filename, default):
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            return json.load(f)
    return default

# Function to save data
def save_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)


users = load_data(USERS_FILE, [])
votes = load_data(VOTES_FILE, {})
comments = load_data(COMMENTS_FILE, {})

    
@app.route('/api/login', methods=['GET', 'POST'])
def login():
    try:
        if request.method == 'POST':
            data = {}
            if request.is_json:
                data = request.get_json()
            else:
                data = request.form
            name = data.get('name', None)

            if not name:
                return jsonify({"message": "User name is required."}), 400

            if not any(user["name"] == name for user in users):
                users.append({"name": name})  
                save_data(USERS_FILE, users)  

            return jsonify({"message": "User authenticated successfully.", "name": name}), 200

        return jsonify({"message": "This is the login endpoint. Use POST to login."}), 200

    except Exception as e:
        return jsonify({"message": "Error during login.", "error": str(e)}), 500


@app.route('/api/video-pairs', methods=['GET'])
def get_video_pairs():
    try:
        # json_file_path = os.path.join(os.getcwd(), 'video-pairs.json')
        json_file_path = os.path.join(os.path.dirname(__file__), "video-pairs.json")
        return send_file(json_file_path, mimetype='application/json')
    except Exception as e:
        return jsonify({"message": "Error loading video pairs.", "error": str(e)}), 500


@app.route('/api/vote', methods=['POST'])
def submit_votes():
    try:
        data = request.json
        name = data.get('name')
        user_votes = data.get('votes')

        # Validate input
        if not name or not user_votes:
            return jsonify({"message": "Name and votes are required."}), 400

        # Check if user is registered
        if not any(user['name'] == name for user in users):
            return jsonify({"message": "User not registered."}), 404

        # Save the votes
        votes[name] = user_votes
        save_data(VOTES_FILE, votes)

        return jsonify({"message": "Votes submitted successfully."}), 201
    except Exception as e:
        return jsonify({"message": "Error saving votes.", "error": str(e)}), 500
    

@app.route('/api/uploads/<path:video_path>', methods=['GET'])
def serve_video(video_path):
    try:
        # full_path = os.path.join(UPLOAD_FOLDER, video_path)
        upload_folder = os.path.join(os.path.dirname(__file__), 'uploads')
        full_path = os.path.join(upload_folder, video_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"File not found: {full_path}")
        return send_from_directory(upload_folder, video_path, mimetype='video/mp4')
    except Exception as e:
        return jsonify({"message": "Error loading video.", "error": str(e)}), 404

    
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route('/api/comment', methods=['GET', 'POST'])
def submit_comments():
    try:
        if request.method == 'POST':
            data = request.get_json()
            name = data.get('name')
            user_comments = data.get('comments', {})

            if not name:
                return jsonify({"message": "Name is required."}), 400

            # Check if user is registered
            if not any(user["name"] == name for user in users):
                return jsonify({"message": "User not registered."}), 404

            # Save the comment
            comments[name] = user_comments
            save_data(COMMENTS_FILE, comments)

            return jsonify({"message": "Comment added successfully."}), 201
    except Exception as e:
        return jsonify({"message": "Error handling comments.", "error": str(e)}), 500


@app.route("/api/hello")
def hello(): # test backend
    return jsonify(message="Hello from Flask API!")


if __name__ == '__main__':
    app.run(debug=True)
