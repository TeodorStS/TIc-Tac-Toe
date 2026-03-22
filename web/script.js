const API = "";

const boardEl  = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");

// Browser now owns the board state
let boardState = null;
let gameOver   = false;

function renderBoard(winCells = []) {
  boardEl.innerHTML = "";

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell  = document.createElement("div");
      cell.classList.add("cell");

      const value = boardState[row][col];

      if (value === 1) {
        cell.textContent = "O";
        cell.classList.add("taken", "player");

      } else if (value === 2) {
        cell.textContent = "X";
        cell.classList.add("taken", "ai");

      } else {
        if (!gameOver) {
          cell.addEventListener("click", function() {
            handleMove(row, col);
          });
        }
      }

      if (winCells.some(([wr, wc]) => wr === row && wc === col)) {
        cell.classList.add("win-cell");
      }

      boardEl.appendChild(cell);
    }
  }
}

function getWinCells(board, player) {
  const b = board;
  for (let r = 0; r < 3; r++)
    if (b[r][0] === player && b[r][1] === player && b[r][2] === player)
      return [[r,0],[r,1],[r,2]];
  for (let c = 0; c < 3; c++)
    if (b[0][c] === player && b[1][c] === player && b[2][c] === player)
      return [[0,c],[1,c],[2,c]];
  if (b[0][0] === player && b[1][1] === player && b[2][2] === player)
    return [[0,0],[1,1],[2,2]];
  if (b[0][2] === player && b[1][1] === player && b[2][0] === player)
    return [[0,2],[1,1],[2,0]];
  return [];
}

async function handleMove(row, col) {
  const response = await fetch(API + "/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Send the current board along with the move
    body: JSON.stringify({ board: boardState, row: row, col: col })
  });

  const data = await response.json();

  if (data.error) {
    console.log("Server error:", data.error);
    return;
  }

  // Update the browser's copy of the board
  boardState = data.board;

  if (data.game_over) {
    gameOver = true;
    const winnerPlayer = data.winner === 1 ? 1 : 2;
    const winCells = data.winner !== "draw" ? getWinCells(boardState, winnerPlayer) : [];
    renderBoard(winCells);

    if (data.winner === 1)       statusEl.textContent = "you win.";
    else if (data.winner === 2)  statusEl.textContent = "ai wins.";
    else                         statusEl.textContent = "draw.";
  } else {
    renderBoard();
    statusEl.textContent = "your turn";
  }
}

async function handleReset() {
  const response = await fetch(API + "/new");
  const data     = await response.json();
  boardState = data.board;
  gameOver   = false;
  renderBoard();
  statusEl.textContent = "your turn";
}

// On page load, fetch a fresh board from the server
handleReset();

resetBtn.addEventListener("click", handleReset);