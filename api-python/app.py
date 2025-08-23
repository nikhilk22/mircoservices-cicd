from flask import Flask, jsonify
import os


app = Flask(__name__)


@app.route('/hello')
def hello():
return jsonify({ 'service': 'api-python', 'message': 'Hello from Python API!' })


if __name__ == '__main__':
port = int(os.getenv('PORT', 5000))
app.run(host='0.0.0.0', port=port)
