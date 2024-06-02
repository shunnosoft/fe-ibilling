import { Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FileEarmarkPlusFill, PencilSquare } from "react-bootstrap-icons";
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
import SelectField from "../../components/common/SelectField";
import DatePicker from "react-datepicker";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

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

  // set invoice
  const [invocie, setInvocie] = useState([]);

  // set invoice id
  const [invoiceeEditId, setInvoiceEditId] = useState("");

  // modal show state
  const [show, setShow] = useState(false);

  // set invoice date
  const [invoiceDate, setInvoiceDate] = useState();

  // set invoice type
  const [invoiceType, setInvoiceType] = useState("monthlyServiceCharge");

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

  useEffect(() => {
    setInvocie(invoiceList);
  }, [invoiceList]);

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

  // handle ispowner invoice filter function
  const handleInvoiceListFilter = () => {
    let arr = [...invoiceList];
    if (invoiceType) {
      arr = arr.filter((item) => item.type === invoiceType);
    }

    setInvocie(arr);
  };

  // handle ispowner invoice filter reset function
  const handleInvoiceListFilterReset = () => {
    setInvocie(invoiceList);
  };

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
              </>
            </div>
          ),
      },
    ],
    []
  );

  return (
    <>
      <ComponentCustomModal
        show={isOpen}
        setShow={setIsOpen}
        centered={false}
        size="xl"
        header={
          <div className="d-flex">
            <h5>
              Company Name:
              <span className="text-success"> {companyName} </span>
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
        }
      >
        <div className="p-2 ">
          {invoiceeEditId && (
            <>
              <div className="edit-section">
                <Formik
                  initialValues={{
                    amount: ispOwnerInvoice?.amount,
                    paymentStatus: ispOwnerInvoice?.status,
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
                        <div className="displayGrid5 pt-0">
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

          <div className="displayGrid5 mt-2">
            <div>
              <label
                htmlFor="receiver_type"
                className="form-control-label changeLabelFontColor"
              >
                Invoice Type
              </label>

              <select
                as="select"
                id="receiver_type"
                className="form-select mt-0 mw-100"
                aria-label="Default select example"
                onChange={(e) => setInvoiceType(e.target.value)}
              >
                <option value="monthlyServiceCharge">
                  Monthly Service Charge
                </option>
                <option value="smsPurchase">SMS Purchase</option>
                <option value="registration">Registration</option>
                <option value="migration">Migration</option>
              </select>
            </div>

            <div className="displayGrid1 invoiceAction">
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleInvoiceListFilter}
              >
                Filter
              </button>
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleInvoiceListFilterReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="dashboardField">
          <div className="invoice">
            {invoiceList.length > 0 && (
              <Table isLoading={isLoading} columns={columns} data={invocie} />
            )}
          </div>
        </div>
      </ComponentCustomModal>

      <InvoiceEditModal invoiceeEditId={invoiceeEditId} />
      <InvoiceCreate ispOwnerId={ownerId} modal={show} />
    </>
  );
};

export default Invoices;
