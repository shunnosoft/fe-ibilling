import React, { useEffect, useMemo, useState } from "react";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { getNetFeeCronUserLog } from "../../../features/apiCallAdmin";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../../components/common/Utils";
import moment from "moment";
import { ArrowClockwise, FilterCircle } from "react-bootstrap-icons";
import Loader from "../../../components/common/Loader";
import { FontColor, FourGround } from "../../../assets/js/theme";
import { Accordion } from "react-bootstrap";
import Table from "../../../components/table/Table";

const UserCronLog = ({ show, setShow, cron }) => {
  const dispatch = useDispatch();

  //---> Get netFee cron log from redux store
  const userCronLog = useSelector(
    (state) => state.adminNetFeeSupport?.userCronLog
  );

  //===============|| Local State ||===============//
  const [isLoading, setIsLoading] = useState(false);
  const [activeKeys, setActiveKeys] = useState("");

  useEffect(() => {
    getNetFeeCronUserLog(dispatch, cron?._id, setIsLoading);
  }, [cron]);

  const reloadHandler = () => {
    getNetFeeCronUserLog(dispatch, cron?._id, setIsLoading);
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "Description",
        width: "55%",
        accessor: "description",
      },
      {
        width: "10%",
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "15%",
        Header: "Start Date",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "15%",
        Header: "End Date",
        accessor: "updatedAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    []
  );

  return (
    <ComponentCustomModal {...{ show, setShow, size: "xl", centered: true }}>
      <div className="container-fluied collector">
        <div className="container">
          <FontColor>
            <FourGround>
              <div className="collectorTitle d-flex justify-content-between px-4">
                <div className="component_name">User Cron Log</div>

                <div className="d-flex align-items-center">
                  {/* <div
                    onClick={() => {
                      if (!activeKeys) {
                        setActiveKeys("filter");
                      } else {
                        setActiveKeys("");
                      }
                    }}
                    title="Filter"
                  >
                    <FilterCircle className="addcutmButton" />
                  </div> */}

                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        className="arrowClock"
                        title="Refresh"
                        onClick={reloadHandler}
                      />
                    )}
                  </div>
                </div>
              </div>
            </FourGround>

            <FourGround>
              <div className="mt-2">
                {/* <Accordion alwaysOpen activeKey={activeKeys}>
                  <Accordion.Item eventKey="filter">
                    <Accordion.Body>
                      <div className="displayGrid6">
                        <div className="displayGrid1">
                          <button
                            className="btn btn-outline-primary"
                            type="button"
                            //   onClick={handleActiveFilter}
                          >
                            Filter
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            //   onClick={handleFilterReset}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion> */}

                <div className="collectorWrapper pb-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={userCronLog}
                  />
                </div>
              </div>
            </FourGround>
          </FontColor>
        </div>
      </div>
    </ComponentCustomModal>
  );
};

export default UserCronLog;
