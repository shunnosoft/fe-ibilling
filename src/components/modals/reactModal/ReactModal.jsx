import React from "react";
import { useDispatch } from "react-redux";
import { hideModal } from "../../../features/uiSlice";
import "./modal.css";

function ReactModal( ) {
    const dispatch = useDispatch()
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
                console.log("hide")
               dispatch(hideModal())
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Are You Sure You Want to Continue?</h1>
        </div>
        <div className="body">
          <p>The next page looks amazing. Hope you want to go there!</p>
        </div>
        <div className="footer">
          <button
            onClick={() => {
                dispatch(hideModal())
             }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default ReactModal;