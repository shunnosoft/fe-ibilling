import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";

const SubAreaModal = ({ areaId }) => {
  const { t } = useTranslation();

  //get subArea
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [subArea, setSubArea] = useState([]);

  useEffect(() => {
    let sub = [];
    storeSubArea.map((val) => {
      if (val.area === areaId) {
        sub.push(val);
      }
    });
    setSubArea(sub);
  }, [areaId]);

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
        Header: t("name"),
        accessor: "name",
      },
    ],
    [t]
  );

  return (
    <div
      className="modal fade"
      id="subareaModal"
      tabIndex="-1"
      aria-labelledby="subareaModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("subArea")}
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-section">
              <Table
                isLoading={isLoading}
                columns={column}
                data={subArea}
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAreaModal;
