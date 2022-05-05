import { map } from "@firebase/util";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../../context/ContextAuth";
import { useWords } from "../../../../../context/ContextWords";
import "./MicrophoneModal.scss";

let mic;
const InputsCount = 10;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  mic = new SpeechRecognition();
  mic.continuous = true;
  mic.interimResults = true;
  mic.lang = "en-US";
}

//say next or use arrow keys to switch to next input field
//clear or inputs on add
const MicrophoneModal = ({ show, close }) => {
  const [inputValues, setInputValues] = useState([]);
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState("");
  const inputContainer = useRef();
  const [isListening, setIsListening] = useState(false);

  const { translate, updateUserWords, getTranslatedWordsPairsArray } =
    useWords();
  const { user } = useAuth();

  useEffect(() => {
    let newVal = [];
    for (let i = 0; i < InputsCount; i++) {
      newVal.push("");
    }
    setInputValues(newVal);
  }, []);
  useEffect(() => {
    if (SpeechRecognition) {
      handleListen();
    }
  }, [isListening]);
  function handleListen() {
    if (isListening) {
      mic.start();
    } else {
      mic.stop();
    }
    mic.onresult = (event) => {
      if (!inputContainer.current) return;
      let curInpIdx = [
        ...inputContainer.current.querySelectorAll("input[type=text]"),
      ].indexOf(inputContainer.current.querySelector("input[type=text]:focus"));
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript);
      const inpValue = transcript[transcript.length - 1];
      setInputValues((prevState) => {
        return prevState.map((inp, inpIdx) => {
          if (inpIdx === curInpIdx) return inpValue;
          return inp;
        });
      });
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  }
  async function handleSubmit() {
    try {
      let polEngWordPairs = getTranslatedWordsPairsArray(inputValues);
      await updateUserWords(user.uid, new Set(polEngWordPairs));
      setError("");
      setSucess(true);
      setTimeout(() => {
        resetInputValue();
        setSucess(false);
      }, 2000);
    } catch (e) {
      console.log(e.message);
      setError("upload error");
    }
  }
  function resetInputValue() {
    let newVal = [];
    for (let i = 0; i < InputsCount; i++) {
      newVal.push("");
    }
    setInputValues(newVal);
  }
  function handleChange(e, idx) {
    setInputValues((prevState) => {
      return prevState.map((inp, inpIdx) => {
        if (inpIdx === idx) return e.target.value;
        return inp;
      });
    });
  }

  if (!show) {
    return "";
  }
  return (
    <div className="modal">
      <div className="modal__inner modal__inner--keyboard" ref={inputContainer}>
        {SpeechRecognition ? (
          <i
            class="fa-solid fa-microphone fa-2x"
            onClick={() => setIsListening(true)}
          ></i>
        ) : (
          ""
        )}
        <button
          onClick={close}
          className="modal__inner__btn modal__inner__btn--close"
        >
          Close
        </button>
        {inputValues.map((inputValue, idx) => {
          return (
            <div
              className="modal__inner__input"
              style={{ marginTop: `${idx < 2 ? "2.3rem" : ""}` }}
            >
              <input
                key={idx}
                type="text"
                value={inputValue}
                onChange={(e) => handleChange(e, idx)}
              />
              <div>TŁUMACZENIE</div>
              <p>{translate(inputValue.trim())}</p>
            </div>
          );
        })}
        <p style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>
          {error ? error : ""}
        </p>
        <p className="sucessAdded">{sucess ? "translated words added" : ""}</p>
        <button
          className="modal__inner__btn modal__inner__btn--add"
          onClick={handleSubmit}
        >
          Add Words
        </button>
      </div>
    </div>
  );
};

export default MicrophoneModal;
