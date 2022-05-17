import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { editIspOwnerInvoice } from "../../../features/apiCallAdmin";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

const InvoiceEditModal = ({ invoiceId }) => {
  const invoiceList = useSelector((state) => state.ownerInvoice.ownerInvoice);

  // get editable owner
  const ispOwnerInvoice = invoiceList.find((item) => item.id === invoiceId);
  console.log(ispOwnerInvoice);
  // console.log(ispOwnerInvoice.amount);

  // payment status hook
  const [paymentStatus, setPaymentStatus] = useState();

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // import dispatch
  const dispatch = useDispatch();

  const handlePaymentStatusChange = (event) => {
    setPaymentStatus((prev) => (prev = event.target.value));
  };

  const handleSubmit = (values) => {
    console.log(values.dueDate, values.time);
    // 2022-04-23T18:59:59.004Z
    const data = {
      amount: values.amount,
      status: paymentStatus,
      dueDate: moment(values.dueDate + " " + values.time).toISOString(),
    };
    console.log(data);

    editIspOwnerInvoice(invoiceId, data, setIsLoading, dispatch);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="InvoiceEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {/* Edit Profile */}
                <span className="text-success"> Invoice Edit</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{
                  amount: ispOwnerInvoice?.amount,
                  paymentStatus: ispOwnerInvoice?.status,
                  dueDate: moment(ispOwnerInvoice?.dueDate).format(
                    "YYYY-MM-DD"
                  ),

                  time: moment(ispOwnerInvoice?.dueDate).format("HH:mm"),
                }}
                // validationSchema={BillValidatoin}
                enableReinitialize
                onSubmit={(values) => {
                  handleSubmit(values);
                }}
              >
                {() => (
                  <Form>
                    <div className="row">
                      <div className="col-md-6">
                        <FtextField
                          type="number"
                          name="amount"
                          label="Amount"
                        />
                      </div>
                      <div className="col-md-6">
                        <h6 className="mb-0">Payment Status</h6>
                        <select
                          className="form-select mt-1 mb-4"
                          aria-label="Default select example"
                          onChange={handlePaymentStatusChange}
                        >
                          <option
                            value="paid"
                            selected={ispOwnerInvoice?.status === "paid"}
                          >
                            Paid
                          </option>
                          <option
                            selected={ispOwnerInvoice?.status === "unpaid"}
                            value="unpaid"
                          >
                            Unpaid
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="row timeDate">
                      <div className="col-md-6">
                        <FtextField type="date" name="dueDate" label="Date" />
                      </div>
                      <div className="col-md-6">
                        <FtextField type="time" name="time" label="Time" />
                      </div>
                    </div>

                    <div className="modal-footer" style={{ border: "none" }}>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        Cnacel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditModal;
