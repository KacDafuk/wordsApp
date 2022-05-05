import React, { useEffect, useState, useRef } from "react";
import { useWords } from "../../../../context/ContextWords";
import Loading from "../../../loading/Loading";
import "./wordsContainer.scss";
const WordsContainer = () => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [error, setError] = useState(false);
  const { deleteWord, words, loading } = useWords();
  useEffect(() => {
    if (!loading) {
      //prevents showing loading spinner when deleting words
      setShowSpinner(false);
    }
  }, [loading]);

  if (loading && showSpinner) return <Loading />;
  return (
    <div className="words-container">
      {error ? "download failed" : ""}
      {words.length > 0
        ? words.map((word) => {
            console.log(word, "WORD INNER");
            const [engWord, translation] = word.split(" ");
            return (
              <div className="words-container__word">
                <div>
                  <span>{engWord}</span>
                  <span> - </span>
                  <span>{translation}</span>
                </div>
                <i
                  class="fa-solid fa-trash-can"
                  onClick={() => deleteWord(`${engWord} ${translation}`)}
                ></i>
              </div>
            );
          })
        : "no words found"}
    </div>
  );
};

export default WordsContainer;
