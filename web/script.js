// The base URL of our Flask server. Every API call will start with this.
const API = "http://localhost:5000";

// These are references to the HTML elements we need to interact with.
// document.getElementById finds an element by its id attribute.
const boardEl  = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");


// --- RENDER BOARD ---
// This function takes the board array from the server (a 3x3 array of 0, 1, 2)
// and builds the HTML cells inside the #board div.
// It is called every time the board changes.
function renderBoard(boardState) {

  // Clear whatever cells are currently in the board div before re-drawing.
  // Without this, we would add 9 new cells on top of the existing 9 every time.
  boardEl.innerHTML = "";

  // Loop through each row (0, 1, 2)
  for (let row = 0; row < 3; row++) {

    // Loop through each column (0, 1, 2)
    for (let col = 0; col < 3; col++) {

      // Create a new div element for this cell
      const cell = document.createElement("div");

      // Give it the "cell" class so our CSS styles it correctly
      cell.classList.add("cell");

      // Read the value at this position from the board array.
      // 0 = empty, 1 = player (O), 2 = AI (X)
      const value = boardState[row][col];

      if (value === 1) {
        cell.textContent = "O";
        // Add "taken" class so CSS removes the pointer cursor
        cell.classList.add("taken");

      } else if (value === 2) {
        cell.textContent = "X";
        cell.classList.add("taken");

      } else {
        // Cell is empty — attach a click listener so the player can click it.
        // We pass the row and col so we know which cell was clicked when sending to the server.
        cell.addEventListener("click", function() {
          handleMove(row, col);
        });
      }

      // Add the finished cell into the board div
      boardEl.appendChild(cell);
    }
  }
}


// --- HANDLE PLAYER MOVE ---
// Called when a player clicks an empty cell.
// Sends the clicked row and col to the server and processes the response.
async function handleMove(row, col) {

  // fetch() sends an HTTP request to the server.
  // We use await so JavaScript waits for the response before continuing.
  const response = await fetch(API + "/move", {

    // POST because we are sending data and changing state on the server
    method: "POST",

    // Tell the server we are sending JSON
    headers: { "Content-Type": "application/json" },

    // Convert the row and col into a JSON string to send as the request body
    body: JSON.stringify({ row: row, col: col })
  });

  // Parse the response body from JSON into a JavaScript object
  const data = await response.json();

  // Re-draw the board with the updated state returned by the server
  renderBoard(data.board);

  // Check the winner field in the response and update the status text
  if (data.game_over) {
    if (data.winner === 1) {
      statusEl.textContent = "You win!";
    } else if (data.winner === 2) {
      statusEl.textContent = "AI wins.";
    } else {
      statusEl.textContent = "It's a draw.";
    }
  } else {
    statusEl.textContent = "Your turn";
  }
}


// --- HANDLE RESET ---
// Called when the New Game button is clicked.
// Tells the server to reset the board and re-renders the empty board.
async function handleReset() {

  const response = await fetch(API + "/reset", {
    method: "POST"
  });

  const data = await response.json();

  // Re-draw the now empty board
  renderBoard(data.board);

  // Reset the status message
  statusEl.textContent = "Your turn";
}


// --- INITIAL LOAD ---
// When the page first loads, fetch the current board state from the server.
// This means if you refresh the page mid-game, the board is restored correctly.
async function loadState() {
  const response = await fetch(API + "/state");
  const data = await response.json();
  renderBoard(data.board);
}


// Attach the reset function to the button's click event
resetBtn.addEventListener("click", handleReset);

// Run loadState immediately when the script is first executed
loadState();
