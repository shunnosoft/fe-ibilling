import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { badge } from "../../../components/common/Utils";

const DetailsModal = ({ ownerId }) => {
  // get all data
  const data = useSelector((state) => state.admin.ispOwners);

  // get single isp owner data
  const ownerData = data.find((item) => item.id === ownerId);

  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerDetails"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {ownerData?.name}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* <h2 className="ProfileName">{ownerData?.name}</h2> */}
              <div className="profileMain">
                <div>
                  <h5>ISP Owner</h5>
                  <hr />
                  <h6>
                    ISP ID: <i className="text-primary">{ownerData?.id}</i>
                  </h6>
                  <h6>
                    Name: <i className="text-body">{ownerData?.name}</i>
                  </h6>
                  <h6>
                    Mobile: <i className="text-body">{ownerData?.mobile}</i>
                  </h6>
                  <h6>
                    Address: <i className="text-body">{ownerData?.address}</i>
                  </h6>
                  <h6>
                    Email: <i className="text-body"> {ownerData?.email}</i>
                  </h6>
                  <h6>
                    Status:{" "}
                    <i className="text-body">
                      <span class="badge bg-info">{ownerData?.status}</span>
                    </i>
                  </h6>
                  <h6>
                    Signature:{" "}
                    <i className="text-body">{ownerData?.signature}</i>
                  </h6>
                  <h6>
                    SMS Balance:{" "}
                    <i className="text-body">
                      <span class="badge  bg-info">
                        {ownerData?.smsBalance}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    SMS Rate: <i className="text-body">{ownerData?.smsRate}</i>
                  </h6>
                  <h6>
                    SMS Type: <i className="text-body">{ownerData?.smsType}</i>
                  </h6>
                  <h6>
                    Bill Collection Type:{" "}
                    <i className="text-body">
                      <span class="badge bg-info">
                        {ownerData?.billCollectionType}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Create At:{" "}
                    <i className="text-secondary">
                      {moment(ownerData?.ceatedAt).format("DD-MM-YYYY hh:mm A")}
                    </i>
                  </h6>

                  <br />
                  <h5>Reference</h5>
                  <hr />
                  <h6>
                    Name:{" "}
                    <i className="text-body">{ownerData?.reference?.name}</i>
                  </h6>
                  <h6>
                    Mobile:{" "}
                    <i className="text-body">{ownerData?.reference?.mobile}</i>
                  </h6>
                </div>

                <div>
                  <h5>BP Setting</h5>
                  <hr />
                  <h6>
                    Complain Management:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.complainManagement ? (
                        <span class="badge rounded-pill bg-success">YES</span>
                      ) : (
                        <span class="badge rounded-pill bg-danger">NO</span>
                      )}
                    </i>
                  </h6>
                  <h6>
                    Customer Limit:{" "}
                    <i className="text-body">
                      {" "}
                      <span class="badge bg-info">
                        {ownerData?.bpSettings?.customerLimit}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Customer Portal:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.customerPortal ? (
                        <span class="badge rounded-pill bg-success">YES</span>
                      ) : (
                        <span class="badge rounded-pill bg-danger">NO</span>
                      )}
                    </i>
                  </h6>
                  <h6>
                    Mikrotik:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.hasMikrotik ? (
                        <span class="badge rounded-pill bg-success">YES</span>
                      ) : (
                        <span class="badge rounded-pill bg-danger">NO</span>
                      )}
                    </i>
                  </h6>
                  <h6>
                    Mikrotik Length:{" "}
                    <i className="text-primary">
                      {ownerData?.mikrotiks.length}
                    </i>
                  </h6>
                  <h6>
                    PG:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.hasPG ? (
                        <span class="badge rounded-pill bg-success">YES</span>
                      ) : (
                        <span class="badge rounded-pill bg-danger">NO</span>
                      )}
                    </i>
                  </h6>
                  <h6>
                    Reseller:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.hasReseller ? (
                        <span class="badge rounded-pill bg-success">YES</span>
                      ) : (
                        <span class="badge rounded-pill bg-danger">NO</span>
                      )}
                    </i>
                  </h6>
                  <h6>
                    Inventory:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.inventory ? (
                        <span class="badge rounded-pill bg-success">YES</span>
                      ) : (
                        <span class="badge rounded-pill bg-danger">NO</span>
                      )}
                    </i>
                  </h6>
                  <h6>
                    Monthly Due Date:{" "}
                    <i className="text-danger">
                      {moment(ownerData?.bpSettings?.monthlyDueDate).format(
                        "DD-MM-YYYY hh:mm A"
                      )}
                    </i>
                  </h6>
                  <h6>
                    Registration Payment Status:{" "}
                    <i className="text-body">
                      <span
                        class={`badge bg-${
                          ownerData?.bpSettings?.paymentStatus === "paid"
                            ? "success"
                            : "danger"
                        }`}
                      >
                        {ownerData?.bpSettings?.paymentStatus}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Monthly Payment Status:{" "}
                    <i className="text-body">
                      <span
                        class={`badge bg-${
                          ownerData?.bpSettings?.monthlyPaymentStatus === "paid"
                            ? "success"
                            : "danger"
                        }`}
                      >
                        {ownerData?.bpSettings?.monthlyPaymentStatus}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Package:
                    <i className="text-body">
                      <span class="badge bg-info">
                        {ownerData?.bpSettings?.pack}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Package Type:{" "}
                    <i className="text-body">
                      <span class="badge bg-info">
                        {ownerData?.bpSettings?.packType}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Package Rate:{" "}
                    <i className="text-body">
                      <span class="badge bg-info">
                        {ownerData?.bpSettings?.packageRate}
                      </span>
                    </i>
                  </h6>
                  <h6>
                    Queue Type:{" "}
                    <i className="text-body">
                      {ownerData?.bpSettings?.queueType}
                    </i>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
