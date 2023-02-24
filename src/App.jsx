import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import GameOver from "./components/GameOver";
import { boardDefault, generateWordSet } from "./Words";
import React, { useState, createContext, useEffect } from "react";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({attempt: 0, letter: 0});
  const [wordSet, setWordSet] = useState(new Set()); // Empty set for now
  const [correctWord, setCorrectWord] = useState("");
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false});


  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }, []); // Runs once

  const onEnter = () => {
    if(currAttempt.letter !== 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
    } else {
      alert("Word not found");
    }


    if(currWord === correctWord) {
      setGameOver({gameOver: true, guessedWord: true});
      return;
    }

    console.log(currAttempt);

    if (currAttempt.attempt === 5) {
      setGameOver({gameOver: true, guessedWord: false});
      return;
    }
  };

  const onDelete = () => {
    if (currAttempt.letter === 0) return; // Can't delete if you havent't written any letters
      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letter - 1] = "";
      setBoard(newBoard);
      setCurrAttempt({...currAttempt, letter: currAttempt.letter - 1});
  };

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letter > 4) return;
      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letter] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({attempt: currAttempt.attempt, letter: currAttempt.letter + 1,});
  };



  return (
    <div className="App">
      <nav><h1>Wordle</h1></nav>

      <AppContext.Provider value={{ board, setBoard, currAttempt, setCurrAttempt,  onSelectLetter, onDelete, onEnter, correctWord, disabledLetters, setDisabledLetters, gameOver, setGameOver, }}>
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
