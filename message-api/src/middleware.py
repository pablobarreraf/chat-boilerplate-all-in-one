from functools import wraps
from flask import request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def verify_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Skip token verification for OPTIONS requests
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            auth_service_url = 'http://localhost:3000/auth/validate'
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(auth_service_url, headers=headers)
            
            if response.status_code != 200:
                return jsonify({'message': 'Invalid token'}), 401
                
            user_data = response.json()
            request.user = user_data['user']
            
        except requests.RequestException:
            return jsonify({'message': 'Auth service unavailable'}), 503
        except Exception:
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated