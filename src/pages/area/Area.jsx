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
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import SubArea from "../../pages/subArea/SubArea";
import PoleBox from "../subArea/PoleBox";
import useSelectorState from "../../hooks/useSelectorState";
import useISPowner from "../../hooks/useISPOwner";

const Area = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const { areas, subAreas, polesBox, mikrotiks } = useSelectorState();

  const cus = useSelector((state) => state?.customer?.customer);

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

  const reloadHandler = () => {
    getArea(dispatch, ispOwnerId, setIsLoading);
  };

  //================// API CALL's //================//
  useEffect(() => {
    //---> @Get ispOwner areas data
    !areas?.length && getArea(dispatch, ispOwnerId, setIsLoading);

    //---> @Get ispOwner mikrotiks data
    !mikrotiks?.length &&
      fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);

    //---> @Get ispOwner areas sub-area data
    !subAreas?.length && getSubAreasApi(dispatch, ispOwnerId);

    //---> @Get ispOwner sub-areas pol-box data
    !polesBox?.length && getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);

    if (cus.length === 0) getCustomer(dispatch, ispOwnerId, setCustomerLoading);
  }, []);

  const deleteSingleArea = async (id, ispOwner) => {
    let singleArea = areas.find((a) => a.id === id);
    let isCustomer = false;
    const singleAreaSubs = singleArea?.subAreas;
    singleAreaSubs?.map((sub) => {
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
    const filterItem = subAreas.filter((item) => item.area.includes(areaId));
    return filterItem?.length;
  };

  // subarea polBox count function
  const subareaPolBoxCount = (subId) => {
    const subPoleBox = subAreas.filter((sub) => sub.area === subId);
    let temp = [];
    subPoleBox?.map((val) =>
      polesBox.map((pole) => {
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
              {areas && areaSubareaCount(original.id)}
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
                  {areas && subareaPolBoxCount(original.id)}
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
    [t, areas]
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
                    data={areas}
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
};

export default Area;
