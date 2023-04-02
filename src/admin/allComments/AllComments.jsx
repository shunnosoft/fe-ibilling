import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../../features/apiCallAdmin";
import moment from "moment";
import Table from "../../components/table/Table";
import {
  FileExcelFill,
  PenFill,
  PersonFill,
  ThreeDots,
} from "react-bootstrap-icons";
import useDash from "../../assets/css/dash.module.css";
import "./allComments.css";
import DetailsModal from "./modal/DetailsModal";
import EditModal from "./modal/EditModal";
import { badge } from "../../components/common/Utils";
import Note from "../Home/modal/Note";
import { CSVLink } from "react-csv";

const AllComments = () => {
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // initial customer id state
  const [commentID, setCommentID] = useState();

  // initial owner Id state
  const [ownerId, setOwnerId] = useState();

  // initial company name state
  const [companyName, setCompanyName] = useState();

  //filter state
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  // import dispatch
  const dispatch = useDispatch();

  // get all note in redux
  let comments = useSelector((state) => state.admin?.comments);

  // get note api call
  useEffect(() => {
    if (!comments.length) getComments(dispatch, setIsLoading);
  }, []);

  // get all company name from redux
  const company = useSelector((state) => state?.companyName?.ispOwnerIds);

  // handle delete
  const detailsModal = (commentId) => {
    setCommentID(commentId);
  };

  // handle edit
  const handleEdit = (commentId) => {
    setCommentID(commentId);
  };

  const showIndividualComment = (ispOwnerId, companyName) => {
    setOwnerId(ispOwnerId);
    setCompanyName(companyName);
  };

  // comment type filter
  if (type && type !== "All") {
    comments = comments.filter((value) => value.commentType === type);
  }

  // comment status filter
  if (status && status !== "All") {
    comments = comments.filter((value) => value.status === status);
  }

  // comment data csv table header
  const commentForCsVTableInfoHeader = [
    { label: "Id", key: "ispOwner" },
    { label: "Name", key: "name" },
    { label: "Type", key: "commentType" },
    { label: "Status", key: "status" },
    { label: "Comment", key: "comment" },
    { label: "Created Date", key: "createdAt" },
  ];

  //comment data
  const commentForCsVTableInfo = comments.map((comment) => {
    return {
      company: company[comment.ispOwner]?.company,
      name: comment.name,
      commentType: comment.commentType,
      status: comment.status,
      comment: comment.comment,
      createdAt: moment(comment.createdAt).format("DD MMM YY hh:mm a"),
    };
  });

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
        Header: "Name",
        accessor: "name",
      },
      {
        width: "12%",
        Header: "Company",
        accessor: "ispOwner",
        Cell: ({ cell: { value } }) => {
          return (
            <div
              className="company-name"
              // data-bs-toggle="modal"
              // data-bs-target="#clientNoteModal"
              // onClick={() => {
              //   showIndividualComment(value, company[value]);
              // }}
            >
              {company[value]?.company}
            </div>
          );
        },
      },
      {
        width: "10%",
        Header: "Type",
        accessor: "commentType",
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
        width: "28%",
        Header: "Comment",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original.comment && original.comment.slice(0, 50)}
              <span
                className="text-primary see-more"
                data-bs-toggle="modal"
                data-bs-target="#detailsComment"
                onClick={() => {
                  detailsModal(original.id);
                }}
              >
                {" "}
                {original.comment && "...see more"}
              </span>
            </div>
          );
        },
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
                  data-bs-target="#detailsComment"
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
                  data-bs-target="#editComment"
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
                <div className="d-flex justify-content-between">
                  <h2 className="dashboardTitle">All Comments</h2>

                  <div className="addAndSettingIcon d-flex justify-content-center align-items-center">
                    <CSVLink
                      data={commentForCsVTableInfo}
                      filename={company[comments?.ispOwner]?.company}
                      headers={commentForCsVTableInfoHeader}
                      title="Comment CSV"
                    >
                      <FileExcelFill className="addcutmButton" />
                    </CSVLink>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex">
                  <select
                    className="form-select mt-0 me-3"
                    aria-label="Default select example"
                    onChange={(event) => setType(event.target.value)}
                  >
                    <option value="All" selected>
                      Type
                    </option>
                    <option value="support">Support</option>
                    <option value="feature">Feature</option>
                    <option value="migration">Migration</option>
                  </select>

                  <select
                    className="form-select mt-0 me-3"
                    aria-label="Default select example"
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="All" selected>
                      Status
                    </option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="table-section-th">
                  <Table
                    columns={columns}
                    data={comments}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FontColor>
      <Note ownerId={ownerId} companyName={companyName} />
      <DetailsModal id={commentID} isLoading={isLoading} />
      <EditModal id={commentID} />
    </>
  );
};

export default AllComments;
