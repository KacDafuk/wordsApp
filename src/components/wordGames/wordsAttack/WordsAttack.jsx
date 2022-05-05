import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWords } from "../../../context/ContextWords";
import styles from "./wordsAttack.module.scss";
import { Link } from "react-router-dom";
const ENEMIES_ARRAY = [];
const ENEMY_COLOR = "red";
const score = { count: 0 };
const EarthDefense = () => {
  const canvRef = useRef();
  const animationRef = useRef();
  const animationRefFrames = useRef(0);
  const { words } = useWords();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState([true, true, true]);
  function toogleGameState() {
    setLives([true, true, true]);
    setScore(0);
  }

  class Enemy {
    constructor(canv) {
      this.x = Math.random() * canv.width;
      //prevent words from being out of bound
      if (this.x - 100 < 0) this.x += 120;
      if (this.x + 100 > canv.width) this.x -= 120;
      this.y = Math.random() * 50;
      this.size = 100;
      let randomWords =
        words[Math.floor(Math.random() * words.length)].split(" ");
      this.polWord = randomWords[1];
      this.translation = randomWords[0];

      this.userTranslated = ""; //translation made by user
    }
    draw(canv) {
      //passing canv as an argument limits you to writing only one character of translation of a word when returing to the game
      const ctx = canv.getContext("2d");
      ctx.fillStyle = ENEMY_COLOR;
      ctx.font = "30px serif";
      ctx.fillStyle = "white";
      ctx.fillText(this.polWord, this.x, this.y);
      ctx.fillText(this.userTranslated, this.x, this.y + 30);
    }
    update() {
      const gameLost = (lives) => lives.lastIndexOf(false) >= lives.length - 2;
      const lostLive = (enemy) => enemy.y + 30 > window.innerHeight;

      this.y += 0.5;
      if (lostLive(this)) {
        ENEMIES_ARRAY.splice(ENEMIES_ARRAY.indexOf(this), 1); //remove the enemy
        setLives((prevLives) => {
          if (gameLost(prevLives)) {
            return [false, false, false]; //returns all lives set to false
          }
          let newLivesArray = prevLives.map((live) => live);
          let lastLostLiveIdx = prevLives.lastIndexOf(false);
          if (lastLostLiveIdx == -1) {
            newLivesArray[0] = false;
          } else {
            newLivesArray[lastLostLiveIdx + 1] = false;
          }
          return newLivesArray;
        });
      }
    }
  }

  function animate() {
    if (lives[lives.length - 1] == false) return;
    const ctx = canvRef.current.getContext("2d");
    const generateNewEnemies = () => {
      ENEMIES_ARRAY.push(new Enemy(canvRef.current));
    };
    const redrawBackground = () => {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvRef.current.width, canvRef.current.width);
      ctx.fillStyle = "white";
    };
    redrawBackground();
    if (animationRefFrames.current % 70 == 0) {
      generateNewEnemies();
    }
    for (let enemy of ENEMIES_ARRAY) {
      enemy.update();
      enemy.draw(canvRef.current);
    }
    animationRefFrames.current++;

    animationRef.current = requestAnimationFrame(animateGame);
  }

  useEffect(() => {
    const removeListeners = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
    const handleKeyDown = (e) => {
      translateEnemyWords(e, score);
    };
    const handleResize = () => {
      canvRef.current.width = window.innerWidth;
      canvRef.current.height = window.innerHeight;
    };
    canvRef.current.width = window.innerWidth;
    canvRef.current.height = window.innerHeight;
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return removeListeners;
  }, []);

  const animateGame = useCallback(animate, [lives]);
  useEffect(() => {
    //event listeners/animation functions
    const removeAnimation = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    const playerLost = () => {
      return lives[lives.length - 1] == false;
    };
    const setUpGame = () => {
      function clearEnemy() {
        ENEMIES_ARRAY.splice(0);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (playerLost()) {
        while (ENEMIES_ARRAY.length > 0) {
          clearEnemy();
        }
        return;
      }
      animationRef.current = requestAnimationFrame(animateGame);
    };
    setUpGame();
    return removeAnimation;
  }, [animateGame]);

  function translateEnemyWords(e, score) {
    const userCorrectInput = (enemy, translatedLenght) =>
      enemy.translation.slice(0, translatedLenght + 1) ==
      enemy.userTranslated + e.key;
    const userCorrectWord = (enemy, translatedLenght) =>
      translatedLenght + 1 == enemy.translation.length;
    const handleFullTranslation = (enemy) => {
      ENEMIES_ARRAY.splice(ENEMIES_ARRAY.indexOf(enemy), 1);
      setScore((prevScore) => prevScore + 1);
    };
    for (let i = 0; i < ENEMIES_ARRAY.length; i++) {
      const enemy = ENEMIES_ARRAY[i];
      const translatedLenght = enemy.userTranslated.length;
      if (userCorrectInput(enemy, translatedLenght)) {
        enemy.userTranslated += e.key;
        if (userCorrectWord(enemy, translatedLenght)) {
          handleFullTranslation(enemy);
          i = i - 1;
        }
        continue;
      }
      enemy.userTranslated = "";
    }
  }
  function gameOver() {
    return lives[lives.length - 1] == false;
  }
  return (
    <>
      <span className={styles.score}>PUNKTY {`${score}`}</span>
      <span className={styles.livesContainer}>
        {lives.map((live) => {
          if (live)
            return (
              <i
                className={`${styles.live} ${styles.liveActive} fa-solid fa-heart`}
              />
            );
          return <i className={`${styles.live}  fa-solid fa-heart-crack`} />;
        })}
      </span>
      <canvas ref={canvRef} />
      <div>
        <div
          className="modal"
          style={{ display: `${gameOver() ? "grid" : "none"}` }}
        >
          <div className="modal__inner">
            <button onClick={toogleGameState} className="modal__inner__btn">
              Zagraj Ponownie
            </button>
            <button className="modal__inner__btn modal__inner__btn--end-game">
              <Link to="/words">Zakończ gre</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EarthDefense;
