import "./subArea.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  GeoFill,
  ArrowLeftShort,
  EmojiFrown,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import SubAreaPost from "./subAreaModals/SubAreaPost";
// import { fetchArea, getArea } from "../../features/areaSlice";
// import { deleteSubArea, editSubArea } from "../../features/subAreaSlice";
import { FtextField } from "../../components/common/FtextField";
import { deleteSubArea, getArea,editSubArea } from "../../features/apiCalls";

export default function SubArea() {
  const navigate = useNavigate();
  const { areaId } = useParams();
  const area = useSelector((state) => state.area.area);
  const [search, setSearch] = useState("");
  const [subAreas, setSubAreas] = useState("");
  const [subAreaName, setSubAreaName] = useState("");
  const [ispId, setIspId] = useState("");
  const [subAreaID, setSubAreaID] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let serial = 0;

  const linemanValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
  });

   const dispatch =useDispatch()

const user = useSelector((state) => state.auth.currentUser);
 useEffect(() => {
   getArea(dispatch, user.ispOwner.id);
 }, [dispatch, user.ispOwner]);

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
    editSubArea(dispatch,IDs)
    setIsLoading(false);
    
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

  // const dispatchArea = (ispOwner) => {
  //   if (ispOwner) {
  //     dispatch(FetchAreaSuccess(ispOwner));
  //   }
  // };

  // delete sub area
  const deleteSingleSubAarea =(id, ispOwner) => {
    setIsLoading(true);
    const IDs = {
      ispOwnerId: ispOwner,
      subAreaId: id,
      areaId
    };
      deleteSubArea(dispatch,IDs)
      setIsLoading(false);
     

    
  };

  return (
    <>
      <Sidebar />
      <ToastContainer
        className="bg-green"
        toastStyle={{
          backgroundColor: "#677078",
          color: "white",
          fontWeight: "500",
        }}
      />
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
                        সাব-এরিয়া এডিট করুন
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
                              label="সাব-এরিয়া নাম"
                              name="name"
                            />

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                বাতিল করুন
                              </button>
                              <button
                                type="submit"
                                className="btn btn-success customBtn"
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader /> : "সেভ করুন"}
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
                <h2 className="collectorTitle">{name || ""} এর সাব-এরিয়া </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>অ্যাড সাব-এরিয়া</p>
                      <div className="addAndSettingIcon">
                        <GeoFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#subAreaModal"
                        />
                      </div>
                    </div>

                    <div className="allSubArea" onClick={gotoAllArea}>
                      <ArrowLeftShort className="arrowLeftSize" />
                      <span style={{ marginLeft: "3px" }}>এরিয়া</span>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট সাব-এরিয়া:{" "}
                          <span> {subAreas?.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য সাব-এরিয়া নাম টাইপ করুন "
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
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

                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">সিরিয়াল</th>
                          <th scope="col">সাব-এরিয়া</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subAreas?.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="noAraFound">
                              {name || ""} এর কোনো সাব-এরিয়া পাওয়া যায়নি{"   "}
                              <EmojiFrown />
                            </td>
                          </tr>
                        ) : (
                          subAreas?.filter((val) => {
                              return val.name
                                .toLowerCase()
                                .includes(search.toLowerCase());
                            })
                            .map((val, key) => (
                              <tr key={key}>
                                <td style={{ paddingLeft: "30px" }}>
                                  {++serial}
                                </td>
                                <td>{val.name}</td>
                                <td style={{ textAlign: "center" }}>
                                  <ThreeDots
                                    className="dropdown-toggle ActionDots"
                                    id="areaDropdown"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  />

                                  <ul
                                    className="dropdown-menu"
                                    aria-labelledby="areaDropdown"
                                  >
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#subAreaEditModal"
                                      onClick={() => {
                                        setSubAreaID(val.id);
                                        setSubAreaName(val.name);
                                        setIspId(val.ispOwner);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <PenFill />
                                          <p className="actionP">এডিট</p>
                                        </div>
                                      </div>
                                    </li>

                                    <li
                                      onClick={() => {
                                        deleteSingleSubAarea(
                                          val.id,
                                          val.ispOwner
                                        );
                                      }}
                                    >
                                      <div className="dropdown-item actionManager">
                                        <div className="customerAction">
                                          <ArchiveFill />
                                          <p className="actionP">ডিলিট</p>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
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
