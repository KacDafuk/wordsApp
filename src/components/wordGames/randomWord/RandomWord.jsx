import React, { useEffect, useState } from "react";
import { useWords } from "../../../context/ContextWords";
import Loading from "../../loading/Loading";
import "./RandomWord.scss";
const sucessMessage = [
  "świetnie",
  "dobra robota",
  "tak trzymaj",
  "bardzo dobrze",
  "oby tak dalej",
];
const RandomWord = () => {
  const { words, loading } = useWords();
  const [wordGamePair, setWordGamePair] = useState(["", ""]);
  const [answer, setAnswer] = useState("");
  const [gameWon, setGameWon] = useState(false);
  const [newGameWait, setNewGameWait] = useState(1000);
  const [engToPol, setEngToPol] = useState(true);
  async function createRandomWords() {
    const [engWord, polWord] =
      words[Math.floor(Math.random() * words.length)].split(" ");
    setWordGamePair([engWord, polWord]);
    console.log([engWord, polWord]);
  }
  //turn off message option
  function handleNewGameWait() {
    if (newGameWait) {
      setNewGameWait(0);
      return;
    }
    setNewGameWait(1000);
  }
  function changeGameMode() {
    setEngToPol((prevState) => !prevState);
  }
  function getRandomMessage() {
    if (!newGameWait) return;
    return sucessMessage[
      Math.floor(Math.random() * (sucessMessage.length - 1))
    ];
  }
  function handleChange(e) {
    if (e.target.value == getWinningWord()) {
      setGameWon(true);

      setTimeout(() => {
        setAnswer("");
        setGameWon(false);
        createRandomWords();
      }, newGameWait);
    }
    setAnswer(e.target.value);
  }
  function handleNextWord() {
    setAnswer("");
    createRandomWords();
  }
  function getToTranslateWord() {
    return engToPol ? wordGamePair[0] : wordGamePair[1];
  }
  function getWinningWord() {
    return engToPol ? wordGamePair[1] : wordGamePair[0];
  }
  useEffect(() => {
    if (!loading) {
      createRandomWords();
    }
  }, [loading]);
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="game-container">
      <div className="game-container__random-word">{getToTranslateWord()}</div>
      {gameWon ? (
        <p className="game-container__winning-message">
          {getRandomMessage()} !
        </p>
      ) : (
        ""
      )}
      <input
        type="text"
        className="game-container__answer"
        value={answer}
        onChange={handleChange}
        placeholder="Tłumaczenie..."
      />
      <button className="game-container__btn" onClick={handleNextWord}>
        Następne słowo
      </button>
      <button className="game-container__btn" onClick={changeGameMode}>
        {engToPol ? "Z polskiego na angielski" : "Z angielskiego na polski"}
      </button>
      <button className="game-container__btn" onClick={handleNewGameWait}>
        W{newGameWait ? "y" : ""}łącz powiadomienia
      </button>
    </div>
  );
};

export default RandomWord;
