// external imports
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
// internal imports
import "chart.js/auto";
import { FontColor } from "../../assets/js/theme";

import {
  PersonBoundingBox,
  PersonFill,
  PenFill,
  ThreeDots,
  CardChecklist,
  FileEarmarkExcel,
  JournalCode,
  CreditCard2Front,
  KeyFill,
  Award,
} from "react-bootstrap-icons";
import {
  getIspOwner,
  getIspOwners,
  getReseller,
  resetSerialNumber,
} from "../../features/apiCallAdmin";
import Table from "../../components/table/Table";
import EditModal from "./modal/EditModal";
import "./home.css";
import DetailsModal from "./modal/DetailsModal";
import Note from "./modal/Note";
import FileUpload from "./modal/FileUpload";
import Permissions from "./modal/Permissions";
import AddProprietorModal from "./modal/AddProprietorModal";
import Invoices from "../invoiceList/Invoices";
import { badge } from "../../components/common/Utils";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import { setIspOwnerData } from "../../features/authSlice";

export default function Home() {
  // loading
  const [isLoading, setIsLoading] = useState(false);

  // import dispatch
  const dispatch = useDispatch();

  // set owner at local state
  const [ownerId, setOwnerId] = useState();

  // invoice id state
  const [invoiceId, setInvoiceId] = useState();

  // user id state
  const [userId, setUserId] = useState();

  // set owner name
  const [companyName, setCompanyName] = useState();

  // set filter status
  const [filterStatus, setFilterStatus] = useState(null);

  // status state
  const [status, setStatus] = useState(null);

  // mikrotik filter state
  const [mikrotik, setMikrotik] = useState();

  // mikrotik status state
  const [mikrotikStatus, setMikrotikStatus] = useState("");

  // execute billing cycle statue state
  const [executeBill, setExecuteBill] = useState("");

  // billing cycle response data state
  const [billingCycle, setBillingCycle] = useState("");

  //reseller data state
  const [resellerBillCycleData, setResellerBillCycleData] = useState("");

  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // get user role from redux
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // payment filter
  if (filterStatus && filterStatus !== "All") {
    ispOwners = ispOwners.filter(
      (value) => value.bpSettings.paymentStatus === filterStatus
    );
  }

  if (status && status !== "status") {
    ispOwners = ispOwners.filter((item) => item.status === status);
  }

  // execute billing cycle filter
  if (executeBill && executeBill !== "All") {
    let billCycle;
    if (executeBill === "true") {
      billCycle = true;
    } else if (executeBill === "false") {
      billCycle = false;
    }

    ispOwners = ispOwners.filter(
      (value) => value.bpSettings.executeBillingCycle === billCycle
    );
  }

  // mikrotik filter
  if (mikrotik && mikrotik !== "All") {
    let mtkStatus;
    if (mikrotik === "true") {
      mtkStatus = true;
    } else if (mikrotik === "false") {
      mtkStatus = false;
    }

    ispOwners = ispOwners.filter(
      (value) => value.bpSettings.hasMikrotik === mtkStatus
    );
  }

  // api call
  useEffect(() => {
    if (!ispOwners.length) getIspOwners(dispatch, setIsLoading);
  }, []);

  // edit modal method
  const editModal = (ispOwnerId) => {
    setOwnerId(ispOwnerId);
  };

  // permission modal method
  const permissionModal = (permissionId) => {
    setOwnerId(permissionId);
  };

  // details modal handle
  const detailsModal = (showDetailsId) => {
    setOwnerId(showDetailsId);
  };

  // Reset Customer Serial Number
  const resetSerialNumberHandler = (ispOwnerId) => {
    resetSerialNumber(ispOwnerId);
  };

  const noteModal = (noteId, companyName) => {
    setOwnerId(noteId);
    setCompanyName(companyName);
  };

  const fileModal = (ownerId, mtk) => {
    setOwnerId(ownerId);
    setMikrotikStatus(mtk);
  };

  //get ispOwner execute billing cycle
  const ipsOwnerHandler = (id) => {
    const ispData = ispOwners.find((item) => item.id === id);

    let confirm = window.confirm(
      "The isp owner wants to continue the billing cycle"
    );
    if (confirm) {
      getIspOwner(ispData, setBillingCycle, setIsLoading);
      alert(billingCycle?.msg);
    }
  };

  //reseller billing cycle
  const resellerBillingCycleHandle = (id) => {
    const ispData = ispOwners.find((item) => item.id === id);

    let confirm = window.confirm("Reseller wants to continue billing cycle");
    if (confirm) {
      getReseller(ispData, setIsLoading, setResellerBillCycleData);
      alert(resellerBillCycleData?.msg);
    }
  };

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "Id",
        accessor: "netFeeId",
      },

      {
        width: "5%",
        accessor: "company",
        Header: "Company",
      },

      {
        width: "5%",
        accessor: "name",
        Header: "Name",
      },
      {
        width: "8%",
        accessor: "mobile",
        Header: "Mobile",
      },
      {
        width: "5%",
        accessor: "bpSettings.hasMikrotik",
        Header: "MTK",
        Cell: ({ cell: { value } }) => {
          return value ? "YES" : "NO";
        },
      },
      {
        width: "8%",
        accessor: "smsBalance",
        Header: "SMS",
      },
      {
        width: "8%",
        accessor: "bpSettings.customerLimit",
        Header: "Customer",
      },
      {
        width: "7%",
        accessor: "bpSettings.packageRate",
        Header: "Rate",
      },
      {
        width: "10%",
        Header: "Payment",
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
                (original.bpSettings.paymentStatus === "paid"
                  ? "bg-success"
                  : "bg-warning")
              }
            >
              {original.bpSettings.paymentStatus}
            </span>
          </div>
        ),
      },
      {
        width: "8%",
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        accessor: "address",
        Header: "Address",
      },

      {
        width: "9%",
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },

      {
        width: "9%",
        Header: "Bill Date",
        accessor: "bpSettings.monthlyDueDate",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },

      {
        width: "5%",
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => {
          return (
            <div className="text-center">
              <div className="dropdown">
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
                    data-bs-target="#showCustomerDetails"
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
                    data-bs-target="#clientParmissionModal"
                    onClick={() => {
                      permissionModal(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CreditCard2Front />
                        <p className="actionP">Permissions</p>
                      </div>
                    </div>
                  </li>
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#clientEditModal"
                    onClick={() => {
                      editModal(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">Edit</p>
                      </div>
                    </div>
                  </li>

                  {/* <li>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PersonBoundingBox />
                        <Link
                          to={
                            "/admin/isp-owner/invoice-list/" +
                            original.id +
                            "?company=" +
                            original.company
                          }
                        >
                          <p className="actionP text-white">Invoice</p>
                        </Link>
                      </div>
                    </div>
                  </li> */}
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#ispOwnerInvoice"
                    onClick={() => {
                      setInvoiceId(original?.id);
                      setCompanyName(original?.company);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PersonBoundingBox />
                        <p className="actionP">Invoice</p>
                      </div>
                    </div>
                  </li>
                  <Link to={`/admin/netFee/support/${original.id}`}>
                    <li>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Award />
                          <p className="actionP">NetFee Support</p>
                        </div>
                      </div>
                    </li>
                  </Link>
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#clientNoteModal"
                    onClick={() => {
                      noteModal(original.id, original.company);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CardChecklist />
                        <p className="actionP">Note</p>
                      </div>
                    </div>
                  </li>
                  {/* <li
                    data-bs-toggle="modal"
                    data-bs-target="#inventoryAddModal"
                    onClick={() => {
                      setOwnerId(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CardChecklist />
                        <p className="actionP">Add Inventory</p>
                      </div>
                    </div>
                  </li> */}
                  <li onClick={() => resetSerialNumberHandler(original.id)}>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <JournalCode />
                        <p className="actionP">Reset Serial</p>
                      </div>
                    </div>
                  </li>

                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#fileUploadModal"
                    onClick={() => {
                      if (!original.bpSettings.hasMikrotik) {
                        fileModal(original.id, "noMikrotik");
                      } else if (original.bpSettings.hasMikrotik) {
                        fileModal(original.id, "mikrotik");
                      }
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <FileEarmarkExcel />
                        <p className="actionP">CSV File Upload</p>
                      </div>
                    </div>
                  </li>

                  {/* <li>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ReactToPrint
                          documentTitle={`${original.name} customer list`}
                          trigger={() => (
                            <div>
                              {" "}
                              <PrinterFill /> &nbsp; Download Customer
                            </div>
                          )}
                          content={() => componentRef.current}
                        />
                      </div>
                    </div>
                    <div style={{ display: "none" }}>
                      <PrintCustomer
                        customers={customer}
                        ref={componentRef}
                        ispOwnerData={original}
                      />
                    </div>
                  </li> */}
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#resetPassword"
                    onClick={() => {
                      setUserId(original.user);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <KeyFill />
                        <p className="actionP">Password Reset</p>
                      </div>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      ipsOwnerHandler(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        <p className="actionP">IspOwner Billing Cycle</p>
                      </div>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      resellerBillingCycleHandle(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        <p className="actionP">Reseller Billing Cycle</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="homeWrapper isp_owner_list">
        <ToastContainer position="top-right" theme="colored" />
        <div className="card">
          <div className="card-header">
            <div className="row">
              <h2 className="dashboardTitle text-center">
                {userRole === "admin" ? "Admin Dashborad" : "Super Admin"}
              </h2>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex">
              <select
                className="form-select mt-0 me-3"
                aria-label="Default select example"
                onChange={(event) => setFilterStatus(event.target.value)}
              >
                <option value="All" selected>
                  All
                </option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <select
                className="form-select mt-0 me-3"
                aria-label="Default select example"
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="status" selected>
                  Status
                </option>
                <option value="new">New</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
                <option value="deleted">Deleted</option>
              </select>
              <select
                className="form-select mt-0 me-3"
                aria-label="Default select example"
                onChange={(event) => setExecuteBill(event.target.value)}
              >
                <option value="All" selected>
                  Execute Billing Cycle
                </option>
                <option value="true">Run Billing Cycle</option>
                <option value="false">Don't Billing Cycle</option>
              </select>
              <select
                className="form-select mt-0 me-3"
                aria-label="Default select example"
                onChange={(event) => setMikrotik(event.target.value)}
              >
                <option value="All" selected>
                  Mikrotik
                </option>
                <option value="true">With Mikrotik</option>
                <option value="false">WithOut Mikrotik</option>
              </select>
              <Link to={"/admin/all-comments"}>
                <div className="all-comment-btn">
                  <button className="btn btn-outline-success">
                    All Comment
                  </button>
                </div>
              </Link>
              &nbsp;
              {userRole === "superadmin" && (
                <Link to={"/admin/invoices"}>
                  <div className="all-comment-btn">
                    <button className="btn btn-outline-primary">Invoice</button>
                  </div>
                </Link>
              )}
            </div>

            <FontColor>
              <Table
                isLoading={isLoading}
                columns={columns}
                data={ispOwners}
              ></Table>

              <Permissions ownerId={ownerId} />
              <EditModal ownerId={ownerId} />
              <DetailsModal ownerId={ownerId} />
              {/* <AddProprietorModal ownerId={ownerId} /> */}
              <Invoices invoiceId={invoiceId} companyName={companyName} />
              <Note ownerId={ownerId} companyName={companyName} />
              <FileUpload ownerID={ownerId} mikrotikStatus={mikrotikStatus} />

              {/* password reset modal */}
              <PasswordReset resetCustomerId={userId} />
              {/* Execute billing cycle ispOwner */}
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
