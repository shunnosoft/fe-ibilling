// external imports
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
// internal imports
import "chart.js/auto";
import { FontColor, FourGround } from "../../assets/js/theme";
import useDash from "../../assets/css/dash.module.css";

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
  FiletypeCsv,
  TrashFill,
  FiletypePy,
  FilterCircle,
  People,
  PeopleFill,
  Cash,
  CashStack,
  Phone,
  ArrowClockwise,
} from "react-bootstrap-icons";
import {
  csutomerWebhookRegister,
  getCreateCsutomerLoginCredential,
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
import districtsJSON from "../../bdAddress/bd-districts.json";
import getName from "../../utils/getLocationName";
import { CSVLink } from "react-csv";
import DeleteByMobileModal from "./modal/DeleteByMobileModal";
import { useTranslation } from "react-i18next";
import IspOwnerCustomerUpdate from "./modal/IspOwnerCustomerUpdate";
import { Accordion } from "react-bootstrap";
import Loader from "../../components/common/Loader";

const districts = districtsJSON.districts;

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // get user role from redux
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // clint data state
  const [clintData, setClintData] = useState([]);

  // modal handle status
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // set owner at local state
  const [ownerId, setOwnerId] = useState();
  const [permissionId, setPermissionId] = useState("");

  // user id state
  const [userId, setUserId] = useState();

  // set owner name
  const [companyName, setCompanyName] = useState();

  // mikrotik status state
  const [mikrotikStatus, setMikrotikStatus] = useState("");

  // billing cycle response data state
  const [billingCycle, setBillingCycle] = useState("");

  //reseller data state
  const [resellerBillCycleData, setResellerBillCycleData] = useState("");

  // Owner id
  const [ispOwnerId, setIspOwnerId] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // filter options state
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    paymentStatus: "",
    billingCycle: "",
    queueType: "",
    customerType: "",
    mikrotik: "",
    district: "",
    startDate: "",
    endDate: "",
  });

  // api call
  useEffect(() => {
    if (!ispOwners.length) getIspOwners(dispatch, setIsLoading);
  }, []);

  useEffect(() => {
    setClintData(ispOwners);

    Object?.values(filterOptions) && handleClintFilter();
  }, [ispOwners]);

  // reload handler
  const reloadHandler = () => {
    getIspOwners(dispatch, setIsLoading);
  };

  // edit modal method
  const editModal = (ispOwnerId) => {
    setOwnerId(ispOwnerId);
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

  // clint filter handler
  const handleClintFilter = () => {
    const {
      status,
      paymentStatus,
      billingCycle,
      queueType,
      customerType,
      mikrotik,
      district,
      startDate,
      endDate,
    } = filterOptions;

    let tempClint = [...ispOwners];

    // payment filter
    if (paymentStatus && paymentStatus !== "") {
      tempClint = tempClint.filter(
        (value) => value.bpSettings.paymentStatus === paymentStatus
      );
    }

    if (status && status !== "") {
      tempClint = tempClint.filter((item) => item.status === status);
    }

    // execute billing cycle filter
    if (billingCycle && billingCycle !== "") {
      let billCycle;
      if (billingCycle === "true") {
        billCycle = true;
      } else if (billingCycle === "false") {
        billCycle = false;
      }

      tempClint = tempClint.filter(
        (value) => value.bpSettings.executeBillingCycle === billCycle
      );
    }

    // ispOwner queue type filter
    if (queueType && queueType !== "") {
      tempClint = tempClint.filter(
        (value) => value.bpSettings.queueType === queueType
      );
    }

    // customer type filter
    if (customerType && customerType !== "") {
      tempClint = tempClint.filter((value) =>
        value.bpSettings?.customerType.includes(customerType)
      );
    }

    // mikrotik filter
    if (mikrotik && mikrotik !== "") {
      let mtkStatus;
      if (mikrotik === "true") {
        mtkStatus = true;
      } else if (mikrotik === "false") {
        mtkStatus = false;
      }

      tempClint = tempClint.filter(
        (value) => value.bpSettings.hasMikrotik === mtkStatus
      );
    }

    //divisional area filter
    if (district && district !== "") {
      const districtName = getName(districts, district)?.name;
      tempClint = tempClint.filter((item) => item.district === districtName);
    }

    // create date filter
    if (startDate && endDate) {
      tempClint = tempClint.filter(
        (item) =>
          new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
            new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
          new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
            new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
      );
    }
    setClintData(tempClint);
  };

  const ipsOwnerBillingCycleHandler = (ispOwner) => {
    let confirm = window.confirm(
      "The isp owner wants to continue the billing cycle"
    );
    if (confirm) {
      getIspOwner(ispOwner, setBillingCycle);
    }
  };

  //reseller billing cycle
  const resellerBillingCycleHandle = (ispOwner) => {
    let confirm = window.confirm("Reseller wants to continue billing cycle");
    if (confirm) {
      getReseller(ispOwner, setResellerBillCycleData);
    }
  };

  // create customer login credential
  const createCustomerLoginCredential = (ispOwner) => {
    getCreateCsutomerLoginCredential(ispOwner?.mobile);
  };

  // create customer webhook
  const createCustomerWebhookHandler = (ispOwner) => {
    const sendingData = {
      name: ispOwner.name,
      shunnoId: Number(ispOwner.netFeeId).toString(),
      clientApp: "NETFEE",
      password: `${ispOwner.mobile}NF`,
      role: "WEBHOOK_USER",
    };

    // webhook api call
    csutomerWebhookRegister(sendingData);
  };

  // ispOwner export data csv table header
  const ispOwnerForCsVTableInfoHeader = [
    { label: "Id", key: "netFeeId" },
    { label: "Company", key: "company" },
    { label: "Name", key: "name" },
    { label: "Mobile", key: "mobile" },
    { label: "MTK", key: "hasMikrotik" },
    { label: "SMS", key: "smsBalance" },
    { label: "Customer", key: "customerLimit" },
    { label: "Rate", key: "packageRate" },
    { label: "Payment", key: "paymentStatus" },
    { label: "Status", key: "status" },
    { label: "Address", key: "address" },
    { label: "Created Date", key: "createdAt" },
    { label: "Bill Date", key: "monthlyDueDate" },
  ];

  //ispOwner export data
  const ispOwnerForCsVTableInfo = clintData.map((ispOwner) => {
    return {
      netFeeId: ispOwner.netFeeId,
      company: ispOwner.company,
      name: ispOwner.name,
      mobile: ispOwner.mobile,
      hasMikrotik: ispOwner.bpSettings.hasMikrotik ? "YES" : "NO",
      smsBalance: ispOwner.smsBalance,
      customerLimit: ispOwner.bpSettings.customerLimit,
      packageRate: ispOwner.bpSettings.packageRate,
      paymentStatus: ispOwner.bpSettings.paymentStatus,
      status: ispOwner.status,
      address: ispOwner.address,
      createdAt: moment(ispOwner.createdAt).format("DD MMM YY hh:mm a"),
      monthlyDueDate: moment(ispOwner.bpSettings.monthlyDueDate).format(
        "DD MMM YY hh:mm a"
      ),
    };
  });

  useEffect(() => {
    if (billingCycle) {
      alert(billingCycle.msg);
    }
  }, [billingCycle]);

  useEffect(() => {
    if (resellerBillCycleData) {
      alert(resellerBillCycleData.msg);
    }
  }, [resellerBillCycleData]);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "Id",
        accessor: "netFeeId",
      },
      {
        width: "15%",
        accessor: "company",
        Header: "Company",
        Cell: ({ cell: { value } }) => {
          return <strong>{value}</strong>;
        },
      },
      {
        width: "15%",
        Header: "Name/Mobile",
        accessor: (data) => `${data?.name} ${data?.mobile}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p
              title="IspOwner mobile"
              className="d-flex gap-1 align-items-center"
            >
              <Phone size={18} className="text-info" />
              <span>{original?.mobile}</span>
            </p>
          </div>
        ),
      },
      {
        width: "7%",
        accessor: "bpSettings.hasMikrotik",
        Header: "MTK",
        Cell: ({ cell: { value } }) => {
          return value ? "YES" : "NO";
        },
      },
      {
        width: "7%",
        Header: "SMS",
        accessor: "smsBalance",
        Cell: ({ row: { original } }) => (
          <div>
            {original.smsBalance +
              original.maskingSmsBalance +
              original.fixedNumberSmsBalance}
          </div>
        ),
      },
      {
        width: "10%",
        Header: "User/Rate",
        accessor: (data) =>
          `${data?.bpSettings?.customerLimit} ${data?.bpSettings?.packageRate}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p
              title="Customer limit"
              className="d-flex gap-1 align-items-center"
            >
              <People size={16} className="text-primary" />
              {original?.bpSettings.customerLimit}
            </p>
            <p
              title="Customer package rate"
              className="d-flex gap-1 align-items-center"
            >
              <CashStack size={18} className="text-success" />
              <span>{original?.bpSettings.packageRate}</span>
            </p>
          </div>
        ),
      },
      {
        width: "10%",
        accessor: "address",
        Header: "Address",
      },
      {
        width: "18%",
        Header: "Created/Bill Date",
        accessor: (data) =>
          `${moment(data?.createdAt).format("DD MMM YY hh:mm A")} ${moment(
            data?.bpSettings?.monthlyDueDate
          ).format("DD MMM YY hh:mm A")}`,
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div>
              <p>{moment(original?.createdAt).format("DD MMM YY hh:mm A")}</p>
              <p>
                {moment(original?.bpSettings?.monthlyDueDate).format(
                  "DD MMM YY hh:mm A"
                )}
              </p>
            </div>
          </div>
        ),
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: (data) =>
          `${data?.bpSettings?.paymentStatus} ${data?.status}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center">
            <p>{badge(original?.status)}</p>
            <p>{badge(original?.bpSettings?.paymentStatus)}</p>
          </div>
        ),
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
                      setModalStatus("details");
                      setShow(true);
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
                    onClick={() => {
                      setPermissionId(original?.id);
                      setModalStatus("permission");
                      setShow(true);
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
                    onClick={() => {
                      editModal(original.id);
                      setModalStatus("edit");
                      setShow(true);
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
                    onClick={() => {
                      setOwnerId(original?.id);
                      setCompanyName(original?.company);
                      setModalStatus("invoice");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PersonBoundingBox />
                        <p className="actionP">Invoice</p>
                      </div>
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      setIspOwnerId(original?.id);
                      setCompanyName(original?.company);
                      setModalStatus("multiple");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <i class="fa-solid fa-pen-to-square"></i>
                        <p className="actionP">Multiple Customer Update</p>
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
                  <li
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
                  </li>
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
                      setModalStatus("password");
                      setShow(true);
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
                      ipsOwnerBillingCycleHandler(original);
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
                      resellerBillingCycleHandle(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        <p className="actionP">Reseller Billing Cycle</p>
                      </div>
                    </div>
                  </li>

                  <li
                    onClick={() => {
                      createCustomerLoginCredential(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        <p className="actionP">
                          Create Customer Login Credential
                        </p>
                      </div>
                    </div>
                  </li>

                  {userRole === "superadmin" && (
                    <li
                      onClick={() => {
                        createCustomerWebhookHandler(original);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <FiletypePy />
                          <p className="actionP">Create Customer Webhook</p>
                        </div>
                      </div>
                    </li>
                  )}
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
      <FontColor>
        <FourGround>
          <div className="collectorTitle d-flex justify-content-between px-4">
            <div className="component_name">
              {userRole === "admin" ? "Admin Dashboard" : "Super Admin"}
            </div>

            <div className="d-flex align-items-center">
              <div
                onClick={() => {
                  if (!activeKeys) {
                    setActiveKeys("filter");
                  } else {
                    setActiveKeys("");
                  }
                }}
                title={t("filter")}
              >
                <FilterCircle className="addcutmButton" />
              </div>

              <div className="reloadBtn">
                {isLoading ? (
                  <Loader />
                ) : (
                  <ArrowClockwise
                    className="arrowClock"
                    title="Refresh"
                    onClick={reloadHandler}
                  />
                )}
              </div>

              <TrashFill
                size={23}
                className="addcutmButton"
                onClick={() => {
                  setModalStatus("mobileNumberSearch");
                  setShow(true);
                }}
              />

              <CSVLink
                data={ispOwnerForCsVTableInfo}
                filename={ispOwners.company}
                headers={ispOwnerForCsVTableInfoHeader}
                title="IspOwner Customer CSV"
              >
                <FiletypeCsv className="addcutmButton" />
              </CSVLink>
            </div>
          </div>
        </FourGround>

        <FourGround>
          <div className="mt-2">
            <Accordion alwaysOpen activeKey={activeKeys}>
              <Accordion.Item eventKey="filter">
                <Accordion.Body>
                  <div className="displayGrid6">
                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          paymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="" selected>
                        All
                      </option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>

                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="" selected>
                        Status
                      </option>
                      <option value="new">New</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                      <option value="deleted">Deleted</option>
                      <option value="trial">Trial</option>
                    </select>

                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          billingCycle: e.target.value,
                        })
                      }
                    >
                      <option value="" selected>
                        Execute Billing Cycle
                      </option>
                      <option value="true">Run Billing Cycle</option>
                      <option value="false">Don't Billing Cycle</option>
                    </select>

                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          queueType: e.target.value,
                        })
                      }
                    >
                      <option value="">Queue Type</option>
                      <option value="simple-queue">Simple Queue</option>
                      <option value="firewall-queue">Firewall Queue</option>
                      <option value="core-queue">Core Queue</option>
                    </select>

                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          customerType: e.target.value,
                        })
                      }
                    >
                      <option value="">Customer Type</option>
                      <option value="pppoe">PPPoE</option>
                      <option value="static">Static</option>
                      <option value="hotspot">Hotspot</option>
                    </select>

                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          mikrotik: e.target.value,
                        })
                      }
                    >
                      <option value="" selected>
                        Mikrotik
                      </option>
                      <option value="true">With Mikrotik</option>
                      <option value="false">WithOut Mikrotik</option>
                    </select>

                    <select
                      className="form-select mt-0"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setFilterOptions({
                          ...filterOptions,
                          district: e.target.value,
                        })
                      }
                    >
                      <option value="" selected>
                        All District
                      </option>
                      {districts.map((item) => {
                        return <option value={item.id}>{item.name}</option>;
                      })}
                    </select>

                    <div>
                      <DatePicker
                        className="form-control mt-0"
                        selected={filterOptions.startDate}
                        onChange={(date) =>
                          setFilterOptions({
                            ...filterOptions,
                            startDate: date,
                          })
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText={t("startDate")}
                      />
                    </div>

                    <div>
                      <DatePicker
                        className="form-control mt-0"
                        selected={filterOptions.endDate}
                        onChange={(date) =>
                          setFilterOptions({
                            ...filterOptions,
                            endDate: date,
                          })
                        }
                        dateFormat="dd-MM-yyyy"
                        placeholderText={t("endDate")}
                      />
                    </div>

                    <Link to={"/admin/all-comments"}>
                      <div className="all-comment-btn">
                        <button className="btn btn-outline-success w-100">
                          All Comment
                        </button>
                      </div>
                    </Link>

                    {userRole === "superadmin" && (
                      <Link to={"/admin/invoices"}>
                        <div className="all-comment-btn">
                          <button className="btn btn-outline-primary w-100">
                            Invoice
                          </button>
                        </div>
                      </Link>
                    )}

                    <div className="displayGrid1 mt-0 ">
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={handleClintFilter}
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="collectorWrapper pb-2">
              <Table isLoading={isLoading} columns={columns} data={clintData} />
            </div>
          </div>
        </FourGround>
      </FontColor>

      {/* owner permissions  */}
      {modalStatus === "permission" && (
        <Permissions show={show} setShow={setShow} ownerId={permissionId} />
      )}

      {modalStatus === "edit" && (
        <EditModal show={show} setShow={setShow} ownerId={ownerId} />
      )}

      {modalStatus === "details" && (
        <DetailsModal {...{ show, setShow, ownerId }} />
      )}

      <AddProprietorModal ownerId={ownerId} />

      {/* customer invoice list */}
      {modalStatus === "invoice" && (
        <Invoices
          ownerId={ownerId}
          companyName={companyName}
          isOpen={show}
          setIsOpen={setShow}
        />
      )}

      {/* owner multiple customer update */}
      {modalStatus === "multiple" && (
        <IspOwnerCustomerUpdate
          isShow={show}
          setIsShow={setShow}
          ispOwnerId={ispOwnerId}
          companyName={companyName}
        />
      )}

      <Note ownerId={ownerId} companyName={companyName} />
      <FileUpload ownerID={ownerId} mikrotikStatus={mikrotikStatus} />

      {/* user mobile number search and delete */}
      {modalStatus === "mobileNumberSearch" && (
        <DeleteByMobileModal show={show} setShow={setShow} />
      )}

      {/* password reset modal */}
      {modalStatus === "password" && (
        <PasswordReset show={show} setShow={setShow} userId={userId} />
      )}
    </>
  );
}
