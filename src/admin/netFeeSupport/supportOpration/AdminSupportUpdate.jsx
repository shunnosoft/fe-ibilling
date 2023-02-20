import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { updateAdminNetFeeSupport } from "../../../features/apiCallAdmin";

const AdminSupportUpdate = ({ editId }) => {
  console.log(editId);
  const dispatch = useDispatch();

  // update support data state
  const [supportEditData, setSupportEditData] = useState("");

  // netFee support data
  const supportData = useSelector(
    (state) => state.adminNetFeeSupport?.adminSupport
  );
  console.log(supportData);

  //single support update data find
  const findSupport = supportData.find((support) => support.id === editId);
  console.log(findSupport);

  // isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // netFee support handler
  const handleSupportEdit = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setSupportEditData({ ...supportEditData, [name]: value });
  };

  // update netFee support submit handle
  const netFeeSupportUpdate = (e) => {
    e.preventDefault();
    if (!description) {
      toast.error("Please Input Your Comment");
    }
    if (!support) {
      toast.error("Please Select Your Support Type");
    }
    console.log(supportEditData);
    updateAdminNetFeeSupport(dispatch, setIsLoading, supportEditData);
  };

  useEffect(() => {
    if (findSupport) {
      setSupportEditData(findSupport);
    }
  }, [findSupport]);

  const { support, description } = supportEditData;

  return (
    <div className="edit_invoice_list">
      <div
        className="modal fade modal-dialog-scrollable "
        id="adminSupportEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                <span className="text-success">Support Update</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={netFeeSupportUpdate}>
                <div className="form-group px-2">
                  <label>Select Your Suppor Type</label>
                  <select
                    style={{ width: "100%" }}
                    class="form-select mw-100"
                    aria-label="Default select example"
                    name="support"
                    onChange={handleSupportEdit}
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
                    onChange={handleSupportEdit}
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
    </div>
  );
};

export default AdminSupportUpdate;
