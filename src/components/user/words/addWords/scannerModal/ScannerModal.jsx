import React, { useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import { useAuth } from "../../../../../context/ContextAuth";
import { useWords } from "../../../../../context/ContextWords";
const worker = new createWorker();
const ScannerModal = ({ show, close }) => {
  const [error, setError] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);
  const fileRef = useRef();
  const { getTranslateWordsPairsArray, updateUserWords } = useWords();
  const { user } = useAuth();

  function handleChange(e) {
    setPhotoAdded(e.target.value.split("\\").pop());
  }
  const convertImageToText = async (imageData) => {
    function isLetter(str) {
      return str.length === 1 && str.match(/[a-z]/i);
    }
    function converNonAlphabetToSpaces(textArray) {
      for (let [idx, char] of Object.entries(textArray)) {
        if (isLetter(char)) continue;
        textArray[idx] = " ";
      }
    }
    function createWordsArray(textA) {
      let newTextArray = [];
      let curWordIdx = 0;
      for (let [idx, char] of Object.entries(textArray)) {
        if (textArray[idx] == " " && textArray[idx + 1] != " ") {
          curWordIdx += 1;
          continue;
        }
        if (textArray[idx] == " ") continue;
        if (!newTextArray[curWordIdx]) {
          newTextArray[curWordIdx] = char;
          continue;
        }
        newTextArray[curWordIdx] = newTextArray[curWordIdx].concat(char);
      }
      return newTextArray;
    }
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);
    const textArray = text.split("");
    console.log(textArray, "textArray");
    converNonAlphabetToSpaces(textArray);
    const wordsArray = createWordsArray(textArray);
    console.log(wordsArray);
    let polEngWordPairs = getTranslateWordsPairsArray(wordsArray);
    console.log(polEngWordPairs, "translated");
    await updateUserWords(user.uid, new Set(polEngWordPairs));
  };
  function handleSubmit(e) {
    e.preventDefault();
    const uploadedFile = fileRef.current.files[0];
    if (!uploadedFile) {
      setError(true);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      convertImageToText(imageDataUri);
    };
  }
  function getUploadMessageClass() {
    setTimeout(() => {
      setSucess(false);
      setError(false);
    }, 1000);
    if (error) {
      return "modal__inner__scanner-message--error";
    }
    if (sucess) {
      return "modal__inner__scanner-message--sucess";
    }
  }
  if (!show) {
    return "";
  }
  return (
    <div className="modal">
      <form className="modal__inner">
        <button
          onClick={close}
          className="modal__inner__btn modal__inner__btn--close"
        >
          Zamknij
        </button>
        <label
          htmlFor="file-upload"
          className="modal__inner__btn modal__inner__btn--scanner-upload"
        >
          {photoAdded ? `dodano zdjęcie ${photoAdded}` : "Dodaj zdjęcie"}
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            ref={fileRef}
            onChange={handleChange}
          />
        </label>

        <p
          className={`modal__inner__scanner-message ${getUploadMessageClass()}`}
        >
          {error ? "dodanie nie powiodło się :(" : ""}
          {sucess ? "dodano przetłumaczone słowa" : ""}
        </p>
        <button
          className="modal__inner__btn modal__inner__btn--add"
          onClick={handleSubmit}
        >
          Dodaj Słowa
        </button>
      </form>
    </div>
  );
};

export default ScannerModal;
