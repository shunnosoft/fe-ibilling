import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { billPaymentHistory } from "../features/getIspOwnerUsersApi";
import { CurrencyDollar } from "react-bootstrap-icons";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );
  const paymentHistory = useSelector((state) => state.client.paymentHistory);

  useEffect(() => {
    billPaymentHistory(dispatch);
  }, []);

  return (
    <div className="paymentHistory">
      <p>Payment Details:</p>
      <div className="packages_info_wraper mw-75 ">
        <p>
          Next Payment Date:{" "}
          <span className="badge bg-secondary">
            {moment(userData?.billingCycle).format("DD-MMM-YYYY")}
          </span>
        </p>
        <p>
          Last Payment:{" "}
          <span className="badge bg-warning text-dark">
            {moment(paymentHistory[0]?.createdAt).format("DD-MMM-YYYY")} TK
          </span>{" "}
        </p>
      </div>
      <div className="payment_history_table">
        <div className="row">
          <div className="col-lg-12">
            <div className="wrapper wrapper-content animated fadeInRight">
              <div className="ibox-content forum-container">
                <div className="forum-title">
                  <div className="pull-right forum-desc">
                    <samll>
                      Total Payment History{" "}
                      {paymentHistory.length > 0 ? paymentHistory.length : 0}
                    </samll>
                  </div>
                </div>
                {paymentHistory.map((item) => (
                  <div className="forum-item">
                    <div className="payment_history_list">
                      <div>
                        <div className="forum-icon text-success">
                          <CurrencyDollar />
                        </div>

                        <div className="forum-sub-title">
                          Date {moment(item.createdAt).format("MMM-DD-YYYY")}{" "}
                        </div>
                      </div>

                      <div className="d-flex me-3 justify-content-evenly">
                        <div className="forum-info">
                          <div>
                            <span className="badge bg-secondary">
                              <small>{item.amount}</small>
                            </span>
                          </div>
                        </div>
                        <div className="forum-info">
                          <div>
                            <span className="badge bg-secondary">
                              <small>{item.package}</small>
                            </span>
                          </div>
                        </div>
                        <div className="forum-info ">
                          <div className="view-payment">
                            <button>view</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
