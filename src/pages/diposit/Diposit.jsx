// import { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
// import { Check, X, ThreeDots } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";

// internal import
import { FtextField } from "../../components/common/FtextField";
import "./diposit.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useEffect } from "react";
import {
  addDeposit,
  depositAcceptReject,
  getDeposit,
  getTotalbal,
} from "../../features/apiCalls";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Diposit() {
  const ispOwner = useSelector((state) => state.auth?.ispOwnerId);
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const userRole = useSelector((state) => state.auth.role);
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const balance = useSelector(state=>state.payment.balance)
  // console.log(balance)
  const balancee = useSelector((state) => state.payment.balance);
  const allDeposit = useSelector((state) => state.payment.allDeposit);
  console.log(allDeposit);
  console.log(balancee);
  // bill amount
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: currentUser?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: currentUser?.user.id,
      ispOwner: ispOwner,
    };
    console.log(sendingData);
    addDeposit(dispatch, sendingData, setLoading);
  };

  const depositAcceptRejectHandler = (status, id) => {
    depositAcceptReject(dispatch, status, id);
  };

  useEffect(() => {
    if (userRole !== "ispOwner") getTotalbal(dispatch, setLoading);
  }, [dispatch, userRole]);

  // console.log(deposit)

  useEffect(() => {
    if (userRole !== "collector") {
      getDeposit(dispatch, {
        depositerRole:
          userRole === "ispOwner"
            ? "manager"
            : userRole === "manager"
            ? "collector"
            : "",
        ispOwnerID: ispOwner,
      });
    }
  }, [ispOwner, userRole, dispatch]);
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">ডিপোজিট</h2>
              </FourGround>

              {userRole !== "ispOwner" ? (
                <FourGround>
                  <div className="managerDipositToIsp">
                    <Formik
                      initialValues={{
                        amount: "",
                        balance: balancee, //put the value from api
                      }}
                      validationSchema={BillValidatoin}
                      onSubmit={(values) => {
                        billDipositHandler(values);
                      }}
                      enableReinitialize
                    >
                      {() => (
                        <Form>
                          <div className="displayGridForDiposit">
                            <FtextField
                              type="text"
                              name="balance"
                              label="মোট ব্যালান্স"
                              disabled
                            />
                            <FtextField
                              type="text"
                              name="amount"
                              label="ডিপোজিট পরিমান"
                            />
                            <button
                              type="submit"
                              className="btn btn-success dipositSubmitBtn"
                            >
                              সাবমিট
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </FourGround>
              ) : (
                ""
              )}

              <br />
              {userRole !== "collector" ? (
                <FourGround>
                  <div className="collectorWrapper">
                    {userRole !== "ispOwner" ? (
                      <div className="row searchCollector">
                        <div className="col-sm-8">
                          <h4 className="allCollector">
                            কালেক্টর ডিপোজিট: <span>NULL</span>
                          </h4>
                        </div>

                        <div className="col-sm-4">
                          <div className=" collectorSearch">
                            {/* <Search className="serchingIcon" /> */}
                            <input
                              type="text"
                              className="search"
                              placeholder="সার্চ"
                              // onChange={(e) => setCusSearch(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* table */}
                    <div className="table-responsive-lg">
                      <table className="table table-striped ">
                        <thead>
                          <tr>
                            <td>
                              নাম{" "}
                              {userRole === "ispOwner"
                                ? "(ম্যানেজার)"
                                : "(কালেক্টর)"}
                            </td>
                            <td>মোট</td>
                            <td className="textAlignCenter">অ্যাকশন</td>
                            <td>তারিখ</td>
                          </tr>
                        </thead>
                        <tbody>
                          {allDeposit?.map((item, key) => (
                            <tr key={key}>
                              <td>{item.depositBy}</td>
                              <td>৳ {item.amount}</td>
                              <td>
                                {item.status === "pending" ? (
                                  <div className="AcceptRejectBtn">
                                    <button
                                      onClick={() => {
                                        depositAcceptRejectHandler(
                                          "accepted",
                                          item.id
                                        );
                                      }}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => {
                                        depositAcceptRejectHandler(
                                          "rejected",
                                          item.id
                                        );
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="statusClass">
                                    {item.status}
                                  </span>
                                )}
                              </td>
                              <td>31/01/2022 07:25 PM</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </FourGround>
              ) : (
                ""
              )}

              {/* Diposit status */}
              {/* <FourGround>
                <div className="DipositStatusSection">
                  <h6 className="dipositStatusCheck">ডিপোজিট স্ট্যাটাস</h6>
                  <div className="dipositStatus">
                    <div className="table-responsive-lg">
                      <table className="table table-striped ">
                        <thead>
                          <tr>
                            <td>
                              নাম {userRole === "manager" ? "(ম্যানেজার)" : ""}
                              {userRole === "collector" ? "(কালেক্টর)" : ""}
                            </td>
                            <td>জমা</td>
                            <td className="textAlignCenter">স্ট্যাটাস</td>
                            <td>তারিখ</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <h5 className="ACPbtn acceptBtn">Accepted</h5>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <h5 className="ACPbtn rejectBtn">Rejected</h5>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <h5 className="ACPbtn pendingBtn">Pending</h5>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </FourGround> */}

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
