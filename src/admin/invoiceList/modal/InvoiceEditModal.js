import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { editIspOwnerInvoice } from "../../../features/apiCallAdmin";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

const InvoiceEditModal = ({ invoiceId }) => {
  // form validate
  const invoiceEditFieldValidator = Yup.object({
    amount: Yup.number().required("Please insert amount."),
  });

  // import dispatch
  const dispatch = useDispatch();

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // get isp owner invoice list
  const invoiceList = useSelector((state) => state.ownerInvoice?.ownerInvoice);

  // get editable invoice
  const ispOwnerInvoice = invoiceList.find((item) => item.id === invoiceId);

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // handle submit
  const handleSubmit = (values) => {
    const data = {
      dueDate: moment(values.dueDate + " " + values.time).toISOString(),
    };

    if (role === "superadmin") {
      data.amount = values.amount;
      data.status = values.paymentStatus;
    }

    // edit api call
    editIspOwnerInvoice(invoiceId, data, setIsLoading, dispatch);
  };

  return (
    <div className="edit_invoice_list">
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
                validationSchema={invoiceEditFieldValidator}
                enableReinitialize
                onSubmit={(values) => {
                  handleSubmit(values);
                }}
              >
                {() => (
                  <Form>
                    {role === "superadmin" && (
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
                          <Field
                            as="select"
                            className="form-select mt-1 mb-4"
                            aria-label="Default select example"
                            name="paymentStatus"
                          >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                          </Field>
                        </div>
                      </div>
                    )}

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
                        Cancel
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
