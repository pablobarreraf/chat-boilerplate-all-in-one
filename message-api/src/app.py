from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from middleware import verify_token
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.route('/', methods=['GET'])
def test_route():
    return jsonify({"message": "Server is running"}), 200

@app.route('/messages', methods=['OPTIONS'])
def messages_options():
    return '', 204

@app.route('/messages', methods=['POST'])
@verify_token
def send_message():
    data = request.get_json()
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Message content is required'}), 400
    
    message = db.save_message(
        sender_id=request.user['userId'],
        content=data['content']
    )
    
    return jsonify(message), 201

@app.route('/messages', methods=['GET'])
@verify_token
def get_messages():
    messages = db.get_messages()
    return jsonify(messages), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True, host='0.0.0.0')