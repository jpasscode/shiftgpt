from flask import Flask, jsonify, request, render_template, session
import os
import requests
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Set a secret key for session management
openai_api_key = os.environ.get("OPENAI_API_KEY")

# In-memory storage for chat histories (For demo purposes. Use a database for production)
chat_histories = {}

@app.route("/", methods=["GET"])
def index():
    session_id = str(uuid.uuid4())  # Generate a unique session ID
    session['session_id'] = session_id  # Store session ID in Flask session
    chat_histories[session_id] = []  # Initialize chat history for this session
    return render_template('index.html', session_id=session_id)

@app.route("/ask-gpt", methods=["POST"])
def ask_gpt():
    session_id = session.get('session_id')
    if not session_id or session_id not in chat_histories:
        return jsonify({"error": "Invalid session"}), 400

    user_input = request.json.get('query')
    if not user_input:
        return jsonify({"error": "No query provided"}), 400

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {openai_api_key}"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": user_input}]
            },
            timeout=60
        )

        if response.status_code == 200:
            gpt_response = response.json()['choices'][0]['message']['content'].strip()
            chat_histories[session_id].append((user_input, gpt_response))  # Store in chat history
            return jsonify({"response": gpt_response})
        else:
            error_details = response.json() if response.content else 'No response content'
            return jsonify({"error": "API request failed", "status_code": response.status_code, "details": error_details}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Network error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
