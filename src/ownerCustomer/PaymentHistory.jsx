import moment from "moment";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { billPaymentHistory } from "../features/getIspOwnerUsersApi";
import { CurrencyDollar } from "react-bootstrap-icons";

const PaymentHistory = () => {
  const dispath = useDispatch();
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );
  const paymentHistory = useSelector((state) => state.client.paymentHistory);

  useEffect(() => {
    billPaymentHistory(dispath);
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
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <div class="wrapper wrapper-content animated fadeInRight">
                <div class="ibox-content forum-container">
                  <div class="forum-title">
                    <div class="pull-right forum-desc">
                      <samll>
                        Total Payment History{" "}
                        {paymentHistory.length > 0 ? paymentHistory.length : 0}
                      </samll>
                    </div>
                  </div>
                  {paymentHistory.map((item) => (
                    <div class="forum-item">
                      <div class="row">
                        <div class="col-md-9">
                          <div class="forum-icon text-success">
                            <CurrencyDollar />
                          </div>

                          <div class="forum-sub-title">
                            You payment bill through
                            <span className="badge bg-info ms-2">
                              {item.medium}
                            </span>
                          </div>
                        </div>
                        <div class="col-md-1 forum-info">
                          <div>
                            <span className="badge bg-secondary text-dark">
                              <small>{item.amount}</small>
                            </span>
                          </div>
                        </div>
                        <div class="col-md-1 forum-info">
                          <div>
                            <span className="badge bg-secondary text-dark">
                              <small>{item.package}</small>
                            </span>
                          </div>
                        </div>
                        <div class="col-md-1 forum-info">
                          <div>
                            <span className="badge bg-secondary text-dark">
                              show Details
                            </span>
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
    </div>
  );
};

export default PaymentHistory;
