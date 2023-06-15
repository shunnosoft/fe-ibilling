import "./subArea.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  PlusCircle,
} from "react-bootstrap-icons";

// internal imports
import { toast } from "react-toastify";
import SubAreaPost from "./subAreaModals/SubAreaPost";
import { deleteSubArea, getArea, fetchMikrotik } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import SubAreaEdit from "./subAreaModals/SubAreaEdit";

export default function SubArea({ isOpen, setIsOpen, areaId }) {
  const { t } = useTranslation();
  const area = useSelector((state) => state.area.area);
  const storeSubArea = useSelector((state) => state.area?.subArea);
  const [subAreas, setSubAreas] = useState([]);
  const [subAreaName, setSubAreaName] = useState("");
  const [ispId, setIspId] = useState("");
  const [subAreaID, setSubAreaID] = useState("");
  const [name, setName] = useState("");
  const [checkMikrotikName, setCheckMikrotikName] = useState();
  const [id, setId] = useState("");
  const cus = useSelector((state) => state?.customer?.customer);

  //Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  //modal handler state
  const [postShow, setPostShow] = useState(false);
  const [editShow, setEditShow] = useState(false);

  const dispatch = useDispatch();

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get mikrotik
  const mikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  useEffect(() => {
    getArea(dispatch, ispOwnerId, setIsLoading);
    getSubAreasApi(dispatch, ispOwnerId, setIsLoader);
  }, [areaId]);

  useEffect(() => {
    const oneArea = area.find((val) => {
      return val.id === areaId;
    });
    if (oneArea) {
      setName(oneArea.name);
      setId(oneArea.id);
      const sub = storeSubArea.filter((val) => val.area === areaId);
      setSubAreas(sub);
    }

    fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
  }, [area, storeSubArea]);

  useEffect(() => {
    const match = mikrotiks.find((item) => item.name == name);
    setCheckMikrotikName(match);
  }, [name]);

  //modal show handler
  const handleClose = () => {
    setIsOpen(false);
  };

  // delete sub area
  const deleteSingleSubAarea = (id) => {
    let isCustomer = false;
    cus.map((customer) => {
      if (customer.subArea === id) {
        isCustomer = true;
      }
    });
    if (isCustomer) {
      toast.warn(t("haveSubAreasCustomers"));
    } else {
      let con = window.confirm(t("doYouWantDeleteSubArea"));
      if (con) {
        const IDs = {
          ispOwnerId: ispOwnerId,
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
        width: "25%",
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
        width: "25%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <div>
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
                      data-bs-target="#subAreaEditModal"
                      onClick={() => {
                        setSubAreaID(original.id);
                        setSubAreaName(original.name);
                        setIspId(original.ispOwner);
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

                    <li
                      onClick={() => {
                        deleteSingleSubAarea(original.id, original.ispOwner);
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

  return (
    <>
      <Modal
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton></ModalHeader>
        <ModalBody>
          <div className="container-fluied collector">
            <div className="container">
              {/* Edit MOdal */}
              <div className="collectorTitle d-flex justify-content-between align-items-center px-5">
                <div>
                  {name || ""} {t("ofSubArea")}
                </div>
                <div
                  title={t("addSubArea")}
                  className="header_icon"
                  onClick={() => setPostShow(true)}
                >
                  <PlusCircle />
                </div>
              </div>

              <div className="collectorWrapper mt-2 py-2">
                <Table
                  isLoading={isLoader}
                  columns={columns}
                  data={subAreas}
                ></Table>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <SubAreaPost
        name={name || ""}
        id={id || ""}
        postShow={postShow}
        setPostShow={setPostShow}
      />
      <SubAreaEdit
        subAreaID={subAreaID}
        subAreaName={subAreaName}
        ispId={ispId}
        editShow={editShow}
        setEditShow={setEditShow}
      />
    </>
  );
}
