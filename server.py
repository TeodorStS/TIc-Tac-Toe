from flask import Flask, jsonify, request
from flask_cors import CORS
from game import *

app = Flask(__name__)
CORS(app)

game_over = False

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

    # Player move
    mark_square(row, col, 1)
    if check_win(1):
        game_over = True
        return jsonify({"board": board.tolist(), "winner": 1, "game_over": True})

    if is_board_full():
        game_over = True
        return jsonify({"board": board.tolist(), "winner": "draw", "game_over": True})

    # AI move
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
