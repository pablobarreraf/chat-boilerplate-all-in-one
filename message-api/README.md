# Message API Setup Guide (macOS)

## Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Node.js Auth API running on port 3000

## Step 1: Create Project & Virtual Environment
mkdir message-api
cd message-api
python3 -m venv venv

## Step 2: Activate Virtual Environment
source venv/bin/activate

## Step 3: Install Dependencies
pip3 install flask flask-cors requests python-dotenv

## Step 4: Create Environment File
# Create .env in root directory with:
PORT=5001

## Step 5: Run the Server
python3 src/app.py

## Step 6: Test the API
# First get a token from the Auth API by logging in:
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test1@example.com",
    "password": "password123"
}'

# Then use that token to test the messages API:
# Send Message:
curl --location 'http://localhost:5001/messages' \
--header 'Authorization: Bearer <your-token>' \
--header 'Content-Type: application/json' \
--data '{
    "content": "Hello, World!"
}'

# Get Messages:
curl --location 'http://localhost:5001/messages' \
--header 'Authorization: Bearer <your-token>'

## Notes
- Make sure the Auth API (Node.js) is running on port 3000
- The database is in-memory, messages clear on restart
- Token validation is handled by the Auth API
- If you still get "command not found", you might need to install Python3:
  brew install python3