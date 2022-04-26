import { useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  // ArchiveFill,
  PenFill,
  PersonFill,
} from "react-bootstrap-icons";
import { Formik, Form } from "formik";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import useDash from "../../../assets/css/dash.module.css";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../../assets/js/theme";
import { FtextField } from "../../../components/common/FtextField";
import Footer from "../../../components/admin/footer/Footer";
import Loader from "../../../components/common/Loader";
import { useParams } from "react-router-dom";
import StaffSalaryPostModal from "./StaffSalaryPostModal";
import StaffSalaryEditModal from "./StaffSalaryEditModal";

export default function StaffSalary() {
  const dispatch = useDispatch();
  const { staffId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );
  const staff = useSelector((state) =>
    state.persistedReducer.staff.staff.find((item) => item.id == staffId)
  );

  //   const managerValidate = Yup.object({
  //     name: Yup.string()
  //       .min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে")
  //       .required("ম্যানেজার এর নাম দিন"),
  //     mobile: Yup.string()
  //       .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
  //       .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
  //       .required("ম্যানেজার এর মোবাইল নম্বর দিন "),
  //     address: Yup.string().required("ম্যানেজার এর  এড্রেস দিন "),
  //     email: Yup.string()
  //       .email("ইমেইল সঠিক নয় ")
  //       .required("ম্যানেজার এর ইমেইল দিতে হবে"),
  //     nid: Yup.string().required("ম্যানেজার এর NID দিন"),
  //   });

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">
                  ({staff.name}) কর্মচারীর প্রোফাইল
                </h2>
              </FourGround>
              {/* edit manager */}
              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector d-flex justify-content-between">
                    {staff && (
                      <div className="ManagerData">
                        <p>
                          <b>{staff.name} </b>, <b> {"address"}</b>
                        </p>
                        <p>
                          <b>{staff.mobile}</b>
                        </p>
                        <p>{staff.email}</p>
                      </div>
                    )}

                    {staff ? (
                      <div className="">
                        <div className="actionsManager">
                          <div className="dropdown">
                            <ThreeDots
                              className="dropdown-toggle ActionDots managerAction"
                              id="ManagerDropdownMenu"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            />
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="ManagerDropdownMenu"
                            >
                              <li
                                data-bs-toggle="modal"
                                data-bs-target="#addSalaryPostModal"
                              >
                                <div className="dropdown-item">
                                  <div className="ManagerAactionLi">
                                    <PersonPlusFill />
                                    <p className="actionP">আড স্যালারি</p>
                                  </div>
                                </div>
                              </li>
                              <li
                                data-bs-toggle="modal"
                                data-bs-target="#editSalaryPostModal"
                              >
                                <div className="dropdown-item">
                                  <div className="ManagerAactionLi">
                                    <PenFill />
                                    <p className="actionP">এডিট স্যালারি</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="addNewCollector">
                        <p>অ্যাড ম্যানেজার</p>
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <StaffSalaryPostModal staffId={staffId} />
                  {/* <StaffSalaryEditModal staffId={staffId} /> */}
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
