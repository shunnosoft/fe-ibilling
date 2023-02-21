import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AdminSupportDetails = ({ detailsId }) => {
  // netFee support all data
  const allSupportData = useSelector(
    (state) => state.adminNetFeeSupport?.adminSupport
  );

  // support details data state
  const [detailsSupport, setDetailsSupport] = useState("");

  // find support details data
  const supportDetails = allSupportData.find((item) => item.id === detailsId);

  useEffect(() => {
    if (supportDetails) {
      setDetailsSupport(supportDetails);
    }
  }, [supportDetails]);

  const { company, createdAt, description, status, support } = detailsSupport;

  return (
    <>
      <div
        className="modal fade"
        id="adminSupportDetails"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                NetFee Support Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h4
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="supportDetails"
              >
                {company}
              </h4>
              <>
                <div className="comment-show">
                  <div className="d-flex">
                    <small className="mb-3">
                      {moment(createdAt).format("MMM DD YYYY")}
                    </small>
                  </div>
                  <div className="comment-info" style={{ marginTop: "-10px" }}>
                    <i class="badge bg-primary me-1">{support}</i>
                    <i class="badge bg-info">{status}</i>
                  </div>
                  <p className="mt-2" style={{ textAlign: "justify" }}>
                    {description}
                  </p>
                </div>
                <br />
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSupportDetails;
