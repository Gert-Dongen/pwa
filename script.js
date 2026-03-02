function launchConfetti() {
  const duration = 8 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const colors = ["#ff4d4d", "#ffd633", "#4da9ff", "#7ebdf8", "#ffffff"];

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    // Hoeveelheid confetti afnemen richting einde
    const particleCount = 1000 * (timeLeft / duration);

    // Grote burst
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: Math.random(), y: Math.random() * 0.2 },
      colors: colors,
      gravity: 0.5,
      scalar: Math.random() * 0.6 + 0.4 
    }));

    // Extra kleinere burst
    confetti(Object.assign({}, defaults, {
      particleCount: particleCount / 2,
      origin: { x: Math.random(), y: 0 },
      colors: colors,
      gravity: 0.6,
      scalar: Math.random() * 0.5 + 0.3
    }));
  }, 200);
}

const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = "red";
let gameOver = false;

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board = [];
  gameOver = false;
  document.getElementById("status").innerText = "Speler rood is aan de beurt";

  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
      board[r][c] = "";
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", handleClick);
      boardDiv.appendChild(cell);
    }
  }
}

function handleClick(e) {
  if (gameOver) return;

  const col = e.target.dataset.col;

  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === "") {
      board[r][col] = currentPlayer;
      updateBoard();

      if (checkWin(r, col)) {
        gameOver = true;

        // Confetti laten knallen
        launchConfetti();

        // Winstmelding iets later zodat confetti zichtbaar is
        setTimeout(() => {
          alert(`Speler ${currentPlayer} wint!`);
          resetGame();
        }, 500); // 0.5 seconde wachten ipv 0.1
        return;
      }

      // Wissel speler
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      document.getElementById("status").innerText = `Speler ${currentPlayer} is aan de beurt`;
      break;
    }
  }
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach(cell => {
    const r = cell.dataset.row;
    const c = cell.dataset.col;
    cell.classList.remove("red", "yellow");
    if (board[r][c]) {
      cell.classList.add(board[r][c]);
    }
  });
}

function checkWin(row, col) {
  const directions = [
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 1, c: 1 },
    { r: 1, c: -1 }
  ];

  for (let d of directions) {
    let count = 1;
    count += countDirection(row, col, d.r, d.c);
    count += countDirection(row, col, -d.r, -d.c);
    if (count >= 4) return true;
  }
  return false;
}

function countDirection(row, col, dr, dc) {
  let r = parseInt(row) + dr;
  let c = parseInt(col) + dc;
  let count = 0;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

function resetGame() {
  currentPlayer = "red";
  createBoard();
}

createBoard();

// Service Worker registratie (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}