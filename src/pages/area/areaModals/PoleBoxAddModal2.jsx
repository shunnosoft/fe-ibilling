import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getPoleBoxApi } from "../../../features/actions/customerApiCall";
import { ArrowRightShort, PlusCircle } from "react-bootstrap-icons";
import Table from "../../../components/table/Table";
import { Link } from "react-router-dom";

const PoleBoxAddModal2 = ({ areaId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get subArea
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [subAreaId, setSubAreaId] = useState();
  const [isLoadingPole, setIsLoadingPole] = useState(false);
  const [mainData, setMainData] = useState([]);

  useEffect(() => {
    getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);
  }, [areaId]);

  useEffect(() => {
    let subAreas = [];
    storeSubArea?.map((sub) => {
      if (sub?.area === areaId) {
        subAreas.push(sub);
      }
    });

    setMainData(subAreas);
  }, [areaId, storeSubArea]);

  const column = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("subArea"),
        accessor: "name",
      },
      {
        width: "25%",
        Header: <div className="text-center">{t("poleBox")}</div>,
        id: "option1",

        Cell: ({ row: { original } }) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link to={`/poleBox/${original.id}`} className="gotoSubAreaBtn">
                {t("poleBox")}
                <ArrowRightShort style={{ fontSize: "19px" }} />
              </Link>
            </div>
          );
        },
      },
    ],
    [t]
  );

  return (
    <div
      className="modal fade"
      id="PoleBoxAddModal2"
      tabIndex="-1"
      aria-labelledby="poleBoxModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("poleBox")}
            </h5>

            <div className="d-flex gap-5">
              <div
                title={t("addPoleBox")}
                className="header_icon bg-success text-white"
                data-dismiss="modal"
                data-bs-toggle="modal"
                data-bs-target="#mmmmmmm"
              >
                <PlusCircle />
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          </div>
          <div className="modal-body">
            <div className="table-section">
              <Table
                isLoading={isLoading}
                columns={column}
                data={mainData}
              ></Table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Pole Box */}
      {/* <PoleBoxEdit poleId={poleId} subAreaId={subAreaId} /> */}
    </div>
  );
};

export default PoleBoxAddModal2;
