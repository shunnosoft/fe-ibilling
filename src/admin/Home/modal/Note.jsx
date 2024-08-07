import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { Pencil } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertFromHTML,
  convertToRaw,
  ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  addComment,
  getComments,
  getSingleComment,
  getSingleComments,
} from "../../../features/apiCallAdmin";
import htmlToDraft from "html-to-draftjs";

const Note = ({ ownerId, companyName }) => {
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // set name
  const [name, setName] = useState();

  // set comment type
  const [commentType, setCommentType] = useState();

  // set comment status
  const [status, setStatus] = useState();

  // get message form textare field
  const [addNote, setAddNote] = useState("");
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // );

  // const initialNote = editorState;
  // const convertNote = draftToHtml(
  //   convertToRaw(initialNote.getCurrentContent())
  // );
  // const editorJSON = JSON.stringify(convertToRaw(editorState.getCurrentContent));
  // console.log(convertNote);

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // set comment id
  const [commentId, setCommentId] = useState();

  // set name in state
  const checkNameHandle = (event) => {
    if (event.target.value !== "Select Name") {
      setName(event.target.value);
    }
  };

  // set comment in state
  const commentTypeHandle = (event) => {
    if (event.target.value !== "Comment Type") {
      setCommentType(event.target.value);
    }
  };

  // set status in state
  const statusHandle = (event) => {
    if (event.target.value !== "Status") {
      setStatus(event.target.value);
    }
  };

  // set note in state
  const handleChange = (event) => {
    setAddNote(event.target.value);
  };

  // validation check
  const handleRequired = () => {
    if (addNote === "<p></p>") {
      setErrMsg("Write Comment !");
    }
  };

  // useEffect(() => {
  //   console.log(editorState);
  // }, [editorState]);

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && addNote && commentType && status) {
      const data = {
        name,
        comment: addNote,
        commentType,
        status,
        ispOwner: ownerId,
      };
      addComment(data, setIsloading, dispatch);
      setName("");
      setCommentType("");
      setStatus("");
      setAddNote("");
    } else if (!name) {
      toast.error("Select Name");
    } else if (!commentType) {
      toast.error("Select Comment Type");
    } else if (!status) {
      toast.error("Select Status");
    } else if (!addNote) {
      toast.error("Comment field required");
    }
  };

  // get note api call
  useEffect(() => {
    if (ownerId) {
      getSingleComments(dispatch, setIsloading, ownerId);
    }
  }, [ownerId]);

  // get all note in redux
  const singleComment = useSelector(
    (state) => state.admin?.singleComment?.results
  );

  // const contentBlock = htmlToDraft(addNote);
  // useEffect(() => {
  //   if (contentBlock) {
  //     const contentState = ContentState.createFromBlockArray(
  //       contentBlock.contentBlocks
  //     );
  //     const editorState = EditorState.createWithContent(contentState);

  //     console.log(typeof editorState);
  //     setEditorState(editorState);
  //   }
  // }, []);

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
                Write some note for {companyName}
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

              {singleComment?.length > 0 ? (
                <>
                  <div
                    className="noteList container"
                    style={{
                      height: "48vh",
                      overflowY: "auto",
                    }}
                  >
                    {singleComment.map((data, key) => (
                      <>
                        <div className="comment-show">
                          <div className="d-flex">
                            <h5 className="mb-1">
                              <b>{data?.name}</b>
                            </h5>

                            <small className="ms-2">
                              {moment(data.createdAt).format(
                                "DD-MMM-YYYY hh:mm:ss A"
                              )}
                            </small>
                          </div>
                          <div
                            className="comment-info"
                            style={{ marginTop: "-10px" }}
                          >
                            <i class="badge bg-primary me-1">
                              {data?.commentType}
                            </i>
                            <i class="badge bg-info">{data?.status}</i>
                            {/* <span
                              class="badge text-dark"
                              data-bs-toggle="modal"
                              data-bs-target="#commentEditModal"
                              onClick={() => {
                                setCommentId(data.id);
                              }}
                            >
                              <Pencil />
                            </span> */}
                          </div>
                          <p
                            className="mt-2"
                            // dangerouslySetInnerHTML={{
                            //   __html: data.comment,
                            // }}
                          >
                            {data?.comment}
                          </p>
                        </div>
                        <br />
                      </>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center">Data not Available !</div>
              )}
              <hr />
              <form>
                <div className="d-flex justify-content-around mb-2">
                  <div className="name-section">
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={checkNameHandle}
                      value={name}
                    >
                      <option selected>Select Name</option>
                      <option value="Saikat Mostofa">Saikat Mostofa</option>
                      <option value="Shahadat Hossain">Shahadat Hossain</option>
                      <option value="Nayem Ahmed">Nayem Ahmed</option>
                      <option value="Rasel Ali">Rasel Ali</option>
                      <option value="Parvez Joy">Parvez Joy</option>
                      <option value="Abdur Razzaq">Abdur Razzaq</option>
                      <option value="Firoj Mahmud">Firoj Mahmud</option>
                      <option value="Marof">Marof</option>
                      <option value="Taposy Chowdhury">Taposy Chowdhury</option>
                      <option value="Mohua Mim">Mohua Mim</option>
                      <option value="Songeet">Songeet</option>
                      <option value="Sunam">Sunam</option>
                      <option value="Sunam">Sahid Islam</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="type-section">
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={commentTypeHandle}
                      value={commentType}
                    >
                      <option selected>Comment Type</option>
                      <option value="support">Support</option>
                      <option value="feature">Feature</option>
                      <option value="migration">Migration</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div className="status-section">
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      onChange={statusHandle}
                      value={status}
                    >
                      <option selected>Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <div>
                    {/* <Editor
                      editorState={editorState}
                      onEditorStateChange={(newState) => {
                        setEditorState(newState);
                        setAddNote(
                          draftToHtml(
                            convertToRaw(newState.getCurrentContent())
                          )
                        );
                      }}
                      value={addNote}
                      onBlur={handleRequired}
                    /> */}
                  </div>
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Note"
                    onChange={handleChange}
                    onBlur={handleRequired}
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
