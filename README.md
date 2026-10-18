# Tic Tac Toe

A tic tac toe game with an AI opponent built using minimax. Started as a pure pygame project, then extended to have a Python Flask backend with a JavaScript frontend, containerised with Docker and self-hosted on my own server behind Nginx.

## Live Demo
[Play it here](https://tictactoe.teodorstoyanov.dev)

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
├── fly.toml
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
docker compose up -d --build
```
The port is published on the Docker bridge (`172.17.0.1:5000`) so an Nginx container can proxy to it without exposing it to the internet. To try it locally instead, run `BIND_ADDR=127.0.0.1 docker compose up --build` and open `http://localhost:5000`.

## Dependencies

- pygame
- numpy
- flask
- flask-cors

## Note

This project was built with the assistance of Claude (Anthropic) as a learning exercise.