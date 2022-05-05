import React from "react";
import AddWords from "./addWords/AddWords";
import WordsContainer from "./wordsContainer/WordsContainer";
import "./words.scss";
const Words = () => {
  return (
    <main className="words">
      <h1>Add new words</h1>
      <AddWords />
      <WordsContainer />
    </main>
  );
};

export default Words;
