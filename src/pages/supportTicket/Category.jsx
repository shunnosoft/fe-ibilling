import React from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useMemo } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PenFill, PlusCircle, ThreeDots } from "react-bootstrap-icons";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal import
import Table from "../../components/table/Table";
import CategoryPost from "./modal/CategoryPost";
import { getTicketCategoryApi } from "../../features/supportTicketApi";
import CategoryEdit from "./modal/CategoryEdit";

const Category = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId } = useISPowner();

  //get ticket Cartagory
  const ticketCategory = useSelector(
    (state) => state.supportTicket?.ticketCategory
  );

  //get manager permission
  const managerPermission = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.manager?.permissions
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal state
  const [category, setCategory] = useState("");

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  //api call
  useEffect(() => {
    getTicketCategoryApi(dispatch, ispOwnerId, setIsLoading, setShow);
  }, []);

  //table column
  const columns2 = useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "6%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                {(role === "ispOwner" ||
                  managerPermission?.supportTicketCategory) && (
                  <li
                    onClick={() => {
                      setCategory(original);
                      setModalStatus("categoryEdit");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {(role === "ispOwner" || managerPermission?.supportTicketCategory) && (
        <div
          title={t("addCategory")}
          className="header_icon bg-success text-white"
          onClick={() => {
            setModalStatus("createCategory");
            setShow(true);
          }}
        >
          <PlusCircle />
        </div>
      )}
    </div>
  );

  return (
    <>
      <Table
        columns={columns2}
        customComponent={customComponent}
        data={ticketCategory}
      ></Table>

      {/* Modal Section */}

      {/* create category modal */}
      {modalStatus === "createCategory" && (
        <CategoryPost show={show} setShow={setShow} ispOwner={ispOwnerId} />
      )}

      <CategoryEdit category={category} />
      {/* Modal Section */}
    </>
  );
};

export default Category;
