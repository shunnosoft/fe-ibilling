import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { addCustomerNote, getCustomerNotes } from "../../../features/apiCalls";

const CustomerNote = ({ customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get notes from redux
  const notes = useSelector((state) => state.customerNotes?.customerNote);

  // get message form textare field
  const [addNote, setAddNote] = useState("");

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get customer loading
  const [getCustomerLoading, setGetCustomerLoading] = useState();

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

  // handle submit
  const handleSubmit = () => {
    if (addNote) {
      const data = {
        ispOwner,
        customerId,
        note: addNote,
      };
      addCustomerNote(dispatch, setIsLoading, data);
      setAddNote("");
    } else {
      toast.error(t("noteFieldRequired"));
    }
  };

  useEffect(() => {
    getCustomerNotes(dispatch, setGetCustomerLoading, customerId);
  }, [customerId]);

  return (
    <>
      <ToastContainer theme="colored" />
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerNote"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {/* Write some note for {companyName} */}
              </h5>
              <div className="d-flex">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-sm btn-outline-success"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : t("submit")}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ms-3"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
            <div className="modal-body">
              {/* model body here */}

              {notes?.length > 0 ? (
                <>
                  <div
                    className="noteList container"
                    style={{
                      height: "48vh",
                      overflowY: "auto",
                    }}
                  >
                    {notes.map((data, key) => (
                      <>
                        <div className="comment-show">
                          <div className="d-flex">
                            <h5 className="mb-1">
                              {moment(data.createdAt).format(
                                "MMM DD YYYY hh:mm:ss A"
                              )}
                            </h5>
                          </div>
                          <p className="">{data?.note}</p>
                        </div>
                        <br />
                      </>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center">{t("dataNotAvailable")}</div>
              )}
              <hr />
              <form>
                <div class="mb-3">
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

export default CustomerNote;
