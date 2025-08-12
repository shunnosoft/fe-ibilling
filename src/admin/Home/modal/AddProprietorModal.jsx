import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import axios from "axios";
import { toast } from "react-toastify";

const AddProprietorModal = ({ ownerId }) => {
  //  get all isp owner
  const data = useSelector((state) => state.admin?.ispOwners);

  // get editable owner
  const ispOwner = data.find((item) => item.id === ownerId);

  const [loading, setLoading] = useState(false);
  const [proprietorData, setProprietorData] = useState({
    mobile: "",
    name: "",
    fatherName: "",
    email: "",
    nid: "",
    address: "",
    refName: "",
    refMobile: "",
    refNid: "",
    refAddress: "",
    refRelation: "",
    remarks: "",
    storeName: "",
    storeType: "iBilling",
  });

  const createProprietor = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://192.168.1.14:6100/api/users/register",
        proprietorData
      );

      if (data.status) {
        toast.success("Successfully to created inventory account");
      }
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error("Failed to create inventory account");
      return toast.error(error.response?.data?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setProprietorData({
      ...proprietorData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (ispOwner) {
      setProprietorData({
        ...proprietorData,
        name: ispOwner.name,
        mobile: ispOwner.mobile,
        email: ispOwner.email,
        nid: ispOwner.nid,
        address: ispOwner.address,
        storeName: ispOwner.company,
      });
    }
  }, [ispOwner]);

  return (
    <div
      className="modal fade modal-dialog-scrollabel "
      id="inventoryAddModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title" id="exampleModalLabel">
              <div className="d-flex">
                <h5>
                  Id: <span className="text-success"> {ispOwner?.id} </span>
                </h5>
                <h5 className="ms-5">
                  Mobile:
                  <span className="text-success"> {ispOwner?.mobile}</span>
                </h5>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>প্রোপ্রাইটরের তথ্য</h6>
                <hr />
                <div className="form-group">
                  <label>প্রোপ্রাইটরের নাম</label>
                  <input
                    onChange={onChangeHandler}
                    type="text"
                    className="form-control"
                    name="name"
                    value={proprietorData.name}
                    required={true}
                  ></input>
                </div>
                <div className="form-group">
                  <label>স্টোর নাম</label>
                  <input
                    onChange={onChangeHandler}
                    type="text"
                    className="form-control"
                    name="storeName"
                    value={proprietorData.name}
                  ></input>
                </div>

                <div className="form-group">
                  <label>মোবাইল</label>
                  <input
                    type="mobile"
                    className="form-control"
                    name="mobile"
                    onChange={onChangeHandler}
                    value={proprietorData.mobile}
                    required={true}
                  ></input>
                </div>

                <div className="form-group">
                  <label>ইমেল</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    onChange={onChangeHandler}
                    value={proprietorData.email}
                  ></input>
                </div>
                <div className="form-group">
                  <label>পিতার নাম</label>
                  <input
                    type="fatherName"
                    className="form-control"
                    name="fatherName"
                    onChange={onChangeHandler}
                    value={proprietorData.fatherName}
                  ></input>
                </div>

                <div className="form-group">
                  <label>ঠিকানা</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    onChange={onChangeHandler}
                    value={proprietorData.address}
                  ></input>
                </div>

                <div className="form-group">
                  <label>জাতীয় পরিচয়পত্রের নম্বর</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nid"
                    onChange={onChangeHandler}
                    value={proprietorData.nid}
                  ></input>
                </div>
              </div>
              <div className="col-md-6">
                <h6>রেফারেন্সের তথ্য</h6>
                <hr />
                <div className="form-group">
                  <label>রেফারেন্স নাম</label>
                  <input
                    onChange={onChangeHandler}
                    value={proprietorData.refName}
                    type="text"
                    className="form-control"
                    name="refName"
                  ></input>
                </div>

                <div className="form-group">
                  <label>রেফারেন্স মোবাইল</label>
                  <input
                    type="mobile"
                    className="form-control"
                    name="refMobile"
                    onChange={onChangeHandler}
                    value={proprietorData.refMobile}
                  ></input>
                </div>

                <div className="form-group">
                  <label>রেফারেন্স ঠিকানা</label>
                  <input
                    type="text"
                    className="form-control"
                    name="refAddress"
                    onChange={onChangeHandler}
                    value={proprietorData.refAddress}
                  ></input>
                </div>

                <div className="form-group">
                  <label>রেফারেন্স জাতীয় পরিচয়পত্রের নম্বর</label>
                  <input
                    type="text"
                    className="form-control"
                    name="refNid"
                    onChange={onChangeHandler}
                    value={proprietorData.refNid}
                  ></input>
                </div>
                <div className="form-group">
                  <label>রেফারেন্স সম্পর্ক</label>
                  <input
                    type="text"
                    className="form-control"
                    name="refRelation"
                    onChange={onChangeHandler}
                    value={proprietorData.refRelation}
                  ></input>
                </div>
                <div className="form-group">
                  <label>নোট</label>
                  <input
                    type="text"
                    className="form-control"
                    name="remarks"
                    onChange={onChangeHandler}
                    value={proprietorData.remarks}
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              onClick={createProprietor}
              type="submit"
              className="btn btn-success"
            >
              {loading ? <Loader /> : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProprietorModal;
