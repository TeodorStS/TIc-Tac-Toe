const API = "http://localhost:5000";

const boardEl  = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");

function renderBoard(boardState, winCells = []) {
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
        cell.addEventListener("click", function() {
          handleMove(row, col);
        });
      }

      // If this cell is part of the winning line, highlight it
      if (winCells.some(([wr, wc]) => wr === row && wc === col)) {
        cell.classList.add("win-cell");
      }

      boardEl.appendChild(cell);
    }
  }
}

// Finds which 3 cells form the winning line so we can highlight them
function getWinCells(boardState, player) {
  const b = boardState;
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
    body: JSON.stringify({ row: row, col: col })
  });

  const data = await response.json();

  if (data.game_over) {
    const winnerPlayer = data.winner === 1 ? 1 : 2;
    const winCells = data.winner !== "draw" ? getWinCells(data.board, winnerPlayer) : [];
    renderBoard(data.board, winCells);

    if (data.winner === 1)        statusEl.textContent = "you win.";
    else if (data.winner === 2)   statusEl.textContent = "ai wins.";
    else                          statusEl.textContent = "draw.";
  } else {
    renderBoard(data.board);
    statusEl.textContent = "your turn";
  }
}

async function handleReset() {
  const response = await fetch(API + "/reset", { method: "POST" });
  const data     = await response.json();
  renderBoard(data.board);
  statusEl.textContent = "your turn";
}

async function loadState() {
  const response = await fetch(API + "/state");
  const data     = await response.json();
  renderBoard(data.board);
}

resetBtn.addEventListener("click", handleReset);
loadState();