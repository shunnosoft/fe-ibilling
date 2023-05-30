import "./subArea.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ThreeDots,
  PenFill,
  ArrowLeftShort,
  PlusCircle,
} from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import { getArea } from "../../features/apiCalls";

import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import PoleBoxPost from "./poleBoxModals/PoleBoxPost";
import PoleBoxEdit from "./poleBoxModals/PoleBoxEdit";

export default function PoleBox() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subAreaId } = useParams();

  //get all sub Area
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);
  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const [pole, setPole] = useState([]);
  const [poleId, setPoleId] = useState("");
  const [areadId, setAreaId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPole, setIsLoadingPole] = useState(false);

  //api calls area subarea and poleBox
  useEffect(() => {
    getArea(dispatch, ispOwnerId, setIsLoading);
    getSubAreasApi(dispatch, ispOwnerId);
    getPoleBoxApi(dispatch, ispOwnerId, subAreaId, setIsLoadingPole);
  }, [subAreaId]);

  //filtering all poleBox under selected subarea
  useEffect(() => {
    const oneSubArea = storeSubArea?.find((val) => {
      return val.id === subAreaId;
    });
    if (oneSubArea) {
      setAreaId(oneSubArea.area);
      const temp = poleBox?.filter((val) => val.subArea === subAreaId);
      setPole(temp);
    }
  }, [storeSubArea, poleBox]);

  // go back to area
  const gotoAllArea = () => {
    navigate(`/subArea/${areadId}`);
  };

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        width: "20%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "35%",
        Header: t("description"),
        accessor: "description",
      },
      {
        width: "20%",
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
            <>
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                <>
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#poleBoxEditModal"
                    onClick={() => {
                      setPoleId(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>

                  {/* <li
                      onClick={() => {
                        deleteSingleSubAarea(original.id, original.ispOwner);
                      }}
                    >
                      <div className="dropdown-item actionManager">
                        <div className="customerAction">
                          <ArchiveFill />
                          <p className="actionP">{t("delete")}</p>
                        </div>
                      </div>
                    </li> */}
                </>
              </ul>
            </>
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between align-items-center px-5">
                  <div className="allSubArea mt-0" onClick={gotoAllArea}>
                    <ArrowLeftShort className="arrowLeftSize" />
                    <span style={{ marginLeft: "3px" }}>{t("subArea")}</span>
                  </div>
                  <div>{t("poleBox")}</div>
                  <div
                    title={t("addPoleBox")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#poleBoxPostModal"
                  >
                    <PlusCircle />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoadingPole}
                    columns={columns}
                    data={pole}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* modals section */}

      {/* Add New Pole Box */}
      <PoleBoxPost subAreaId={subAreaId} />

      {/* Edit Pole Box */}
      <PoleBoxEdit poleId={poleId} subAreaId={subAreaId} />
    </>
  );
}
