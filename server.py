from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from game import *
import os

app = Flask(__name__)
CORS(app)

game_over = False

WEB_FOLDER = os.path.join(os.path.dirname(__file__), "web")

@app.route('/')
def index():
    return send_from_directory(WEB_FOLDER, "index.html")

@app.route('/state', methods=['GET'])
def get_state():
    return jsonify({
        "board": board.tolist(),
        "game_over": game_over
    })

@app.route('/move', methods=['POST'])
def player_move():
    global game_over

    if game_over:
        return jsonify({"error": "Game is over. Please reset."}), 400

    data = request.get_json()
    row = data.get("row")
    col = data.get("col")

    if not available_square(row, col):
        return jsonify({"error": "Square already taken."}), 400

    mark_square(row, col, 1)
    if check_win(1):
        game_over = True
        return jsonify({"board": board.tolist(), "winner": 1, "game_over": True})

    if is_board_full():
        game_over = True
        return jsonify({"board": board.tolist(), "winner": "draw", "game_over": True})

    best_move()
    if check_win(2):
        game_over = True
        return jsonify({"board": board.tolist(), "winner": 2, "game_over": True})

    if is_board_full():
        game_over = True
        return jsonify({"board": board.tolist(), "winner": "draw", "game_over": True})

    return jsonify({"board": board.tolist(), "winner": None, "game_over": False})

@app.route('/reset', methods=['POST'])
def reset():
    global game_over
    for row in range(BOARD_ROWS):
        for col in range(BOARD_COLS):
            board[row][col] = 0
    game_over = False
    return jsonify({"board": board.tolist(), "game_over": False})

# catch-all is LAST so it never intercepts the API routes above
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(WEB_FOLDER, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)