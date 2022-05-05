import React, { useState } from "react";
import "./addWords.scss";
import MicrophoneModal from "./microphoneModal/MicrophoneModal";
import ScannerModal from "./scannerModal/ScannerModal";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const AddWords = () => {
  const [showKeyboardModal, setShowKeyobardModal] = useState(false);
  const [showMicrophoneModal, setShowMicrophoneModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  return (
    <>
      <article class="add-words-container">
        <div
          className="add-words-container__option"
          onClick={(e) => setShowMicrophoneModal(true)}
        >
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {SpeechRecognition ? <i class="fa-solid fa-microphone"></i> : ""}{" "}
            <i class="fa-solid fa-keyboard"></i>{" "}
          </div>
          <p style={!SpeechRecognition ? { marginTop: "1rem" } : {}}>
            T Y P I N G
          </p>
          {SpeechRecognition ? <p>M I C R O P H O N E</p> : ""}
        </div>
        <div
          className="add-words-container__option"
          onClick={(e) => setShowScannerModal(true)}
        >
          <i class="fa-solid fa-file"></i>
          <p style={{ marginTop: "1rem" }}>S C A N</p>
        </div>
      </article>
      <MicrophoneModal
        show={showMicrophoneModal}
        close={() => setShowMicrophoneModal(false)}
      />
      <ScannerModal
        show={showScannerModal}
        close={() => setShowScannerModal(false)}
      />
    </>
  );
};

export default AddWords;
