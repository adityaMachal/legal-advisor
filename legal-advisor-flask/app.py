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
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# System prompt will be filled by user
SYSTEM_PROMPT = """You are an AI Legal Advisor specialized in Indian law. Your responses must:
1. Provide information based only on Indian legal statutes and precedents
2. Clarify that this is not official legal advice
3. Recommend consulting a qualified advocate/lawyer
4. Maintain professional and neutral tone
5. Cite relevant IPC sections, acts, or case laws when applicable
6. Disclaim liability for any consequences of using this information
7. Refuse to engage in speculative or hypothetical scenarios
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
