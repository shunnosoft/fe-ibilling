import "./area.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  GeoAlt,
  ArrowRightShort,
  PlusLg,
  ArrowClockwise,
  AlignBottom,
  PlugFill,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ResellerPost from "./areaModals/AreaPost";
import AreaEdit from "./areaModals/AreaEdit";
import {
  deleteArea,
  fetchMikrotik,
  getArea,
  getCustomer,
} from "../../features/apiCalls";
import ActionButton from "./ActionButton";
import Table from "../../components/table/Table";

import { useTranslation } from "react-i18next";
import SubAreaModal from "./areaModals/SubAreaModal";
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import SubArea from "../../pages/subArea/SubArea";
import PoleBox from "../subArea/PoleBox";
//subArea/SubArea
export default function Area() {
  const { t } = useTranslation();
  const area = useSelector((state) => state?.area?.area);
  const dispatch = useDispatch();
  const cus = useSelector((state) => state?.customer?.customer);
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const [isLoading, setIsLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [isLoadingPole, setIsLoadingPole] = useState(false);
  const [editAreaId, setEditAreaId] = useState("");

  const [areaID, setAreaID] = useState("");
  const [areaId, setAreaId] = useState("");
  console.log(areaId);

  //modal handler state
  const [isOpen, setIsOpen] = useState(false);
  const [poleShow, setPoleShow] = useState(false);

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const reloadHandler = () => {
    getArea(dispatch, ispOwnerId, setIsLoading);
  };
  useEffect(() => {
    if (area.length === 0) getArea(dispatch, ispOwnerId, setIsLoading);
    if (storeSubArea.length === 0) getSubAreasApi(dispatch, ispOwnerId);
    if (cus.length === 0) getCustomer(dispatch, ispOwnerId, setCustomerLoading);
    getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);
    fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);
  }, [dispatch, ispOwnerId]);

  const deleteSingleArea = async (id, ispOwner) => {
    let singleArea = area.find((a) => a.id === id);
    let isCustomer = false;
    const subAreas = singleArea?.subAreas;
    subAreas?.map((sub) => {
      cus.map((cus) => {
        if (cus.subArea === sub.id) {
          isCustomer = true;
        }
      });
    });
    if (isCustomer) {
      toast.warn(t("doNotDeleteAreaAlert"));
    } else {
      let con = window.confirm(t("wantToDeleteArea"));
      if (con) {
        setIsLoading(true);
        const IDs = {
          ispOwner: ispOwner,
          id: id,
        };
        deleteArea(dispatch, IDs, setIsLoading);
      }
    }
  };

  const getSpecificArea = (id) => {
    setEditAreaId(id);
  };

  const getAreaSubarea = (areaId) => {
    setAreaID(areaId);
    setIsOpen(true);
  };

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("area"),
        accessor: "name",
      },
      {
        width: "25%",
        Header: t("subArea"),
        accessor: "subArea",
        Cell: ({ row: { original } }) => (
          <div
            className="gotoSubAreaBtn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "6rem",
            }}
            onClick={() => getAreaSubarea(original.id)}
          >
            {t("subArea")}
          </div>
        ),
      },
      {
        width: "25%",
        Header: t("poleBox"),
        Cell: ({ row: { original } }) => (
          <div
            className="gotoSubAreaBtn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "6rem",
            }}
            onClick={() => {
              setAreaId(original?.id);
              setPoleShow(true);
            }}
          >
            {t("poleBox")}
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <ActionButton
            getSpecificArea={getSpecificArea}
            deleteSingleArea={deleteSingleArea}
            data={original}
          />
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      {/* toast */}
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("area")} </h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                  <div
                    title={t("addArea")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#areaModal"
                  >
                    <GeoAlt />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={area}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      {/* modals */}
      <ResellerPost />
      {/* area edit modal */}
      <AreaEdit areaId={editAreaId} />

      {/* subAreas modal */}
      {/* <SubAreaModal areaId={areaID} /> */}
      <SubArea areaId={areaID} isOpen={isOpen} setIsOpen={setIsOpen} />
      <PoleBox areaId={areaId} poleShow={poleShow} setPoleShow={setPoleShow} />
    </>
  );
}
