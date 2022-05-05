import React from "react";
import styles from "./wordHole.module.scss";
const WordHole = ({ active, mole }) => {
  if (active) {
    const { polWord, userTranslated } = mole;
    return (
      <div className={`${styles.wordHoleActive} ${styles.wordHole}`}>
        <div className={styles.wordHoleActiveInner}>
          <div>{polWord}</div>
          <div>{userTranslated}</div>
        </div>
      </div>
    );
  }
  return <div className={styles.wordHole}></div>;
};

export default WordHole;
