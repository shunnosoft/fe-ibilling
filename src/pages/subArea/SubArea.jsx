import "./subArea.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  ArrowLeftShort,
  PlusCircle,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import SubAreaPost from "./subAreaModals/SubAreaPost";
import { FtextField } from "../../components/common/FtextField";
import { deleteSubArea, getArea, editSubArea } from "../../features/apiCalls";

import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";

export default function SubArea() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { areaId } = useParams();
  const area = useSelector((state) => state.persistedReducer.area.area);
  const [subAreas, setSubAreas] = useState([]);
  const [subAreaName, setSubAreaName] = useState("");
  const [ispId, setIspId] = useState("");
  const [subAreaID, setSubAreaID] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cus = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );

  const linemanValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
  });

  const dispatch = useDispatch();

  // const user = useSelector(state => state.auth.currentUser);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  useEffect(() => {
    getArea(dispatch, ispOwnerId);
  }, [dispatch, ispOwnerId]);

  // go back to area
  const gotoAllArea = () => {
    navigate("/area");
  };

  // Edit subarea
  const subAreaEditHandler = async (data) => {
    setIsLoading(true);
    const IDs = {
      ispOwnerID: ispId,
      ispOwner: ispId,
      id: subAreaID,
      name: data.name,
    };
    editSubArea(dispatch, IDs, setIsLoading);
  };

  useEffect(() => {
    if (area.length === undefined) {
      navigate("/area");
    } else {
      const oneArea = area.find((val) => {
        return val.id === areaId;
      });
      if (oneArea) {
        setName(oneArea.name);
        setId(oneArea.id);
        setSubAreas(oneArea.subAreas);
      }
    }
  }, [area, areaId, navigate]);

  // delete sub area
  const deleteSingleSubAarea = (id, ispOwner) => {
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
        setIsLoading(true);
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
        width: "30%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "40%",
        Header: t("subArea"),
        accessor: "name",
      },
      {
        width: "30%",
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
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="areaDropdown">
              <li
                data-bs-toggle="modal"
                data-bs-target="#subAreaEditModal"
                onClick={() => {
                  setSubAreaID(original.id);
                  setSubAreaName(original.name);
                  setIspId(original.ispOwner);
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
            </ul>
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}

              <SubAreaPost name={name || ""} id={id || ""} />
              {/* Edit MOdal */}
              <div
                className="modal fade modal-dialog-scrollable "
                id="subAreaEditModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        {t("editSubArea")}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <Formik
                        initialValues={{
                          name: subAreaName || "",
                        }}
                        validationSchema={linemanValidator}
                        onSubmit={(values) => {
                          subAreaEditHandler(values);
                        }}
                        enableReinitialize
                      >
                        {() => (
                          <Form>
                            <FtextField
                              type="text"
                              label={t("subAreaName")}
                              name="name"
                            />

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                {t("cancel")}
                              </button>
                              <button
                                type="submit"
                                className="btn btn-success customBtn"
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader /> : t("save")}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
              {/* Edit MOdal */}
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between align-items-center px-5">
                  <div className="allSubArea mt-0" onClick={gotoAllArea}>
                    <ArrowLeftShort className="arrowLeftSize" />
                    <span style={{ marginLeft: "3px" }}>{t("area")}</span>
                  </div>
                  <div>
                    {name || ""} {t("ofSubArea")}
                  </div>
                  <div
                    title={t("addSubArea")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#subAreaModal"
                  >
                    <PlusCircle />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div>
                      {isLoading ? (
                        <div className="deletingAction">
                          <Loader /> <b>Deleting...</b>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <Table columns={columns} data={subAreas}></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
