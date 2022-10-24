import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices } from "../../features/apiCallAdmin";
import moment from "moment";
import Table from "../../components/table/Table";
import { PenFill, PersonFill, ThreeDots } from "react-bootstrap-icons";
import useDash from "../../assets/css/dash.module.css";
import DatePicker from "react-datepicker";
import "./allInvoices.css";
import DetailsModal from "./modal/DetailsModal";
import InvoiceEditModal from "./modal/EditModal";
import { badge } from "../../components/common/Utils";

const AllInvoices = () => {
  // get all note in redux

  let invoices = useSelector((state) => state.admin?.invoices);
  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // initial customer id state
  const [invoiceId, setInvoiceId] = useState();

  // initial owner Id state
  const [ownerId, setOwnerId] = useState();

  // initial company name state
  const [companyName, setCompanyName] = useState();

  // start date state
  const [startDate, setStartDate] = useState(firstDay);

  // end date state
  const [endDate, setEndDate] = useState(today);

  // react main state
  let [mainData, setMainData] = useState([]);

  // import dispatch
  const dispatch = useDispatch();

  // get note api call
  useEffect(() => {
    if (!invoices.length) getInvoices(dispatch, setIsLoading);
    if (invoices.length > 0) {
      setMainData(invoices);
    }
  }, [invoices]);

  // get all company name from redux
  const company = useSelector((state) => state?.companyName?.ispOwnerIds);

  // set filter status
  const [filterStatus, setFilterStatus] = useState(null);
  const [typeFilterStatus, setTypeFilterStatus] = useState(null);

  // // payment filter
  // if (filterStatus && filterStatus !== "All") {
  //   mainData = mainData.filter((value) => value.status === filterStatus);
  // }

  // // type filter
  // if (typeFilterStatus && typeFilterStatus !== "All") {
  //   mainData = mainData.filter((value) => value.type === typeFilterStatus);
  // }

  // handle delete
  const detailsModal = (invoiceId) => {
    setInvoiceId(invoiceId);
  };

  // handle edit
  const handleEdit = (invoiceId) => {
    setInvoiceId(invoiceId);
  };

  const showIndividualInvoice = (ispOwnerId, companyName) => {
    setOwnerId(ispOwnerId);
    setCompanyName(companyName);
  };

  // invoice edit method
  const invoiceEditModal = (invoiceId) => {
    setInvoiceId(invoiceId);
  };

  // date filter by last date
  const onClickDueDateFilter = () => {
    let filterMainData = [...invoices];
    // date filter
    filterMainData = filterMainData.filter(
      (value) =>
        new Date(moment(value.dueDate).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.dueDate).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );
    // payment filter
    if (filterStatus && filterStatus !== "All") {
      filterMainData = filterMainData.filter(
        (value) => value.status === filterStatus
      );
    }

    // type filter
    if (typeFilterStatus && typeFilterStatus !== "All") {
      filterMainData = filterMainData.filter(
        (value) => value.type === typeFilterStatus
      );
    }

    setMainData(filterMainData);
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
        width: "10%",
        Header: "Comapny",
        accessor: "ispOwner",
        Cell: ({ cell: { value } }) => {
          return (
            <div
              className="company-name"
              data-bs-toggle="modal"
              data-bs-target="#clientNoteModal"
              onClick={() => {
                // showIndividualInvoice(value, company[value]);
              }}
            >
              {company[value]}
            </div>
          );
        },
      },
      {
        width: "15%",
        Header: "Type",
        accessor: "type",
        Cell: ({ cell: { value } }) => {
          return (
            <div>
              <span>{badge(value)}</span>
            </div>
          );
        },
      },
      {
        width: "10%",
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return (
            <div>
              <span>{badge(value)}</span>
            </div>
          );
        },
      },
      {
        width: "5%",
        Header: "SMS",
        accessor: "numberOfSms",
      },
      {
        width: "15%",
        Header: "Amount",
        accessor: "amount",
      },

      {
        width: "8%",
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },
      {
        width: "8%",
        Header: "LastDate",
        accessor: "dueDate",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },
      {
        width: "8%",
        Header: "PaidAt",
        accessor: "paidAt",
        Cell: ({ cell: { value } }) => {
          return value ? moment(value).format("DD MMM YY hh:mm a") : "";
        },
      },

      {
        width: "6%",
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="text-center">
            <>
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#detailsInvoice"
                  onClick={() => {
                    detailsModal(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP">Details</p>
                    </div>
                  </div>
                </li>

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#InvoiceEditModalSuper"
                  onClick={() => {
                    invoiceEditModal(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">Edit</p>
                    </div>
                  </div>
                </li>
              </ul>
            </>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <>
      <FontColor>
        <Sidebar />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <h2 className="dashboardTitle text-center">All Invoices</h2>
              </div>
              <div className="card-body">
                <div className="d-flex">
                  <select
                    className="form-select mt-0 me-3"
                    aria-label="Default select example"
                    onChange={(event) => setFilterStatus(event.target.value)}
                  >
                    <option value="All" selected>
                      Payment Status
                    </option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <select
                    className="form-select mt-0 me-3"
                    aria-label="Default select example"
                    onChange={(event) =>
                      setTypeFilterStatus(event.target.value)
                    }
                  >
                    <option value="All" selected>
                      Select
                    </option>
                    <option value="monthlyServiceCharge">
                      Monthly Service Charge
                    </option>
                    <option value="registration">Registration</option>
                    <option value="smsPurchase">SMS</option>
                    <option value="migration">Migration</option>
                  </select>
                  <div class="d-flex">
                    <div>
                      <DatePicker
                        className="form-control mw-100  me-3"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText={"To"}
                      />
                    </div>
                    <div className="mx-3">
                      <DatePicker
                        className="form-control mw-100  me-3"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText={"From"}
                      />
                    </div>
                    <button
                      class="btn  btn-outline-primary btn-sm px-4"
                      onClick={() => onClickDueDateFilter()}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                <div className="table-section-th">
                  <Table
                    columns={columns}
                    data={mainData}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FontColor>

      {/* <DetailsModal id={invoiceId} isLoading={isLoading} /> */}
      <InvoiceEditModal invoiceId={invoiceId} />
    </>
  );
};

export default AllInvoices;
