import React from "react";
import Table from "../../components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useMemo } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PenFill, PlusCircle, ThreeDots } from "react-bootstrap-icons";
import CategoryPost from "./modal/CategoryPost";
import { getTicketCategoryApi } from "../../features/supportTicketApi";
import CategoryEdit from "./modal/CategoryEdit";

const Category = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get ticket Cartagory
  const ticketCategory = useSelector(
    (state) => state.supportTicket?.ticketCategory
  );

  //get ispOwner Id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //get manager permission
  const managerPermission = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.manager?.permissions
  );

  // get role
  const role = useSelector((state) => state.persistedReducer?.auth?.role);

  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  //api call
  useEffect(() => {
    getTicketCategoryApi(dispatch, ispOwner, setIsLoading);
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                    data-bs-toggle="modal"
                    data-bs-target="#editCategoryModal"
                    onClick={() => setCategory(original)}
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
          data-bs-toggle="modal"
          data-bs-target="#addCategoryModal"
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
      <CategoryPost ispOwner={ispOwner} />
      <CategoryEdit category={category} />
      {/* Modal Section */}
    </>
  );
};

export default Category;
