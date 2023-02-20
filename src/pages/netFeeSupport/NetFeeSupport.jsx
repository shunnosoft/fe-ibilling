import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  ArchiveFill,
  PenFill,
  PersonPlusFill,
  ThreeDots,
} from "react-bootstrap-icons";
import AddNetFeeSupport from "./supportOpration/AddNetFeeSupport";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import SupportEdit from "./supportOpration/SupportEdit";
import { getNetFeeSupportData } from "../../features/apiCalls";
import moment from "moment";
import SupportDelete from "./supportOpration/SupportDelete";
import { badge } from "../../components/common/Utils";

const NetFeeSupport = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // netFee support data
  const supportAllData = useSelector(
    (state) => state.netFeeSupport?.netFeeSupport
  );

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //netFee support isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // support edit data state
  const [editId, setEditId] = useState("");

  // support delete id
  const [deleteId, setDeleteId] = useState("");

  //support edit handler
  const supportEditHandler = (id) => {
    setEditId(id);
  };

  // support delete handler
  const supportDeleteHandlerModal = (id) => {
    setDeleteId(id);
  };

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
        Header: t("supportType"),
        accessor: "support",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "49%",
        Header: t("description"),
        accessor: "description",
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "15%",
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
                  data-bs-target="#supportEdit"
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

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#supportDelete"
                  onClick={() => supportDeleteHandlerModal(original.id)}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
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
    getNetFeeSupportData(dispatch, ispOwner, setIsLoading);
  }, []);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>{t("netFeeSupport")}</div>
                  <div className="addAndSettingIcon">
                    <PersonPlusFill
                      className="addcutmButton"
                      data-bs-toggle="modal"
                      data-bs-target="#addNetFeeSupport"
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
                      // customComponent={customComponent}
                      columns={columns}
                      data={supportAllData}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <AddNetFeeSupport />
      <SupportEdit editId={editId} />
      <SupportDelete deleteId={deleteId} />
    </>
  );
};

export default NetFeeSupport;
