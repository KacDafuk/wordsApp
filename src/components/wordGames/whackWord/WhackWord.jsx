import { clear } from "@testing-library/user-event/dist/clear";
import React, { useEffect, useReducer, useRef } from "react";
import { useWords } from "../../../context/ContextWords";
import Loading from "../../loading/Loading";
import styles from "./whackWords.module.scss";
import WordHole from "./wordHole/WordHole";
const initialState = {
  score: 0,
  curMoleIdx: null,
  moleWordInfo: {},
  timer: 60,
  endGame: false,
};

const WhackWord = () => {
  const { words, loading } = useWords();
  const timerIntervalRef = useRef();
  const newGameIntervalRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);
  function userCorrectInput(input, translation) {
    return translation.startsWith(input);
  }
  function userWon(input, translation) {
    return input.length == translation.length;
  }
  function createMoles() {
    const molesArray = [];
    for (let i = 0; i < 6; i++) {
      molesArray.push(
        <WordHole
          active={state.curMoleIdx == i}
          mole={state.moleWordInfo}
          key={i}
        />
      );
    }
    return molesArray;
  }
  function setGameIntervals() {
    newGameIntervalRef.current = setInterval(() => {
      dispatch({ type: "newGame" });
    }, 7000);
    timerIntervalRef.current = setInterval(() => {
      dispatch({ type: "updateTime" });
    }, 1000);
  }

  function reducer(state, action) {
    switch (action.type) {
      case "newGame": {
        //generate random word and random mole idx for new game
        const [engWord, polWord] =
          words[Math.floor(Math.random() * words.length)].split(" ");
        const moleWordInfo = { polWord, engWord, userTranslated: "" };
        const moleIdx = Math.floor(Math.random() * 6);

        console.log(
          { ...state, moleWordInfo, curMoleIdx: moleIdx },
          "DISPATCH STATE"
        );
        return { ...state, moleWordInfo, curMoleIdx: moleIdx };
      }
      case "updateTranslation": {
        const userInputChar = action.payload;
        const { engWord, userTranslated } = state.moleWordInfo;
        const newUserTranslated = userTranslated + userInputChar;
        if (userCorrectInput(newUserTranslated, engWord)) {
          if (userWon(newUserTranslated, engWord)) {
            setTimeout(() => dispatch({ type: "newGame" }), 0);
            clearInterval(newGameIntervalRef.current);
            newGameIntervalRef.current = setInterval(
              () => dispatch({ type: "newGame" }),
              7000
            );
            return { ...state, score: state.score + 1 };
          }
          return {
            ...state,
            moleWordInfo: {
              ...state.moleWordInfo,
              userTranslated: newUserTranslated,
            },
          };
        }
        return {
          ...state,
          moleWordInfo: { ...state.moleWordInfo, userTranslated: "" },
        };
      }
      case "updateTime": {
        if (state.timer == 0) {
          clearInterval(timerIntervalRef.current);
          return { ...state, endGame: true };
        }
        return { ...state, timer: state.timer - 1 };
      }
      case "playAgain":
        setGameIntervals();
        return { ...state, timer: 60, endGame: false, score: 0 };
    }
  }

  const handleKeyDown = (e) =>
    dispatch({ type: "updateTranslation", payload: e.key });

  useEffect(() => {
    const removeIntervalsAndListeners = () => {
      window.removeEventListener("keydown", handleKeyDown);
      clear(newGameIntervalRef.current);
      clear(timerIntervalRef.current);
    };
    if (!loading) {
      dispatch({ type: "newGame" });
      setGameIntervals();
      window.addEventListener("keydown", handleKeyDown);
    }
    return removeIntervalsAndListeners;
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <div className={styles.gameInfo}>
        <span className={styles.score}>Punkty {state.score}</span>

        <span className={styles.timer}>Czas {state.timer}s</span>
      </div>

      <div className={styles.molesContainer}>
        {createMoles()}
        <div
          className={`${styles.endGameModal} ${
            state.endGame ? styles.endGameModalActive : ""
          }`}
        >
          <div className="modal">
            <div className="modal__inner">
              <button
                onClick={() => dispatch({ type: "playAgain" })}
                className="modal__inner__btn"
              >
                Zagraj Ponownie
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WhackWord;
