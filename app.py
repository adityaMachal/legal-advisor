# app.py
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
import os
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get API key from .env file
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# You can customize the model or add more configuration from .env
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-opus:beta")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# System prompt will be filled by user
SYSTEM_PROMPT = """
You are an AI assistant specialized in Indian Judiciary. 
Answer only questions about Indian law (Constitution, statutes, case law). 
If asked anything else, politely refuse.
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400
        
    if not OPENROUTER_API_KEY:
        return jsonify({"error": "API key not found. Please check your .env file."}), 500
    
    # Prepare the request payload for OpenRouter
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
    }
    
    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        bot_response = result["choices"][0]["message"]["content"]
        
        return jsonify({"response": bot_response})
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
