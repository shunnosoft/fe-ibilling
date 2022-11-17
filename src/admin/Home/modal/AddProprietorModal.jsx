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
  });

  const createProprietor = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://192.168.1.16:6100/api/users/register",
        proprietorData
      );
      if (!data.status) {
        toast.error("Failed to create inventory account");
        return toast.error(data.data.mobile);
      }
      if (data.status) {
        toast.success("Successfully to created inventory account");
      }
    } catch (error) {
      console.log(error.response?.data?.msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    console.log(e.target.name);
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
      });
    }
  }, [ispOwner]);

  return (
    <div
      className="modal fade modal-dialog-scrollable "
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
                  <lable>প্রোপ্রাইটরের নাম</lable>
                  <input
                    onChange={onChangeHandler}
                    type="text"
                    className="form-control"
                    name="name"
                    value={proprietorData.name}
                  ></input>
                </div>

                <div className="form-group">
                  <lable>মোবাইল</lable>
                  <input
                    type="mobile"
                    className="form-control"
                    name="mobile"
                    onChange={onChangeHandler}
                    value={proprietorData.mobile}
                  ></input>
                </div>

                <div className="form-group">
                  <lable>ইমেল</lable>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    onChange={onChangeHandler}
                    value={proprietorData.email}
                  ></input>
                </div>
                <div className="form-group">
                  <lable>পিতার নাম</lable>
                  <input
                    type="fatherName"
                    className="form-control"
                    name="fatherName"
                    onChange={onChangeHandler}
                    value={proprietorData.fatherName}
                  ></input>
                </div>

                <div className="form-group">
                  <lable>ঠিকানা</lable>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    onChange={onChangeHandler}
                    value={proprietorData.address}
                  ></input>
                </div>

                <div className="form-group">
                  <lable>জাতীয় পরিচয়পত্রের নম্বর</lable>
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
                  <lable>রেফারেন্স নাম</lable>
                  <input
                    onChange={onChangeHandler}
                    value={proprietorData.refName}
                    type="text"
                    className="form-control"
                    name="refName"
                  ></input>
                </div>

                <div className="form-group">
                  <lable>রেফারেন্স মোবাইল</lable>
                  <input
                    type="mobile"
                    className="form-control"
                    name="refMobile"
                    onChange={onChangeHandler}
                    value={proprietorData.refMobile}
                  ></input>
                </div>

                <div className="form-group">
                  <lable>রেফারেন্স ঠিকানা</lable>
                  <input
                    type="text"
                    className="form-control"
                    name="refAddress"
                    onChange={onChangeHandler}
                    value={proprietorData.refAddress}
                  ></input>
                </div>

                <div className="form-group">
                  <lable>রেফারেন্স জাতীয় পরিচয়পত্রের নম্বর</lable>
                  <input
                    type="text"
                    className="form-control"
                    name="refNid"
                    onChange={onChangeHandler}
                    value={proprietorData.refNid}
                  ></input>
                </div>
                <div className="form-group">
                  <lable>রেফারেন্স সম্পর্ক</lable>
                  <input
                    type="text"
                    className="form-control"
                    name="refRelation"
                    onChange={onChangeHandler}
                    value={proprietorData.refRelation}
                  ></input>
                </div>
                <div className="form-group">
                  <lable>নোট</lable>
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
