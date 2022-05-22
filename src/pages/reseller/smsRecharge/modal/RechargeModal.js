import React, { useState } from "react";
import Loader from "../../../../components/common/Loader";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { parchaseSms } from "../../../../features/resellerParchaseSmsApi";
import { useDispatch } from "react-redux";
import FormatNumber from "../../../../components/common/NumberFormat";
import { toast } from "react-toastify";

const RechargeModal = ({ status }) => {
  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [smsAmount, setSmsAmount] = useState(100);
  const [errMsg, setErrMsg] = useState("");
  // console.log(smsAmount);

  const hadleRequired = () => {
    if (!smsAmount) {
      setErrMsg("এসএমএস পরিমান দিন");
    }
    if (smsAmount < 100 && smsAmount > 10000) {
      setErrMsg("সর্বনিম্ন  ১০০ টি এবং সর্বোচ্চ ১০,০০০ কিনতে পারবেন");
    }
  };

  const handleChange = (event) => {
    setSmsAmount(event.target.value);

    if (event.target.value >= 100 || event.target.value) {
      setErrMsg("");
    }
  };
  const msgPrice = smsAmount * 0.25;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status.length === 0) {
      if (smsAmount >= 100 && smsAmount <= 10000) {
        const data = {
          smsAmount: smsAmount,
        };
        console.log(data);
        parchaseSms(data, setIsLoading, dispatch);
      } else {
        setErrMsg("সর্বনিম্ন  ১০০ টি এবং সর্বোচ্চ ১০,০০০ কিনতে পারবেন");
      }
    } else {
      toast.error("স্ট্যাটাস পেন্ডিং থাকা যাবে না");
    }
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="smsRechargeModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              এসএমএস কিনুন
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={handleSubmit}>
              <h5>
                টাকার পরিমান:
                <span class="badge bg-info">
                  {smsAmount >= 100 && smsAmount <= 10000
                    ? FormatNumber(msgPrice)
                    : ""}
                </span>
              </h5>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">
                  পরিমান
                </label>
                <input
                  value={smsAmount}
                  type="number"
                  class="form-control"
                  minLength="3"
                  maxLength="5"
                  onChange={handleChange}
                  onBlur={hadleRequired}
                />
                <div id="emailHelp" class="form-text text-danger">
                  {errMsg}
                </div>
              </div>
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading || status.length !== 0}
                >
                  {isLoading ? <Loader /> : "সাবমিট"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeModal;
