import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHotspotPackage } from "../../../../features/hotspotApi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Loader from "../../../../components/common/Loader";
import { BagCheckFill } from "react-bootstrap-icons";
import moment from "moment";
import Table from "../../../../components/table/Table";

const Hotspot = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner id & mikrotik id form params
  const { ispOwner, mikrotikId } = useParams();

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspotPackage.package);

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);

  // hotspot package sync handler
  const syncHotspotPackage = () => {
    getHotspotPackage(dispatch, ispOwner, mikrotikId, setHotspotPackageLoading);
  };

  const columns1 = React.useMemo(
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
        Header: t("package"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("rate"),
        accessor: "rate",
      },
      {
        width: "25%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      //   {
      //     width: "20%",
      //     Header: () => <div className="text-center">{t("action")}</div>,
      //     id: "option",

      //     Cell: ({ row: { original } }) => (
      //       <div
      //         style={{
      //           display: "flex",
      //           alignItems: "center",
      //           justifyContent: "center",
      //         }}
      //       >
      //         <div className="dropdown">
      //           <ThreeDots
      //             className="dropdown-toggle ActionDots"
      //             id="areaDropdown"
      //             type="button"
      //             data-bs-toggle="dropdown"
      //             aria-expanded="false"
      //           />
      //           <ul
      //             className="dropdown-menu"
      //             aria-labelledby="pppoePackageDropdown"
      //           >
      //             <li
      //               data-bs-toggle="modal"
      //               data-bs-target="#pppoePackageEditModal"
      //               onClick={() => {
      //                 getSpecificPPPoEPackage(original.id);
      //               }}
      //             >
      //               <div className="dropdown-item">
      //                 <div className="customerAction">
      //                   <PenFill />
      //                   <p className="actionP">{t("edit")}</p>
      //                 </div>
      //               </div>
      //             </li>

      //             <li
      //               onClick={() => {
      //                 deleteSinglePPPoEpackage(original.mikrotik, original.id);
      //               }}
      //             >
      //               <div className="dropdown-item actionManager">
      //                 <div className="customerAction">
      //                   <ArchiveFill />
      //                   <p className="actionP">{t("delete")}</p>
      //                 </div>
      //               </div>
      //             </li>
      //           </ul>
      //         </div>
      //       </div>
      //     ),
      //   },
    ],
    [t]
  );

  return (
    <div className="collectorWrapper mt-2 py-2">
      <div className="addCollector">
        <div className="addNewCollector showMikrotikUpperSection mx-auto">
          <div className="LeftSideMikrotik justify-content-center">
            <div className="addAndSettingIcon">
              {hotspotPackageLoading ? (
                <span>
                  <Loader />
                </span>
              ) : (
                <button
                  onClick={syncHotspotPackage}
                  title={t("hotspotpackageSync")}
                  className="btn btn-outline-primary me-2 "
                >
                  {t("hotspotpackageSync")} <BagCheckFill />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* <div className="d-flex mt-3">
                        <div className="mikrotikDetails me-5">
                          <p>
                            {t("name")} : <b>{singleMik?.name || "..."}</b>
                          </p>
                          <p>
                            {t("ip")} : <b>{singleMik?.host || "..."}</b>
                          </p>
                          <p>
                            {t("userName")} :{" "}
                            <b>{singleMik?.username || "..."}</b>
                          </p>
                          <p>
                            {t("port")} : <b>{singleMik?.port || "..."}</b>
                          </p>
                        </div>
                        <div className="rightSideMikrotik ms-5">
                          <h4> {t("select")} </h4>
                          <select
                            id="selectMikrotikOption"
                            className="form-select mt-0"
                            onChange={(event) =>
                              setWhatYouWantToShow(event.target.value)
                            }
                          >
                            <option value="showMikrotikPackage">
                              {t("PPPoEPackage")}
                            </option>
                            <option value="showAllMikrotikUser">
                              {t("sokolCustomer")}
                            </option>
                          </select>
                        </div>

                        {whatYouWantToShow === "showAllMikrotikUser" && (
                          <div className="rightSideMikrotik ms-5">
                            <h4> {t("status")} </h4>
                            <select
                              id="selectMikrotikOption"
                              onChange={filterIt}
                              className="form-select mt-0"
                            >
                              <option value={"allCustomer"}>
                                {t("sokolCustomer")}
                              </option>
                              <option value={"false"}>{t("active")}</option>
                              <option value={"true"}>{t("in active")}</option>
                            </select>
                          </div>
                        )}
                      </div> */}
        <Table
          isLoading={hotspotPackageLoading}
          columns={columns1}
          data={hotsPackage}
        ></Table>
      </div>
    </div>
  );
};

export default Hotspot;
