import os
import requests
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
openai_api_key = os.environ.get("OPENAI_API_KEY")

@app.route("/")
def index():
    # Render 'index.html' from the 'templates' folder
    return render_template("index.html")

@app.route("/ask-gpt", methods=["POST"])
def ask_gpt():
    user_input = request.json.get('query')
    if not user_input:
        return jsonify({"error": "No query provided"}), 400

    try:
        response = requests.post(
            "https://api.openai.com/v1/engines/gpt-4-1106-preview/completions",
            headers={"Authorization": f"Bearer {openai_api_key}"},
            json={"prompt": user_input, "max_tokens": 150},
            timeout=10
        )

        if response.status_code == 200:
            gpt_response_text = response.json()['choices'][0]['text'].strip()
            return jsonify({"response": gpt_response_text})
        else:
            return jsonify({"error": "API request failed", "status_code": response.status_code}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Network error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
