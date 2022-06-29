import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices } from "../../features/apiCallAdmin";
import moment from "moment";
import Table from "../../components/table/Table";
import { PenFill, PersonFill, ThreeDots } from "react-bootstrap-icons";
import useDash from "../../assets/css/dash.module.css";
import "./allInvoices.css";
import DetailsModal from "./modal/DetailsModal";
import EditModal from "./modal/EditModal";
import { badge } from "../../components/common/Utils";

const AllInvoices = () => {
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // initial customer id state
  const [invoiceID, setInvoiceID] = useState();

  // initial owner Id state
  const [ownerId, setOwnerId] = useState();

  // initial company name state
  const [companyName, setCompanyName] = useState();

  // import dispatch
  const dispatch = useDispatch();

  // get note api call
  useEffect(() => {
    getInvoices(dispatch, setIsLoading);
  }, []);

  // get all note in redux
  const invoices = useSelector((state) => state.admin?.invoices);

  // get all company name from redux
  const company = useSelector(
    (state) => state.persistedReducer?.companyName?.ispOwnerIds
  );

  // handle delete
  const detailsModal = (invoiceId) => {
    setInvoiceID(invoiceId);
  };

  // handle edit
  const handleEdit = (invoiceId) => {
    setInvoiceID(invoiceId);
  };

  const showIndividualInvoice = (ispOwnerId, companyName) => {
    console.log(ispOwnerId, companyName);
    setOwnerId(ispOwnerId);
    setCompanyName(companyName);
  };

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        width: "12%",
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
        width: "10%",
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
        width: "8%",
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
        width: "12%",
        Header: "SMS",
        accessor: "numberOfSms",
      },
      {
        width: "14%",
        Header: "Amount",
        accessor: "amount",
      },

      {
        width: "12%",
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },
      {
        width: "12%",
        Header: "Due Date",
        accessor: "dueDate",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },

      {
        width: "8%",
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
                  data-bs-target="#editInvoice"
                  onClick={() => {
                    handleEdit(original.id);
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
                <div className="table-section-th">
                  <Table
                    columns={columns}
                    data={invoices}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FontColor>

      {/* <DetailsModal id={invoiceID} isLoading={isLoading} /> */}
      {/* <EditModal id={invoiceID} /> */}
    </>
  );
};

export default AllInvoices;
