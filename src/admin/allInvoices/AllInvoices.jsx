import React, { useEffect, useState, useMemo } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices, getIspOwners } from "../../features/apiCallAdmin";
import moment from "moment";
import Table from "../../components/table/Table";
import {
  FileExcelFill,
  PenFill,
  PersonFill,
  ThreeDots,
} from "react-bootstrap-icons";
import useDash from "../../assets/css/dash.module.css";
import DatePicker from "react-datepicker";
import "./allInvoices.css";
import DetailsModal from "./modal/DetailsModal";
import InvoiceEditModal from "./modal/EditModal";
import { badge } from "../../components/common/Utils";
import FormatNumber from "../../components/common/NumberFormat";
import { CSVLink } from "react-csv";
import Invoices from "../invoiceList/Invoices";

const AllInvoices = () => {
  // get all note in redux

  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  let invoices = useSelector((state) => state.companyName.invoices);

  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [ispOwnerLoading, setIspOwnerLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // initial customer id state
  const [invoiceId, setInvoiceId] = useState();

  // initial owner Id state
  const [ownerId, setOwnerId] = useState();

  // initial company name state
  const [companyName, setCompanyName] = useState();

  // paid date state
  const [startPaidDate, setStartPaidDate] = useState(firstDay);
  const [endPaidDate, setEndPaidDate] = useState(today);

  // create date state
  const [startCreateDate, setStartCreateDate] = useState(firstDay);
  const [endCreateDate, setEndCreateDate] = useState(today);

  // react main state
  let [mainData, setMainData] = useState([]);

  // get user role from redux
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // import dispatch
  const dispatch = useDispatch();

  // get note api call
  useEffect(() => {
    if (!invoices?.length) getInvoices(dispatch, setIsLoading);
    if (invoices?.length > 0) {
      setMainData(invoices);
    }
    if (!ispOwners?.length) getIspOwners(dispatch, setIspOwnerLoading);
  }, [invoices]);

  // get all company name from redux
  const company = useSelector((state) => state?.admin?.ispOwnerIds);

  // set filter status
  const [filterStatus, setFilterStatus] = useState("All");
  const [typeFilterStatus, setTypeFilterStatus] = useState("All");

  // invoice edit method
  const invoiceEditModal = (invoiceId) => {
    setInvoiceId(invoiceId);
  };

  // date filter by last date
  const onClickDueDateFilter = () => {
    let filterMainData = [...invoices];

    // payment filter
    if (filterStatus && filterStatus !== "All") {
      filterMainData = filterMainData.filter(
        (value) => value.status === filterStatus
      );
    } else {
      filterMainData = filterMainData;
    }

    // type filter
    if (typeFilterStatus && typeFilterStatus !== "All") {
      filterMainData = filterMainData.filter(
        (value) => value.type === typeFilterStatus
      );
    } else {
      filterMainData = filterMainData;
    }

    setMainData(filterMainData);
  };

  // reset status filter handler
  const onClickDueDateFilterReset = () => {
    setFilterStatus("All");
    setTypeFilterStatus("All");
    setMainData(invoices);
  };

  // Invoice paid date filter handler
  const handleAllInvoicePaidDateFilter = () => {
    let arr = [...invoices];

    const filteredArr = arr.filter((item) => {
      const itemDate = new Date(item?.paidAt).setHours(0, 0, 0, 0);
      const startDate = new Date(startPaidDate).setHours(0, 0, 0, 0);
      const endDate = new Date(endPaidDate).setHours(23, 59, 59, 999);

      return itemDate >= startDate && itemDate <= endDate;
    });

    setMainData(filteredArr);
  };

  // reset paid date filter handler
  const handleAllInvoicePaidDateFilterReset = () => {
    setStartPaidDate(firstDay);
    setEndPaidDate(today);
    setMainData(invoices);
  };

  // Invoice create date filter handler
  const handleAllInvoiceCreateDateFilter = () => {
    let arr = [...invoices];

    const filteredArr = arr.filter((item) => {
      const itemDate = new Date(item?.createdAt).setHours(0, 0, 0, 0);
      const startDate = new Date(startCreateDate).setHours(0, 0, 0, 0);
      const endDate = new Date(endCreateDate).setHours(23, 59, 59, 999);

      return itemDate >= startDate && itemDate <= endDate;
    });

    setMainData(filteredArr);
  };

  // reset create date filter handler
  const handleAllInvoiceCreateDateFilterReset = () => {
    setStartCreateDate(firstDay);
    setEndCreateDate(today);
    setMainData(invoices);
  };

  //total monthly fee and due calculation
  const totalStat = useMemo(() => {
    let dueAmount = 0;
    let totalSms = 0;
    let totalAmount = 0;

    mainData.map((item) => {
      // sum of all monthly fee
      if (item.amount) {
        totalAmount += item.amount;
      }
      totalSms += item.numberOfSms;
    });

    return { totalSms, totalAmount };
  }, [mainData]);

  //custom table header component
  const customComponent =
    userRole === "superadmin" ? (
      <div
        className="text-center"
        style={{ fontSize: "18px", display: "flex" }}
      >
        {"Total: "}&nbsp; {FormatNumber(totalStat.totalAmount)}
        &nbsp;
        {"Tk"} &nbsp;&nbsp; {"Total Sms: "}&nbsp;
        {FormatNumber(totalStat.totalSms)} &nbsp;
      </div>
    ) : null;

  //  all invoice data csv table header
  const allInvoiceForCsVTableInfoHeader = [
    { label: "Company", key: "company" },
    { label: "Type", key: "type" },
    { label: "Status", key: "status" },
    { label: "SMS", key: "numberOfSms" },
    { label: "Amount", key: "amount" },
    { label: "Created Date", key: "createdAt" },
    { label: "Last Date", key: "updatedAt" },
    { label: "Paid Date", key: "paidAt" },
  ];

  // all invoice data
  const allInvoiceForCsVTableInfo = mainData.map((invoice) => {
    return {
      company: company[invoice.ispOwner]?.company,
      type: invoice.type,
      status: invoice.status,
      numberOfSms: invoice.numberOfSms,
      amount: invoice.amount,
      createdAt: moment(invoice.createdAt).format("DD MMM YY hh:mm a"),
      updatedAt: moment(invoice.updatedAt).format("DD MMM YY hh:mm a"),
      paidAt: moment(invoice.paidAt).format("DD MMM YY hh:mm a"),
    };
  });

  // table column
  const columns = React.useMemo(
    () => [
      {
        // width: "10%",
        Header: "ID",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.ispOwner
              ? original?.ispOwner?.netFeeId
              : original?.reseller?.ispOwner?.netFeeId}
          </div>
        ),
      },
      {
        // width: "10%",
        Header: "Company",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.ispOwner
              ? original?.ispOwner?.company
              : original?.reseller?.ispOwner?.company}
          </div>
        ),
      },
      {
        // width: "10%",
        Header: "Name",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.ispOwner
              ? `${original?.ispOwner?.name} (ispOwner)`
              : `${original?.reseller?.ispOwner?.name} (reseller)`}
          </div>
        ),
      },
      {
        // width: "15%",
        Header: "Type",
        accessor: "type",
        Cell: ({ cell: { value } }) => (
          <div>
            <span>{badge(value)}</span>
          </div>
        ),
      },
      {
        // width: "10%",
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
        // width: "5%",
        Header: "SMS",
        accessor: "numberOfSms",
      },
      {
        // width: "15%",
        Header: "Amount",
        accessor: "amount",
      },

      {
        // width: "10%",
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },
      {
        // width: "10%",
        Header: "LastDate",
        accessor: "dueDate",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },
      {
        // width: "10%",
        Header: "PaidAt",
        accessor: "paidAt",
        Cell: ({ cell: { value } }) => {
          return value ? moment(value).format("DD MMM YY hh:mm a") : "";
        },
      },

      {
        // width: "10%",
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
                  onClick={() => {
                    setOwnerId(original.ispOwner?.id);
                    setCompanyName(original.ispOwner?.name);
                    setIsOpen(true);
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
    [company]
  );
  return (
    <>
      <FontColor>
        <Sidebar />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h2 className="dashboardTitle text-center">All Invoices</h2>

                  <div className="addAndSettingIcon d-flex justify-content-center align-items-center">
                    <CSVLink
                      data={allInvoiceForCsVTableInfo}
                      // filename={company[comments?.ispOwner]?.company}
                      headers={allInvoiceForCsVTableInfoHeader}
                      title="All Invoice CSV"
                    >
                      <FileExcelFill className="addcutmButton" />
                    </CSVLink>
                  </div>
                </div>
              </div>
              <div className="card-body displayGrid">
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
                    value={typeFilterStatus}
                  >
                    <option value="All" selected>
                      Invoice Type
                    </option>
                    <option value="monthlyServiceCharge">
                      Monthly Service Charge
                    </option>
                    <option value="registration">Registration</option>
                    <option value="smsPurchase">SMS</option>
                    <option value="migration">Migration</option>
                  </select>

                  <button
                    class="btn  btn-outline-primary btn-md px-4 me-3"
                    onClick={onClickDueDateFilter}
                  >
                    Submit
                  </button>

                  <button
                    class="btn  btn-outline-secondary btn-md px-4"
                    onClick={onClickDueDateFilterReset}
                  >
                    Reset
                  </button>
                </div>

                <div class="d-flex">
                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      Paid Start Date
                    </label>

                    <DatePicker
                      className="form-control mw-100  me-3"
                      selected={startPaidDate}
                      onChange={(date) => setStartPaidDate(date)}
                      dateFormat="MMM dd yyyy"
                      placeholderText={"To"}
                    />
                  </div>
                  <div className="mx-3">
                    <label className="form-control-label changeLabelFontColor">
                      Paid End Date
                    </label>

                    <DatePicker
                      className="form-control mw-100  me-3"
                      selected={endPaidDate}
                      onChange={(date) => setEndPaidDate(date)}
                      dateFormat="MMM dd yyyy"
                      placeholderText={"From"}
                    />
                  </div>

                  <button
                    class="btn btn-outline-primary btn-md px-4 d-flex align-self-end  me-3"
                    onClick={handleAllInvoicePaidDateFilter}
                  >
                    Submit
                  </button>

                  <button
                    class="btn  btn-outline-secondary d-flex align-self-end btn-md px-4"
                    onClick={handleAllInvoicePaidDateFilterReset}
                  >
                    Reset
                  </button>
                </div>

                <div class="d-flex">
                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      Create Start Date
                    </label>

                    <DatePicker
                      className="form-control mw-100  me-3"
                      selected={startCreateDate}
                      onChange={(date) => setStartCreateDate(date)}
                      dateFormat="MMM dd yyyy"
                      placeholderText={"To"}
                    />
                  </div>
                  <div className="mx-3">
                    <label className="form-control-label changeLabelFontColor">
                      Create End Date
                    </label>

                    <DatePicker
                      className="form-control mw-100  me-3"
                      selected={endCreateDate}
                      onChange={(date) => setEndCreateDate(date)}
                      dateFormat="MMM dd yyyy"
                      placeholderText={"From"}
                    />
                  </div>

                  <button
                    class="btn btn-outline-primary btn-md px-4 d-flex align-self-end me-3"
                    onClick={handleAllInvoiceCreateDateFilter}
                  >
                    Submit
                  </button>

                  <button
                    class="btn  btn-outline-secondary d-flex align-self-end btn-md px-4"
                    onClick={handleAllInvoiceCreateDateFilterReset}
                  >
                    Reset
                  </button>
                </div>

                <div className="table-section-th">
                  <Table
                    customComponent={customComponent}
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

      {/* invoice details */}
      <Invoices
        ownerId={ownerId}
        companyName={companyName}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* <DetailsModal id={invoiceId} isLoading={isLoading} /> */}
      <InvoiceEditModal invoiceId={invoiceId} />
    </>
  );
};

export default AllInvoices;
