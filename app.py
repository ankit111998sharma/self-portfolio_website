from flask import Flask, request, redirect, url_for, render_template, jsonify
from flask_cors import CORS
import csv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Define the directory for static files and templates relative to this script
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_FOLDER = os.path.join(BASE_DIR, 'static')
TEMPLATE_FOLDER = os.path.join(BASE_DIR, 'templates')

app.static_folder = STATIC_FOLDER
app.template_folder = TEMPLATE_FOLDER

CSV_FILE = 'messages.csv'
HEADERS = ['Timestamp', 'Name', 'Email', 'Message']

# Ensure the CSV file exists with headers
def ensure_csv_exists():
    # Check if the CSV file exists in the same directory as app.py
    if not os.path.exists(os.path.join(BASE_DIR, CSV_FILE)):
        with open(os.path.join(BASE_DIR, CSV_FILE), 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(HEADERS)

# Call this once when the application starts
ensure_csv_exists()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/contact_submit', methods=['POST'])
def contact_submit():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        # Basic validation
        if not name or not email or not message:
            return jsonify({'success': False, 'message': 'All fields are required!'}), 400

        timestamp = datetime.now().isoformat()

        try:
            # Open the CSV file in append mode, ensuring it's in the same directory
            with open(os.path.join(BASE_DIR, CSV_FILE), 'a', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow([timestamp, name, email, message])
            print(f"Message from {name} saved to {CSV_FILE}")
            # Respond with JSON for AJAX request
            return jsonify({'success': True, 'message': 'Message sent successfully!'}), 200
        except Exception as e:
            print(f"Error writing to CSV: {e}")
            return jsonify({'success': False, 'message': 'Failed to save message.'}), 500

if __name__ == '__main__':
    # Create 'static' and 'templates' directories if they don't exist
    os.makedirs(STATIC_FOLDER, exist_ok=True)
    os.makedirs(TEMPLATE_FOLDER, exist_ok=True)

    # To run in debug mode (development only)
    app.run(debug=True, port=5000)
    # For production, use: app.run(port=5000)