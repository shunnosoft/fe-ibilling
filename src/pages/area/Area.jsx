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
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import PoleBoxModal from "./areaModals/PoleBoxModal";
import PoleBoxAddModal2 from "./areaModals/PoleBoxAddModal2";
import TestModal from "./areaModals/testModal";

export default function Area() {
  const { t } = useTranslation();
  const area = useSelector((state) => state?.area?.area);
  const dispatch = useDispatch();
  const cus = useSelector((state) => state?.customer?.customer);
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const [isLoading, setIsLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [editAreaId, setEditAreaId] = useState("");

  const [areaID, setAreaID] = useState("");

  //modal open
  const [isOpen, setIsOpen] = useState(false);

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
        width: "25%",
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link to={`/subArea/${original.id}`} className="gotoSubAreaBtn">
              {t("subArea")}
              <ArrowRightShort style={{ fontSize: "19px" }} />
            </Link>
          </div>
        ),
      },
      {
        width: "25%",
        Header: t("poleBox"),
        accessor: "poleBox",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              title={t("poleBox")}
              style={{ padding: "0.10rem .5rem" }}
              className="btn btn-sm btn-primary mx-1"
              data-bs-toggle="modal"
              data-bs-target="#poleBoxModal"
              onClick={() => setAreaID(original.id)}
            >
              <AlignBottom />
            </button>

            <button
              title={t("addPoleBox")}
              style={{ padding: "0.10rem .5rem" }}
              className="btn btn-sm btn-primary mx-1"
              data-bs-toggle="modal"
              data-bs-target="#poleBoxAdd2"
              onClick={() => setAreaID(original.id)}
            >
              Add PoleBox
            </button>
          </div>
        ),
      },

      {
        width: "25%",
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
            <ActionButton
              getAreaSubarea={getAreaSubarea}
              getSpecificArea={getSpecificArea}
              deleteSingleArea={deleteSingleArea}
              data={original}
            />
          </div>
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
      <SubAreaModal areaId={areaID} />
      <PoleBoxModal areaId={areaID} />
      {/* <PoleBoxAddModal2 areaId={areaID} /> */}
      <TestModal areaId={areaID} />
    </>
  );
}
