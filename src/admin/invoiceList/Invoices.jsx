import { Form, Field, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FileEarmarkPlusFill,
  PencilSquare,
  ThreeDots,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import Table from "../../components/table/Table";
import {
  editIspOwnerInvoice,
  getIspOwnerInvoice,
} from "../../features/apiCallAdmin";
import InvoiceEditModal from "./modal/InvoiceEditModal";
import InvoiceCreate from "./modal/InvoiceCreate";

const Invoices = ({ invoiceId, companyName }) => {
  // import dispatch
  const dispatch = useDispatch();

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get invoice list
  const invoiceList = useSelector((state) => state.ownerInvoice?.ownerInvoice);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // loading state
  let [loadingState, setEditLoading] = useState(false);

  // set invoice id
  const [invoiceeEditId, setInvoiceEditId] = useState("");

  // dispatch data to api
  useEffect(() => {
    if (invoiceId) getIspOwnerInvoice(invoiceId, dispatch, setIsLoading);
  }, [invoiceId]);

  // edit section

  const cancelHandle = () => {
    setInvoiceEditId("");
  };

  let ispOwnerInvoice;
  let invoiceEditFieldValidator;
  let handleSubmit;

  if (invoiceeEditId) {
    // form validate
    invoiceEditFieldValidator = Yup.object({
      amount: Yup.number().required("Please insert amount."),
    });

    // get editable invoice
    ispOwnerInvoice = invoiceList.find((item) => item.id === invoiceeEditId);

    // handle submit
    handleSubmit = (values) => {
      const data = {
        dueDate: moment(values.dueDate + " " + values.time).toISOString(),
      };

      if (role === "superadmin") {
        data.amount = values.amount;
        data.status = values.paymentStatus;
      }

      // edit api call
      editIspOwnerInvoice(
        ispOwnerInvoice?.id,
        data,
        setEditLoading,
        dispatch,
        setInvoiceEditId
      );
    };
  }

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        width: "15%",
        accessor: "type",
        Header: "Type",
      },
      {
        width: "15%",
        accessor: "amount",
        Header: "Amount",
      },
      {
        width: "15%",
        accessor: "createdAt",
        Header: "Create Date",
        Cell: ({ row: { original } }) =>
          moment(original.createdAt).format("DD MMM YY hh:mm a"),
      },
      {
        width: "15%",
        accessor: "dueDate",
        Header: "Due Date",
        Cell: ({ row: { original } }) =>
          moment(original.dueDate).format("DD MMM YY hh:mm a"),
      },
      {
        width: "15%",
        Header: "Payment Status",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className={
                "badge " +
                (original.status === "paid" ? "bg-success" : "bg-warning")
              }
            >
              {original.status}
            </span>
          </div>
        ),
      },

      {
        width: "15%",
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setInvoiceEditId(original.id);
                }}
              >
                <PencilSquare />
              </button>

              {/* <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#InvoiceEditModal"
                  onClick={() => {
                    setInvoiceEditId(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">Edit</p>
                    </div>
                  </div>
                </li>
              </ul> */}
            </>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div
        className="modal fade"
        id="ispOwnerInvoice"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header px-5">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                Company Name: {companyName}
              </h5>
              <div
                title="AddMikrotik"
                className="header_icon mx-3"
                data-bs-toggle="modal"
                data-bs-target="#ispOwnerInvoiceCreate"
              >
                <FileEarmarkPlusFill />
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {invoiceeEditId && (
                <>
                  <div className="edit-section">
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
                          <div className="d-flex justify-content-center align-items-center">
                            {role === "superadmin" && (
                              <>
                                <FtextField
                                  type="number"
                                  name="amount"
                                  label="Amount"
                                />
                                <div
                                  className="payment-status mx-2"
                                  style={{ marginTop: "-16px" }}
                                >
                                  <label className="form-control-label changeLabelFontColor">
                                    Payment Status
                                  </label>
                                  <Field
                                    as="select"
                                    className="form-select w-200 mt-0"
                                    aria-label="Default select example"
                                    name="paymentStatus"
                                  >
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                  </Field>
                                </div>
                              </>
                            )}

                            <FtextField
                              type="date"
                              name="dueDate"
                              label="Date"
                            />

                            <div className="mx-2">
                              <FtextField
                                type="time"
                                name="time"
                                label="Time"
                              />
                            </div>

                            <button
                              type="submit"
                              className="btn btn-outline-success mt-2 me-1"
                              disabled={loadingState}
                            >
                              {loadingState ? <Loader /> : "Submit"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary mt-2"
                              disabled={loadingState}
                              onClick={cancelHandle}
                            >
                              Cancel
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </>
              )}
              <div
                className="dashboardField"
                style={{
                  height: "79vh",
                  overflowY: "auto",
                }}
              >
                <div className="invoice">
                  {invoiceList.length > 0 && (
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={invoiceList}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvoiceEditModal invoiceeEditId={invoiceeEditId} />
      <InvoiceCreate ispOwnerId={invoiceId} />
    </>
  );
};

export default Invoices;
