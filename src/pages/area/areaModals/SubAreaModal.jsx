import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../../components/table/Table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import { deleteSubArea, fetchMikrotik } from "../../../features/apiCalls";
import { toast } from "react-toastify";
import SubAreaEditModal from "./SubAreaEditModal";

const SubAreaModal = ({ areaId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //get all subareas
  const area = useSelector((state) => state.area.area);

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // get mikrotik
  const mikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // area subAreas state
  const [subAreas, setSubAreas] = useState([]);
  const [name, setName] = useState("");

  // check Mikrotik name state
  const [checkMikrotikName, setCheckMikrotikName] = useState("");

  // subArea update state
  const [subAreaName, setSubAreaName] = useState("");
  const [subAreaID, setSubAreaID] = useState("");

  // delete sub area
  const deleteSingleSubArea = (id) => {
    let isCustomer = false;
    customer.map((customer) => {
      if (customer.subArea === id) {
        isCustomer = true;
      }
    });
    if (isCustomer) {
      toast.warn(t("haveSubAreasCustomers"));
    } else {
      let confirm = window.confirm(t("doYouWantDeleteSubArea"));
      if (confirm) {
        setIsLoading(true);
        const IDs = {
          subAreaId: id,
          areaId,
        };
        deleteSubArea(dispatch, IDs, setIsLoading);
      }
    }
  };

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        width: "35%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "50%",
        Header: t("subArea"),
        accessor: "name",
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
                {checkMikrotikName?.name !== name ? (
                  <>
                    <li
                      data-bs-toggle="modal"
                      data-bs-target="#areaSubAreaEdit"
                      onClick={() => {
                        setSubAreaID(original.id);
                        setSubAreaName(original.name);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <PenFill />
                          <p className="actionP">{t("edit")}</p>
                        </div>
                      </div>
                    </li>

                    <li
                      onClick={() => {
                        deleteSingleSubArea(original.id, original.ispOwner);
                      }}
                    >
                      <div className="dropdown-item actionManager">
                        <div className="customerAction">
                          <ArchiveFill />
                          <p className="actionP">{t("delete")}</p>
                        </div>
                      </div>
                    </li>
                  </>
                ) : (
                  ""
                )}
              </ul>
            </>
          </div>
        ),
      },
    ],
    [t]
  );

  useEffect(() => {
    if (area.length === undefined) {
      navigate("/area");
    } else {
      const oneArea = area.find((val) => {
        return val.id === areaId;
      });
      if (oneArea) {
        setName(oneArea.name);
        setSubAreas(oneArea.subAreas);
      }
    }
    fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
  }, [areaId]);

  useEffect(() => {
    const match = mikrotiks.find((item) => item.name == name);
    setCheckMikrotikName(match);
  }, [name]);

  return (
    <>
      <div
        className="modal fade modal-dialog-scrollable "
        id="subareaModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="collectorWrapper mt-2 py-2">
                <Table
                  isLoading={isLoading}
                  columns={columns}
                  data={subAreas}
                ></Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubAreaEditModal subAreaName={subAreaName} subAreaID={subAreaID} />
    </>
  );
};

export default SubAreaModal;
