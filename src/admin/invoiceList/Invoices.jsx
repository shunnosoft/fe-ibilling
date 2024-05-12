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
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import SelectField from "../../components/common/SelectField";
import DatePicker from "react-datepicker";
import { setIspOwnerData } from "../../features/authSlice";

const Invoices = ({ ownerId, companyName, isOpen, setIsOpen }) => {
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

  // modal show state
  const [show, setShow] = useState(false);

  //
  const [invoiceDate, setInvoiceDate] = useState();

  // dispatch data to api
  useEffect(() => {
    isOpen && getIspOwnerInvoice(ownerId, dispatch, setIsLoading);
  }, [isOpen]);

  useEffect(() => {
    const singleInvoice = invoiceList.find(
      (item) => item.id === invoiceeEditId
    );
    setInvoiceDate(singleInvoice?.dueDate && new Date(singleInvoice?.dueDate));
  }, [invoiceeEditId]);

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
        dueDate: invoiceDate.toISOString(),
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

  const handleClose = () => setIsOpen(false);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
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
        width: "10%",
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
        accessor: "paidAt",
        Header: "Paid Date",
        Cell: ({ row: { original } }) =>
          moment(original.paidAt ? original.paidAt : original.updatedAt).format(
            "DD MMM YY hh:mm a"
          ),
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
        width: role === "superadmin" ? "10%" : "0%",
        Header: () =>
          role === "superadmin" && <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) =>
          role === "superadmin" && (
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
      <Modal
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <div className="d-flex px-4">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                Company Name: {companyName}
              </h5>
              <div
                title="Invoice Create"
                className="header_icon mx-3"
                onClick={() => {
                  setShow(true);
                  setIsOpen(false);
                }}
              >
                <FileEarmarkPlusFill />
              </div>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {invoiceeEditId && (
            <>
              <div className="edit-section">
                <Formik
                  initialValues={{
                    amount: ispOwnerInvoice?.amount,
                    paymentStatus: ispOwnerInvoice?.status,
                    // dueDate: moment(ispOwnerInvoice?.dueDate).format(
                    //   "MMM dd yyyy hh:mm a"
                    // ),

                    // time: moment(ispOwnerInvoice?.dueDate).format("HH:mm"),
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
                        <div className="displayGrid5">
                          <>
                            <FtextField
                              type="number"
                              name="amount"
                              label="Amount"
                            />

                            <SelectField
                              as="select"
                              label="Payment Status"
                              className="form-select mw-100 mt-0"
                              name="paymentStatus"
                            >
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                            </SelectField>
                          </>

                          <div>
                            <label className="form-control-label changeLabelFontColor">
                              Invoice Date
                            </label>

                            <DatePicker
                              className="form-control mw-100"
                              selected={invoiceDate}
                              onChange={(date) => setInvoiceDate(date)}
                              dateFormat="MMM dd yyyy hh:mm a"
                              timeIntervals
                              showTimeSelect
                            />
                          </div>

                          {/* <FtextField
                            name="dueDate"
                            label="Date"
                            type="date"
                            component="Datepicker"
                            dateFormat="MMM dd yyyy hh:mm a"
                            timeIntervals
                            showTimeSelect
                          /> */}

                          {/* <FtextField name="time" label="Time" type="date" /> */}

                          <div className="invoiceAction">
                            <button
                              type="submit"
                              className="btn btn-outline-success"
                              disabled={loadingState}
                            >
                              {loadingState ? <Loader /> : "Submit"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              disabled={loadingState}
                              onClick={cancelHandle}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
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
        </ModalBody>
      </Modal>

      <InvoiceEditModal invoiceeEditId={invoiceeEditId} />
      <InvoiceCreate ispOwnerId={ownerId} modal={show} />
    </>
  );
};

export default Invoices;
