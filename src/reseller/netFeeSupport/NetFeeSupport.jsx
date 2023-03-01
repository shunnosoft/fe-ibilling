import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getResellerNetFeeSupport } from "../../features/apiCallReseller";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  PenFill,
  PersonFill,
  PersonPlusFill,
  ThreeDots,
} from "react-bootstrap-icons";
import ResellerSupportAdd from "./supportOpration/ResellerSupportAdd";
import moment from "moment";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import ResellerSupportEdit from "./supportOpration/ResellerSupportEdit";
import ResellerSupportDetails from "./supportOpration/ResellerSupportDetails";

const NetFeeSupport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // reseller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.reseller.id
  );

  // get reseller support
  const resellerAllSupport = useSelector(
    (state) => state.resellerSupport?.resellerSupport
  );

  // isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // support edit id state
  const [editID, setEditID] = useState("");

  // support details data state
  const [supportID, setSupportI] = useState("");

  // support edit handler
  const supportEditHandler = (id) => {
    setEditID(id);
  };

  // description details handler
  const supportDetailsHandler = (id) => {
    setSupportI(id);
  };
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
        width: "14%",
        Header: t("supportType"),
        accessor: "support",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "47%",
        Header: t("description"),
        accessor: "description",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original.description && original.description.slice(0, 80)}
              <span
                className="text-primary see-more"
                data-bs-toggle="modal"
                data-bs-target="#resellerSupportDetails"
                onClick={() => {
                  supportDetailsHandler(original.id);
                }}
              >
                {original.description.length > 80 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },
      {
        width: "17%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "8%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center justify-content-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#resellerSupportDetails"
                  onClick={() => {
                    supportDetailsHandler(original.id);
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
                  data-bs-target="#resellerSupportEditId"
                  onClick={() => {
                    supportEditHandler(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  useEffect(() => {
    getResellerNetFeeSupport(dispatch, setIsLoading, resellerId);
  }, []);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied reseller">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>{t("netFeeSupport")}</div>
                  <div className="addAndSettingIcon">
                    <PersonPlusFill
                      className="addcutmButton"
                      data-bs-toggle="modal"
                      data-bs-target="#resellerSupportAdd"
                      title={t("addSupportTicket")}
                    />
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={resellerAllSupport}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <ResellerSupportAdd />
      <ResellerSupportEdit editID={editID} />
      <ResellerSupportDetails supportID={supportID} />
    </>
  );
};

export default NetFeeSupport;
