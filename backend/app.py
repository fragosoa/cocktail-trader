# This is a flask app that serves as the backend for the web application.
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
# This will run the Flask app on port 5000 and allow it to be accessed from any IP address.
# Make sure to install Flask and Flask-CORS before running this app.
# You can install them using pip:
# pip install Flask Flask-CORS