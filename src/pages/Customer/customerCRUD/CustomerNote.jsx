import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

// internal import
import Loader from "../../../components/common/Loader";
import { addCustomerNote, getCustomerNotes } from "../../../features/apiCalls";
import { getOwnerUsers } from "../../../features/getIspOwnerUsersApi";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CustomerNote = ({ show, setShow, customerId, customerName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

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

  // find action performer

  const performerName = (performerId) => {
    if (performerId) {
      const performer = ownerUsers.find((item) => item[performerId]);
      const name = performer[performerId].name;
      return name;
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

  // handle submit
  const handleSubmit = () => {
    if (addNote) {
      const data = {
        ispOwner,
        customerId,
        note: addNote,
      };
      addCustomerNote(dispatch, setIsLoading, data, setShow);
      setAddNote("");
    } else {
      toast.error(t("noteFieldRequired"));
    }
  };

  useEffect(() => {
    if (customerId) {
      getCustomerNotes(dispatch, setGetCustomerLoading, customerId);
      getOwnerUsers(dispatch, ispOwner);
    }
  }, [customerId]);

  return (
    <>
      <ToastContainer theme="colored" />
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"xl"}
        header={customerName}
      >
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
                    <div className="">
                      <h5 className="mb-0">
                        <b>{performerName(data?.addedBy)}</b>
                      </h5>

                      <small className="text-secondary">
                        <i>
                          {moment(data.createdAt).format("MMM DD YYYY hh:mm A")}
                        </i>
                      </small>
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

          <div className="displayGrid1 float-end mt-2">
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
              className="btn btn-sm btn-outline-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </ComponentCustomModal>
    </>
  );
};

export default CustomerNote;
