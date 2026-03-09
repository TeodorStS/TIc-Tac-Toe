# Tic Tac Toe

A tic tac toe game with an AI opponent built using minimax. Started as a pure pygame project, then extended to have a Python Flask backend with a JavaScript frontend, containerised with Docker.

## Project Structure

```
tic_tac_toe/
├── main.py            ← original standalone pygame version
├── game.py            ← shared game logic (no UI)
├── main_pygame.py     ← pygame version using game.py
├── server.py          ← Flask API
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── web/
    ├── index.html
    ├── style.css
    └── script.js
```

## How to run

**Pygame version**
```bash
pip install pygame numpy
python main.py
```

**JS frontend version (without Docker)**
```bash
pip install flask flask-cors numpy
python server.py
```
Then open `http://localhost:5000` in your browser.

**JS frontend version (with Docker)**
```bash
docker-compose up
```
Then open `http://localhost:5000` in your browser.

## Dependencies

- pygame
- numpy
- flask
- flask-cors

## Note

This project was built with the assistance of Claude (Anthropic) as a learning exercise.