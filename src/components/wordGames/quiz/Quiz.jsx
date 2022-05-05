import React, { useEffect, useState } from "react";
import { useWords } from "../../../context/ContextWords";
import Loading from "../../loading/Loading";
import "./quiz.scss";
const MAX_ANSWERS_COUNT = 4;
const CORRECT_ANSWER_IDX = 0;
const Quiz = () => {
  const [creatingNewGame, setCreatingNewGame] = useState(true);
  const [answersIdx, setAnswersIdx] = useState([]);
  const [correctAnswerIdx, setCorrectAnswerIdx] = useState(0);
  const [higlightAnswerIdx, setHiglightAnswerIdx] = useState(-1);
  const { words, loading } = useWords();
  useEffect(() => {
    if (words.length > 0) createNewGame(words);
  }, [words]);

  function createNewGame(userWords) {
    if (!userWords) userWords = words;
    const newAnswersIdx = [];
    for (let i = 0; i < MAX_ANSWERS_COUNT; i++) {
      let searchNewIdx = true;
      if (i === userWords.length) break;
      while (searchNewIdx) {
        let newIdx = Math.floor(Math.random() * userWords.length);
        if (newAnswersIdx.includes(newIdx)) continue;
        newAnswersIdx.push(newIdx);
        break;
      }
    }
    setAnswersIdx(newAnswersIdx);
    setCorrectAnswerIdx(Math.floor(Math.random() * newAnswersIdx.length));
    setCreatingNewGame(false);
  }
  function handleAnswer(idx) {
    setHiglightAnswerIdx(idx);
    if (idx == correctAnswerIdx) {
      //allows to display background for correct answer
      setTimeout(() => {
        createNewGame();
      }, 500);
    }
  }
  console.log(words, "QUIZ WORDS");
  function getHighlihtClass(highlight, idx) {
    if (!highlight) return;
    setTimeout(() => {
      setHiglightAnswerIdx(-1);
    }, 500);
    if (idx == correctAnswerIdx) {
      return "quiz-container__answers__answer--correct";
    }
    return "quiz-container__answers__answer--wrong";
  }
  if (loading) {
    return <Loading />;
  }
  //quick fix for creating new game render, modify later
  if (creatingNewGame) return "";

  return (
    <main className="quiz-container">
      <section className="quiz-container__question">
        {words[answersIdx[correctAnswerIdx]].split(" ")[1]}
      </section>
      <section className="quiz-container__answers">
        {answersIdx.map((answerIdx, idx) => {
          let highlight = false;
          if (idx == higlightAnswerIdx) highlight = true;
          if (answerIdx === undefined) return "";
          return (
            <button
              className={`quiz-container__answers__answer ${getHighlihtClass(
                highlight,
                idx
              )}`}
              onClick={() => handleAnswer(idx)}
            >
              {words[answerIdx].split(" ")[0]}
            </button>
          );
        })}
      </section>
    </main>
  );
};

export default Quiz;
