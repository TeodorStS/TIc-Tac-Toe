from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from game import *
import os

app = Flask(__name__)
CORS(app)

WEB_FOLDER = os.path.join(os.path.dirname(__file__), "web")

@app.route('/')
def index():
    return send_from_directory(WEB_FOLDER, "index.html")

@app.route('/new', methods=['GET'])
def new_game():
    # Returns a fresh empty board — no state stored on server
    return jsonify({
        "board": new_board().tolist(),
        "game_over": False,
        "winner": None
    })

@app.route('/move', methods=['POST'])
def player_move():
    data = request.get_json()

    # The browser sends the current board with every request
    import numpy as np
    board = np.array(data.get("board"))
    row = data.get("row")
    col = data.get("col")

    if not available_square(board, row, col):
        return jsonify({"error": "Square already taken."}), 400

    mark_square(board, row, col, 1)
    if check_win(board, 1):
        return jsonify({"board": board.tolist(), "winner": 1, "game_over": True})

    if is_board_full(board):
        return jsonify({"board": board.tolist(), "winner": "draw", "game_over": True})

    best_move(board)
    if check_win(board, 2):
        return jsonify({"board": board.tolist(), "winner": 2, "game_over": True})

    if is_board_full(board):
        return jsonify({"board": board.tolist(), "winner": "draw", "game_over": True})

    return jsonify({"board": board.tolist(), "winner": None, "game_over": False})

# catch-all is LAST so it never intercepts the API routes above
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(WEB_FOLDER, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)