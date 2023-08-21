import React, { useState, useEffect } from "react";
import "./HiddenSquareGame.css";

const generateRandomPattern = () => {
  const patterns = ["AAB", "BAA", "ABA"];
  const randomIndex = Math.floor(Math.random() * patterns.length);
  return patterns[randomIndex].split("");
};

const generateRandomBoardData = () => {
  return [
    generateRandomPattern(),
    generateRandomPattern(),
    generateRandomPattern(),
  ];
};

const HiddenSquareGame = () => {
  const [playerName, setPlayerName] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const [boardData, setBoardData] = useState(generateRandomBoardData());
  const [board, setBoard] = useState(
    boardData.map((row) => row.map(() => " "))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [bottomRowOpened, setBottomRowOpened] = useState(false);

//time logic 
  useEffect(() => {
    if (!gameOver && currentRow < 2 && timerStarted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameOver, currentRow, timerStarted]);


  //alert message 
  useEffect(() => {
    if (gameOver) {
      if (currentRow === 2) {
        alert(`Congratulations, ${playerName}! You won this Game in ${timer} seconds.`);
        handleWin();
      } else {
        alert(`Oops, ${playerName}! You clicked on "B". Please play again.`);
        handleLoss();
      }
    }
  }, [gameOver, currentRow, timer, playerName]);



  const handleSquareClick = (rowIndex, columnIndex) => {
    if (gameOver || board[rowIndex][columnIndex] !== " ") return;

    if (!timerStarted) {
      setTimerStarted(true);
    }

    if (rowIndex < 2 && !bottomRowOpened) {
      alert("Please start from the bottom row.");
      return;
    }

    const newBoard = [...board];
    newBoard[rowIndex][columnIndex] = boardData[rowIndex][columnIndex];

    if (boardData[rowIndex][columnIndex] === "B") {
      newBoard.forEach((row, rIndex) => {
        row.forEach((value, cIndex) => {
          newBoard[rIndex][cIndex] = boardData[rIndex][cIndex];
        });
      });
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    if (
      rowIndex === 2 ||
      (rowIndex === 1 && boardData[rowIndex][columnIndex] === "A")
    ) {
      setCurrentRow(currentRow + 1);
      if (rowIndex === 2) {
        setBottomRowOpened(true);
      }
    } else {
      setGameOver(true);
    }

    setBoard(newBoard);
  };
  
//reset the game 
  const resetGame = () => {
    const newBoardData = generateRandomBoardData();
    setBoardData(newBoardData);
    setBoard(newBoardData.map((row) => row.map(() => " ")));
    setCurrentRow(0);
    setGameOver(false);
    setTimer(0);
    setTimerStarted(false);
    setBottomRowOpened(false);
  };

  const handleWin = () => {
    setWins(wins + 1);
  };

  const handleLoss = () => {
    setLosses(losses + 1);
  };

  return (
    <div className="game-container">
      <h1>Target🎯Box</h1>
      <div className="player-info">
        <labelv htmlFor="playerName" style={{fontWeight:"bolder"}}> Player Name :-</labelv>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{background:"transparent",padding:"5px",color:"#000"}}
        />
      </div>
      <div className="scoreboard">
        <div className="score">
          <span>Wins: {wins}</span>
          <span>Losses: {losses}</span>
        </div>
      </div>
      <div className="timer">Time: {timer} seconds</div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((value, columnIndex) => (
            <div
              key={columnIndex}
              className={`square ${value === " " ? "hidden" : "revealed"}`}
              onClick={() => handleSquareClick(rowIndex, columnIndex)}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
      {gameOver && (
        <div className="game-over">
          {currentRow === 2 ? "You won!" : "Game over"}
        </div>
      )}
      <button className="reset-button" onClick={resetGame}>
        Play Again
      </button>
    </div>
  );
};

export default HiddenSquareGame;
