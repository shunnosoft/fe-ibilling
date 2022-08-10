import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

const DetailsModal = ({ id }) => {
  // get all company name from redux
  const company = useSelector((state) => state?.companyName?.ispOwnerIds);

  // get all note in redux
  const comments = useSelector((state) => state.admin?.comments);

  // find single data
  const data = comments.find((item) => item.id === id);

  return (
    <div>
      <div
        className="modal fade"
        id="detailsComment"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {company[data?.ispOwner]}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <>
                <div className="comment-show">
                  <div className="d-flex">
                    <h5 className="mb-1">
                      <b>{data?.name}</b>
                    </h5>

                    <small className="ms-2">
                      {moment(data?.createdAt).format("DD-MMM-YYYY hh:mm:ss A")}
                    </small>
                  </div>
                  <div className="comment-info" style={{ marginTop: "-10px" }}>
                    <i class="badge bg-primary me-1">{data?.commentType}</i>
                    <i class="badge bg-info">{data?.status}</i>
                    {/* <span
                              class="badge text-dark"
                              data-bs-toggle="modal"
                              data-bs-target="#commentEditModal"
                              onClick={() => {
                                setCommentId(data.id);
                              }}
                            >
                              <Pencil />
                            </span> */}
                  </div>
                  <p className="mt-2">{data?.comment}</p>
                </div>
                <br />
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
