import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIspOwner } from "../../../features/apiCallAdmin";

const IspOwnerExecuteBill = ({ ownerId }) => {
  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // change data state
  const [billingCycle, setBillingCycle] = useState("");

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  const findIspOwner = ispOwners.find((item) => item.id === ownerId);
  const mobile = findIspOwner?.mobile;

  const executeBillingHandler = () => {
    const data = {
      bpSettings: {
        executeBillingCycle: "",
      },
    };
    console.log(data);
    if (billingCycle?.bpSettings?.executeBillingCycle === "true") {
      data.bpSettings.executeBillingCycle = "false";
    } else {
      data.bpSettings.executeBillingCycle = "true";
    }
  };

  useEffect(() => {
    getIspOwner(mobile, setBillingCycle, setIsLoading);
  }, [ownerId]);

  return (
    <div
      class="modal fade"
      id="ispOwnerExecuteBill"
      data-backdrop="static"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 style={{ color: "#0abb7a" }} className="modal-title">
              {billingCycle?.company}
            </h4>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <>
              <div className="comment-show">
                <div className="d-flex">
                  <small className="mb-3">{billingCycle?.name}</small>
                </div>
                <div className="comment-info" style={{ marginTop: "-10px" }}>
                  <i class="badge bg-primary me-1">{billingCycle?.status}</i>
                  <i class="badge bg-info">
                    {billingCycle?.bpSettings?.monthlyPaymentStatus}
                  </i>
                </div>
                {billingCycle?.bpSettings?.executeBillingCycle}
              </div>
              <br />
            </>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              onClick={executeBillingHandler}
            >
              {billingCycle?.bpSettings?.executeBillingCycle === "false"
                ? "Yes"
                : "No"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IspOwnerExecuteBill;
