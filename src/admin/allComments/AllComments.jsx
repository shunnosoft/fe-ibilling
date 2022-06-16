import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../../features/apiCallAdmin";
import moment from "moment";
import Table from "../../components/table/Table";
import { PenFill, PersonFill, ThreeDots } from "react-bootstrap-icons";

const AllComments = () => {
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // import dispatch
  const dispatch = useDispatch();

  // get note api call
  useEffect(() => {
    getComments(dispatch, setIsLoading);
  }, []);

  // get all note in redux
  const comments = useSelector((state) => state.admin?.comments);
  console.log(comments);

  // table column
  const columns = React.useMemo(
    () => [
      {
        Header: "Serial",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "company",
        Header: "Comapny",
      },
      {
        accessor: "comment",
        Header: "Comment",
      },

      {
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YY hh:mm A");
        },
      },

      {
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
                  data-bs-target="#showCustomerDetails"
                  // onClick={() => {
                  //   detailsModal(original.id);
                  // }}
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
                  data-bs-target="#clientEditModal"
                  // onClick={() => {
                  //   editModal(original.id);
                  // }}
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
                <h2 className="dashboardTitle text-center">All Comments</h2>
              </div>
              <div className="card-body">
                <Table columns={columns} data={comments} />
              </div>
            </div>
          </div>
        </div>
      </FontColor>
    </>
  );
};

export default AllComments;
