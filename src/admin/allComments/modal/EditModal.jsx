import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { editComments } from "../../../features/apiCallAdmin";

const EditModal = ({ id }) => {
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // set comment status
  const [status, setStatus] = useState();

  // get all company name from redux
  const company = useSelector(
    (state) => state.persistedReducer?.companyName?.ispOwnerIds
  );

  // get all note in redux
  const comments = useSelector((state) => state.admin?.comments);

  // find single data
  const data = comments.find((item) => item.id === id);

  // set status in state
  const statusHandle = (event) => {
    setStatus(event.target.value);
  };

  // handle submit
  const handleSubmt = () => {
    const data = {
      status,
    };
    editComments(dispatch, setIsLoading, data, id);
  };

  return (
    <div
      className="modal fade"
      id="editComment"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {company[data?.ispOwner]}
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="status-section">
              <select
                class="form-select"
                aria-label="Default select example"
                onChange={statusHandle}
              >
                <option value="pending" selected={data?.state === "pending"}>
                  Pending
                </option>
                <option
                  value="processing"
                  selected={data?.state === "processing"}
                >
                  Processing
                </option>
                <option
                  value="completed"
                  selected={data?.state === "completed"}
                >
                  Completed
                </option>
              </select>
            </div>
          </div>
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              onClick={handleSubmt}
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              Cnacel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
