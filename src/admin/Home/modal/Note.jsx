import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { addComment } from "../../../features/apiCallAdmin";
// import { addComment } from "../../features/apiCallAdmin";

const Note = ({ ownerId }) => {
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get message form textare field
  const [addNote, setAddNote] = useState("");

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // handle change
  const handleChange = (event) => {
    setAddNote(event.target.value);

    if (event.target.value) {
      setErrMsg("");
    }
  };

  // validation check
  const hadleRequired = () => {
    if (!addNote) {
      setErrMsg("এসএমএস পরিমান দিন");
    }
  };

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (addNote) {
      const data = {
        comment: addNote,
      };

      console.log(data);
      addComment(ownerId, data, setIsloading, dispatch);
    }
  };
  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="clientNoteModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              কে মেসেজ করুন
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* model body here */}
            <form onSubmit={handleSubmit}>
              <div class="mb-3">
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder="মেসেজ লিখুন"
                  onChange={handleChange}
                  onBlur={hadleRequired}
                ></textarea>
                <div id="emailHelp" class="form-text text-danger">
                  {errMsg}
                </div>
              </div>
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : "সেন্ড মেসেজ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Note;
