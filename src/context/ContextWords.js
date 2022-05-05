import React, { useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { dictEngToPol, dictPolToEng } from "./dict";
import { useAuth } from "./ContextAuth";
const WordsContext = React.createContext();
export const useWords = () => useContext(WordsContext);
const ContextWords = ({ children }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      listenWordsUpdate();
      handleUserWordsChange();
    }
  }, [user]);

  async function listenWordsUpdate() {
    let userDocRef = await collection(firestore, "users");
    onSnapshot(userDocRef, handleUserWordsChange);
  }
  async function updateUserWords(id, newWords) {
    let userDocRef = await doc(firestore, "users", id);
    let userDoc = await getDoc(userDocRef);
    let newWordsUniq = [];
    for (let word of newWords) {
      let userDocWords = userDoc.data().words;
      if (!userDocWords.includes(word)) newWordsUniq.push(word);
    }

    return updateDoc(userDocRef, {
      words: [...userDoc.data().words, ...newWordsUniq],
    });
  }
  async function handleUserWordsChange() {
    setLoading(true);
    let id = auth.currentUser.uid;
    let userDocRef = await doc(firestore, "users", id);
    let userDoc = await getDoc(userDocRef);
    setWords(userDoc.data().words);
    //only show loading on mounting
    setLoading(false);
  }
  async function deleteWord(delWord) {
    let userDocRef = await doc(firestore, "users", auth.currentUser.uid);
    let userDoc = await getDoc(userDocRef);

    return updateDoc(userDocRef, {
      words: [
        ...userDoc.data().words.filter((word) => {
          if (word == delWord) {
            return false;
          }
          return true;
        }),
      ],
    });
  }
  function getTranslatedWordsPairsArray(inputValues) {
    let polEngWordPairs = [];
    console.log(inputValues);
    for (let word of inputValues) {
      if (!word) continue;
      const lowerCaseWord = word.toLowerCase();
      if (Object.keys(dictEngToPol).includes(lowerCaseWord))
        polEngWordPairs.push(`${lowerCaseWord} ${translate(lowerCaseWord)}`);
      if (Object.keys(dictPolToEng).includes(lowerCaseWord))
        polEngWordPairs.push(`${translate(lowerCaseWord)} ${lowerCaseWord}`);
    }
    return polEngWordPairs;
  }
  function translate(word) {
    word.trim();

    if (word === "") return;
    if (!dictEngToPol[word] && !dictPolToEng[word]) {
      return "translation not found";
    }
    if (dictEngToPol[word]) return dictEngToPol[word];
    if (dictPolToEng[word]) return dictPolToEng[word];
  }
  return (
    <WordsContext.Provider
      value={{
        updateUserWords,
        deleteWord,
        translate,
        getTranslatedWordsPairsArray,
        dictEngToPol,
        dictPolToEng,
        words,
        loading,
      }}
    >
      {children}
    </WordsContext.Provider>
  );
};

export default ContextWords;
