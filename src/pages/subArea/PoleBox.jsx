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

// internal imports
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import PoleBoxPost from "./poleBoxModals/PoleBoxPost";
import PoleBoxEdit from "./poleBoxModals/PoleBoxEdit";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";

export default function PoleBox({ areaName, areaId, poleShow, setPoleShow }) {
  const { t } = useTranslation();

  //get all sub Area
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  //Modal handler state
  const [postShow, setPostShow] = useState(false);
  const [editShow, setEditShow] = useState(false);

  const [pole, setPole] = useState([]);
  const [poleId, setPoleId] = useState("");

  //filtering all poleBox under selected subarea
  useEffect(() => {
    const subPoleBox = storeSubArea.filter((sub) => sub.area === areaId);
    let temp = [];
    subPoleBox?.map((val) =>
      poleBox.map((pole) => {
        if (pole.subArea === val.id) {
          temp.push({ ...pole, subAreaName: val.name });
        }
      })
    );
    setPole(temp);
  }, [areaId, storeSubArea, poleBox]);

  //modal show handler
  const handleClose = () => {
    setPoleShow(false);
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
        width: "20%",
        Header: t("subAreaName"),
        accessor: "subAreaName",
      },
      {
        width: "20%",
        Header: t("poleBox"),
        accessor: "name",
      },
      {
        width: "30%",
        Header: t("description"),
        accessor: "description",
      },
      {
        width: "15%",
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
                    onClick={() => {
                      setPoleId(original.id);
                      setEditShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>
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
      <Modal
        show={poleShow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton></ModalHeader>
        <ModalBody>
          <div className="container-fluied collector">
            <div className="container">
              <div className="collectorTitle d-flex justify-content-between align-items-center px-4">
                <div>{t("poleBox")}</div>
                <div
                  title={t("addPoleBox")}
                  className="header_icon"
                  onClick={() => setPostShow(true)}
                >
                  <PlusCircle />
                </div>
              </div>

              <div className="collectorWrapper mt-2 py-2">
                <Table
                  // isLoading={isLoadingPole}
                  columns={columns}
                  data={pole}
                ></Table>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <PoleBoxPost
        areaName={areaName}
        areaId={areaId}
        postShow={postShow}
        setPostShow={setPostShow}
      />
      <PoleBoxEdit
        poleId={poleId}
        editShow={editShow}
        setEditShow={setEditShow}
      />
    </>
  );
}
