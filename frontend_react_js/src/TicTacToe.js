import React, { useState } from "react";
import "./TicTacToe.css";

// Square Component
// PUBLIC_INTERFACE
function Square({ value, onClick, isWinning, disabled }) {
  /** Square in the tic tac toe board */
  return (
    <button
      className={`ttt-square${isWinning ? " ttt-winning" : ""}`}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell: ${value}` : "Cell: empty"}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// Board Component
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine, disabled }) {
  /** 3x3 Tic Tac Toe Board with status of each square */
  const createRow = (row) =>
    [0, 1, 2].map((col) => {
      const idx = row * 3 + col;
      return (
        <Square
          key={idx}
          value={squares[idx]}
          onClick={() => onSquareClick(idx)}
          isWinning={winningLine && winningLine.includes(idx)}
          disabled={disabled}
        />
      );
    });

  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row}>
          {createRow(row)}
        </div>
      ))}
    </div>
  );
}

/**
 * Checks board for a winner.
 * Returns the winner symbol ("X" or "O") and the winning line or null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

/**
 * Detect full board (draw)
 */
function isBoardFull(squares) {
  return squares.every((cell) => cell !== null);
}

// Main Game Component
// PUBLIC_INTERFACE
const TicTacToe = () => {
  /** Main game logic and rendering for Tic Tac Toe */

  // State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winnerObj = calculateWinner(squares);
  const gameOver = winnerObj || isBoardFull(squares);

  // Handlers
  const handleSquareClick = (idx) => {
    if (squares[idx] || gameOver) return;

    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // Status messaging
  let status;
  if (winnerObj) {
    status = (
      <span>
        <span className="ttt-winner-text">{winnerObj.winner}</span> wins! 🎉
      </span>
    );
  } else if (isBoardFull(squares)) {
    status = (
      <span>
        <span className="ttt-draw-text">Draw!</span>
      </span>
    );
  } else {
    status = (
      <span>
        Next player:{" "}
        <span className={xIsNext ? "ttt-x" : "ttt-o"}>
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-container">
      <h1 className="ttt-title" tabIndex={0}>Tic Tac Toe</h1>
      <div className="ttt-status" tabIndex={0}>{status}</div>
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        winningLine={winnerObj ? winnerObj.line : null}
        disabled={!!winnerObj}
      />
      <button
        className="ttt-restart-btn"
        onClick={handleRestart}
        aria-label="Restart Game"
      >
        Restart
      </button>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="ttt-footer-link"
          >
            Made with React
          </a>
        </span>
      </footer>
    </div>
  );
};

export default TicTacToe;
