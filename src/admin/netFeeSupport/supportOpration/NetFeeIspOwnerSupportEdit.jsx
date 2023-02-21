import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { editIspOwnerCreateSupport } from "../../../features/apiCallAdmin";

const NetFeeIspOwnerSupportEdit = ({ editID }) => {
  const dispatch = useDispatch();

  // get ispOwner support create history
  const ispOwnerSupport = useSelector(
    (state) => state.adminNetFeeSupport?.ispOwnerSupport
  );

  //single support update data find
  const findSupport = ispOwnerSupport.find((support) => support.id === editID);

  // ispOwner support edit data state
  const [supportEditData, setSupportEditData] = useState("");

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // ispOwner support edit handler
  const ispOwnerSupportEditHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSupportEditData({ ...supportEditData, [name]: value });
  };

  // ispOwner support update submit handler
  const ispOwnerSupportUpdateSubmit = (e) => {
    e.preventDefault();

    if (!description) {
      toast.error("Please Input Your Comment");
    }
    if (!support) {
      toast.error("Please Select Your Support Type");
    }
    editIspOwnerCreateSupport(dispatch, setIsLoading, supportEditData);
  };

  useEffect(() => {
    if (findSupport) {
      setSupportEditData(findSupport);
    }
  }, [findSupport]);

  const { support, description } = supportEditData;

  return (
    <>
      <div
        className="modal fade"
        id="ispOwnerSupportEdit"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {/* {t("netFeeSupportUpdate")} */}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={ispOwnerSupportUpdateSubmit}>
                <div className="form-group px-2">
                  <label>Select Your Support Type</label>
                  <select
                    style={{ width: "100%" }}
                    class="form-select mw-100"
                    aria-label="Default select example"
                    name="support"
                    onChange={ispOwnerSupportEditHandler}
                  >
                    <option selected={support === "complain"} value="complain">
                      Complain
                    </option>
                    <option selected={support === "feature"} value="feature">
                      Feature Request
                    </option>
                    <option selected={support === "support"} value="support">
                      Support
                    </option>
                  </select>
                </div>
                <div className="form-group px-2 mt-3">
                  <label>Input Your Comment</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    name="description"
                    value={description}
                    onChange={ispOwnerSupportEditHandler}
                  ></textarea>
                </div>
                <div className="modal-footer bg-whitesmoke br">
                  <button
                    disabled={isLoading}
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn btn-success"
                  >
                    {isLoading ? <Loader /> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetFeeIspOwnerSupportEdit;
