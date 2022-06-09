import moment from "moment";
import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../components/common/Loader";
import TdLoader from "../../../components/common/TdLoader";
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

  const [name, setName] = useState();

  const checkNameHandle = (event) => {
    setName(event.target.value);
  };
  console.log(name);
  // handle change
  const handleChange = (event) => {
    setAddNote(event.target.value);

    if (event.target.value) {
      setErrMsg("");
    }
  };

  // validation check
  const hadleRequired = () => {
    if (!name) {
      setErrMsg("Set Name !");
    }
    if (!addNote) {
      setErrMsg("Write Somthing !");
    }
  };

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (addNote && name) {
      const data = {
        comment: addNote,
        name,
      };

      addComment(ownerId, data, setIsloading, dispatch);
      setAddNote("");
    } else {
      toast.error("name and comment required");
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

              {comments?.length > 0 && (
                <>
                  <div
                    className="noteList container"
                    style={{
                      height: "48vh",
                      overflowY: "auto",
                    }}
                  >
                    {comments.map((data, key) => (
                      <>
                        <div className="comment-show">
                          <div className="d-flex">
                            <h5 className="mb-1">
                              <b>{data.name}</b>
                            </h5>
                            <small className="ms-2">
                              {moment(data.createdAt).format("ll")}
                            </small>
                          </div>
                          <p>{data.comment}</p>
                        </div>
                        <br />
                      </>
                    ))}
                  </div>
                </>
              )}
              <hr />
              <form>
                <div className="">
                  <div className="row">
                    <div className="col-md-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Saikat Mostofa"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Saikat Mostofa</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Shahadat Hossain"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Shahadat Hossain</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Nayem Ahmed"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Nayem Ahmed</label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Rasel Ali"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Rasel Ali</label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Parvez Joy"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Parvez Joy</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Shahriar Alam"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Shahriar Alam</label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Abdur Razzaq"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Abdur Razzaq</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Towkir Hossain"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Towkir Hossain</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Ashim Mondol"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Ashim Mondol</label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Sharmin Akter"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Sharmin Akter</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Taposy Chowdhury"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Taposy Chowdhury</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          value={"Others"}
                          onChange={checkNameHandle}
                          onBlur={hadleRequired}
                        />
                        <label class="form-check-label">Others</label>
                      </div>
                    </div>
                  </div>
                  <div id="emailHelp" class="form-text text-danger">
                    {errMsg}
                  </div>
                </div>

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
