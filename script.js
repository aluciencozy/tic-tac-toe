// DOM elements
const boardSquare = document.querySelectorAll(".board-square");
const turn = document.querySelector(".turn");
const restartBtn = document.querySelector(".restart-btn");
const xScore = document.querySelector(".x-score");
const oScore = document.querySelector(".o-score");
const tieScore = document.querySelector(".tie-score");

// global vars
let squaresFilled = 0;
let inputLocked = false;

let scores = JSON.parse(localStorage.getItem("scores")) || {
  X: 0,
  O: 0,
  tie: 0,
};

let unmarkedSquares = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let playerMarkedSquares = [];
let computerMarkedSquares = [];

const WINNING_COMBINATIONS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["3", "6", "9"],
  ["1", "5", "9"],
  ["3", "5", "7"],
];

// event listeners
restartBtn.addEventListener("click", resetBoard);

boardSquare.forEach((square) => {
  square.addEventListener("click", playerMove);
});

// on page load
window.addEventListener("DOMContentLoaded", renderScores);

// functions
function resetBoard() {
  boardSquare.forEach((square) => {
    square.textContent = "";
    square.classList.remove("marked");
  });

  unmarkedSquares = [];
  for (let i = 1; i <= 9; i++) {
    unmarkedSquares.push(`${i}`);
  }

  playerMarkedSquares = [];
  computerMarkedSquares = [];

  squaresFilled = 0;
  inputLocked = false;

  turn.textContent = "It's X's Turn";
}

function playerMove(e) {
  if (e.currentTarget.classList.contains("marked") || inputLocked) return;

  markBoard(e.currentTarget.id, "X");
  turn.textContent = "It's O's Turn";
  inputLocked = true;
  if (checkWinner("X")) return;

  computerMove();
}

function computerMove() {
  const randomIndex = Math.floor(
    Math.random() *
      (9 - playerMarkedSquares.length - computerMarkedSquares.length)
  );
  const randomSquareId = unmarkedSquares[randomIndex];

  setTimeout(() => {
    markBoard(randomSquareId, "O");
    turn.textContent = "It's X's Turn";
    inputLocked = false;
    checkWinner("O");
  }, 1500);
}

function markBoard(id, char) {
  if (squaresFilled === 9) {
    return;
  }

  const square = document.getElementById(id);
  if (square.classList.contains("marked")) return;

  // adjust element
  square.classList.add("marked");
  square.textContent = char;

  // add to markedSquares array and squaresFilled var
  if (char === "X") playerMarkedSquares.push(square.id);
  else computerMarkedSquares.push(square.id);
  squaresFilled++;

  // remove from unmarkedSquares
  const indexToRemove = unmarkedSquares.indexOf(square.id);
  if (indexToRemove !== -1) {
    unmarkedSquares.splice(indexToRemove, 1);
  }
}

function checkWinner(char) {
  // get the arr of the current player and check if they won
  let arr;
  if (char === "X") arr = playerMarkedSquares;
  else arr = computerMarkedSquares;

  const win = WINNING_COMBINATIONS.some((combination) => {
    return combination.every((square) => arr.includes(square));
  });

  // check if this player won
  if (win) {
    turn.textContent = `Player ${char} Wins!`;
    boardSquare.forEach((square) => {
      square.classList.add("marked");
    });
    scores[char]++;
    renderScores();
  }

  // If no one has won and all squares are filled its a tie
  if (!win && squaresFilled === 9 && char === "X") {
    turn.textContent = `It's a Tie!`;
    boardSquare.forEach((square) => {
      square.classList.add("marked");
    });
    scores["tie"]++;
    renderScores();
  }

  return win;
}

function renderScores() {
  xScore.textContent = `${scores["X"]}`;
  oScore.textContent = `${scores["O"]}`;
  tieScore.textContent = `${scores["tie"]}`;

  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("scores", JSON.stringify(scores));
}

// todo enhance project: add leaderboard with node.js
