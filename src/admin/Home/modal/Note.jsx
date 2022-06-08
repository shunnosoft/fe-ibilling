import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/table/Table";
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
      setErrMsg("Write Somthing !");
    }
  };

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (addNote) {
      const data = {
        comment: addNote,
      };

      addComment(ownerId, data, setIsloading, dispatch);
      setAddNote("");
    }
  };

  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // find single data
  const singleData = ispOwners.find((item) => item.id === ownerId);
  let comments;
  if (singleData) {
    comments = singleData.comments;
    comments = [...comments].reverse();
  }
  console.log(comments);

  return (
    <>
      <ToastContainer theme="colored" />
      <div
        className="modal fade modal-dialog-scrollable "
        id="clientNoteModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Write some note for{" "}
                <i className="text-secondary">{singleData?.name}</i>
              </h5>
              <div className="d-flex">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-sm btn-outline-success"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-3"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <form>
                <div class="mb-3">
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Note"
                    onChange={handleChange}
                    onBlur={hadleRequired}
                    value={addNote}
                  ></textarea>
                  <div id="emailHelp" class="form-text text-danger">
                    {errMsg}
                  </div>
                </div>
              </form>
            </div>
            {comments?.length > 0 && (
              <>
                <hr />
                {/* <Accordion defaultActiveKey="">
                  <Accordion.Item>
                    <Accordion.Header>Comment</Accordion.Header>
                    <Accordion.Body> */}
                <div
                  className="noteList container"
                  style={{
                    height: "250px",
                    overflowY: "auto",
                  }}
                >
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th scope="col">Comment</th>
                      </tr>
                    </thead>

                    <tbody>
                      {comments.map((item, index) => (
                        <tr colspan="2">
                          <td>{item}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* </Accordion.Body>
                  </Accordion.Item>
                </Accordion> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
