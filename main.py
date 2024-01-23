import os
import requests
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
openai_api_key = os.environ.get("OPENAI_API_KEY")

@app.route("/", methods=["GET"])
def index():
    print("Index page was accessed.")
    return render_template('index.html')  # Render the index.html template

@app.route("/ask-gpt", methods=["POST"])
def ask_gpt():
    print("Received a request to /ask-gpt")
    user_input = request.json.get('query')
    if not user_input:
        print("No query provided in the request.")
        return jsonify({"error": "No query provided"}), 400

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {openai_api_key}"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": user_input}]
            },
            timeout=10
        )

        print(f"OpenAI API response status: {response.status_code}")
        if response.status_code == 200:
            gpt_response = response.json()['choices'][0]['message']['content'].strip()
            return jsonify({"response": gpt_response})
        else:
            error_details = response.json() if response.content else 'No response content'
            print(f"API request failed: {error_details}")
            return jsonify({"error": "API request failed", "status_code": response.status_code, "details": error_details}), 500

    except requests.exceptions.RequestException as e:
        print(f"Network error: {str(e)}")
        return jsonify({"error": "Network error", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
