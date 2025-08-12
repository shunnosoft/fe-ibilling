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
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import SupportNumberPost from "./customerSupport/SupportNumberPost";
import {
  deleteIspOwnerSupporterNumber,
  getIspOwnerSupportNumbers,
} from "../../features/apiCalls";
import SupportNumberEdit from "./customerSupport/SupportNumberEdit";

const SupportNumbers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // iBilling support data
  const ispOwnerSupportNumbers = useSelector(
    (state) => state.netFeeSupport?.ispOwnerSupport
  );

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);

  // support number edit id state
  const [supportId, setSupportId] = useState("");

  // support number update handler
  const numberEditHandler = (id) => {
    setSupportId(id);
    setEditShow(true);
  };

  // support number delete handler
  const supportDeleteHandler = (supportId) => {
    let confirm = window.confirm(t("antToDeleteSupport"));
    if (confirm) {
      deleteIspOwnerSupporterNumber(dispatch, ispOwner, supportId);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        width: "16%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: t("name"),
        width: "16%",
        accessor: "name",
      },
      {
        Header: t("mobile"),
        width: "20%",
        accessor: "mobile",
      },
      {
        width: "16%",
        Header: t("startTime"),
        accessor: "start",
      },
      {
        width: "16%",
        Header: t("endTime"),
        accessor: "end",
      },

      {
        width: "16%",
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
                  onClick={() => numberEditHandler(original.id)}
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
                  onClick={() => supportDeleteHandler(original.id)}
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
    if (ispOwnerSupportNumbers.length === 0)
      getIspOwnerSupportNumbers(dispatch, ispOwner, setIsLoading);
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
                  <div>{t("supportNumbers")}</div>
                  <div className="d-flex align-items-center justify-content-center">
                    <PersonPlusFill
                      className="addcutmButton"
                      title={t("addSupportTicket")}
                      onClick={() => setShow(true)}
                    />
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={ispOwnerSupportNumbers}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      <SupportNumberPost show={show} setShow={setShow} />
      <SupportNumberEdit
        supportId={supportId}
        editShow={editShow}
        setEditShow={setEditShow}
      />
    </>
  );
};

export default SupportNumbers;
