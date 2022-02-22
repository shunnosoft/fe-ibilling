// import { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
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
import { addDeposit, getTotalbal } from "../../features/apiCalls";
import { useState } from "react";
import { useDispatch } from "react-redux";
import apiLink from "../../api/apiLink";

export default function Diposit() {
  const ispOwner = useSelector((state) => state.auth?.ispOwnerId);
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const userRole = useSelector((state) => state.auth.role);
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  const [isLoading,setLoading] =useState(false)
  const dispatch =useDispatch()
  // const balance = useSelector(state=>state.payment.balance)
  // console.log(balance) 
  const [balancee,setBalance] = useState("")
  console.log(balancee)
  // bill amount
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: currentUser?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: currentUser?.user.id,
      ispOwner: ispOwner,
    };

    addDeposit(dispatch,sendingData,setLoading)
  };
 
useEffect(()=>{
   const gettotal=async ()=>{
     try {
       const res = await apiLink.get(`v1/bill/monthlyBill/balance`)
       setBalance(res.data.balance)
       
     } catch (error) {

       
     }
   }
   gettotal()

},[])
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
              <FourGround>
                <h2 className="collectorTitle">ডিপোজিট</h2>
              </FourGround>

              {userRole !== "ispOwner" ? (
                <FourGround>
                  <div className="managerDipositToIsp">
                    <Formik
                      initialValues={{
                        amount: "",
                        balance: `৳ ${balancee}`, //put the value from api
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
                          <tr>
                            <td>Md. Rakib Hasan</td>
                            <td>৳ {500}</td>
                            <td>
                              <div className="AcceptRejectBtn">
                                <button>Accept</button>
                                <button>Reject</button>
                              </div>
                            </td>
                            <td>31/01/2022 07:25 PM</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </FourGround>
              ) : (
                ""
              )}
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
