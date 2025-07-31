const headingEl = document.getElementById("game-heading");
const gameSquares = Array.from(document.querySelectorAll(".game-square"));
const restartBtn = document.getElementById("restart-button");

let currentTurn = "X";
let clicks = 0;
let winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

gameSquares.forEach((button, i) => {
  button.addEventListener("click", (e) => {
    clicks++;
    if (currentTurn === "X") {
      fillInWinningCombination(i, "X");
      e.target.textContent = "X";
      if (isWinner("X")) {
        headingEl.textContent = "Player 1 Won!";
        restartBtn.style.display = "block";
        disableAllBtns();
        return;
      }
      headingEl.textContent = "Player 2's Turn";
      currentTurn = "O";
      button.disabled = true;
    } else if (currentTurn === "O") {
      fillInWinningCombination(i, "O");
      e.target.textContent = "O";
      if (isWinner("O")) {
        headingEl.textContent = "Player 2 Won!";
        restartBtn.style.display = "block";
        disableAllBtns();
        return;
      }
      headingEl.textContent = "Player 1's Turn";
      currentTurn = "X";
      button.disabled = true;
    }
    if (clicks === 9) {
      headingEl.textContent = "Tie Game!";
      restartBtn.style.display = "block";
    }
  });
});

restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  gameSquares.forEach((square) => (square.textContent = ""));
  headingEl.textContent = "Player 1's Turn";
  gameSquares.forEach((button) => (button.disabled = false));
  clicks = 0;
  currentTurn = "X";
  winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
});

function disableAllBtns() {
  gameSquares.forEach((button) => (button.disabled = true));
}

function fillInWinningCombination(n, player) {
  for (let i = 0; i < winningCombinations.length; i++) {
    for (let j = 0; j < winningCombinations[i].length; j++) {
      if (winningCombinations[i][j] === n) {
        winningCombinations[i][j] = player;
      }
    }
  }
}

function isWinner(player) {
  return (
    winningCombinations.filter((arr) => arr.every((val) => val === player))
      .length === 1
  );
}
