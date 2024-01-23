import "./area.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GeoAlt, ArrowRightShort, ArrowClockwise } from "react-bootstrap-icons";
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

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const [isLoading, setIsLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [isLoadingPole, setIsLoadingPole] = useState(false);
  const [editAreaId, setEditAreaId] = useState("");

  const [areaID, setAreaID] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areaName, setAreaName] = useState("");

  //modal handler state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

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

  // area subarea count function
  const areaSubareaCount = (areaId) => {
    const filterItem = storeSubArea.filter((item) =>
      item.area.includes(areaId)
    );
    return filterItem?.length;
  };

  // subarea polBox count function
  const subareaPolBoxCount = (subId) => {
    const subPoleBox = storeSubArea.filter((sub) => sub.area === subId);
    let temp = [];
    subPoleBox?.map((val) =>
      poleBox.map((pole) => {
        if (pole.subArea === val.id) {
          temp.push(pole);
        }
      })
    );
    return temp?.length;
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
              width: "7rem",
              cursor: "pointer",
            }}
            onClick={() => {
              setAreaID(original.id);
              setModalStatus("subArea");
              setShow(true);
            }}
          >
            {t("subArea")}
            <b className="text-warning ms-1">
              {area && areaSubareaCount(original.id)}
            </b>
            <ArrowRightShort style={{ fontSize: "19px" }} />
          </div>
        ),
      },
      {
        width: bpSettings?.poleBox ? "25%" : "0%",
        Header: bpSettings?.poleBox && <div>{t("poleBox")}</div>,
        id: "option1",
        Cell: ({ row: { original } }) => {
          return (
            bpSettings?.poleBox && (
              <div
                className="gotoSubAreaBtn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setAreaId(original?.id);
                  setAreaName(original?.name);
                  setModalStatus("poleBox");
                  setShow(true);
                }}
              >
                {t("poleBox")}
                <b className="text-warning ms-1">
                  {area && subareaPolBoxCount(original.id)}
                </b>
                <ArrowRightShort style={{ fontSize: "19px" }} />
              </div>
            )
          );
        },
      },
      {
        width: "10%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <ActionButton
            getSpecificArea={getSpecificArea}
            deleteSingleArea={deleteSingleArea}
            data={original}
            setShow={setShow}
            setModalStatus={setModalStatus}
          />
        ),
      },
    ],
    [t, area]
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <h2>{t("area")} </h2>

                  <div className="d-flex align-items-center justify-content-center">
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                    <div
                      title={t("addArea")}
                      onClick={() => {
                        setModalStatus("addArea");
                        setShow(true);
                      }}
                    >
                      <GeoAlt className="addcutmButton" />
                    </div>
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
      {/* add area modal */}
      {modalStatus === "addArea" && (
        <ResellerPost show={show} setShow={setShow} />
      )}

      {/* area edit modal */}
      {modalStatus === "areaEdit" && (
        <AreaEdit show={show} setShow={setShow} areaId={editAreaId} />
      )}

      {/* <SubAreaModal areaId={areaID} /> */}
      {modalStatus === "subArea" && (
        <SubArea areaId={areaID} isOpen={show} setIsOpen={setShow} />
      )}

      {/* poleBox modal */}
      {modalStatus === "poleBox" && (
        <PoleBox
          areaName={areaName}
          areaId={areaId}
          poleShow={show}
          setPoleShow={setShow}
        />
      )}
    </>
  );
}
