import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../../features/apiCallAdmin";
import moment from "moment";

const AllComments = () => {
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // import dispatch
  const dispatch = useDispatch();

  // get note api call
  useEffect(() => {
    getComments(dispatch, setIsLoading);
  }, []);

  // get all note in redux
  const comments = useSelector((state) => state.admin?.comments);
  console.log(comments);
  return (
    <>
      <FontColor>
        <Sidebar />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <h2 className="dashboardTitle text-center">All Comments</h2>
              </div>
              <div className="card-body">
                {comments?.map((data, key) => (
                  <>
                    <div className="comment-show">
                      <div className="d-flex">
                        <h5 className="mb-1">
                          <b>{data?.name}</b>
                        </h5>

                        <small className="ms-2">
                          {moment(data.createdAt).format(
                            "DD-MMM-YYYY hh:mm:ss A"
                          )}
                        </small>
                      </div>
                      <div
                        className="comment-info"
                        style={{ marginTop: "-10px" }}
                      >
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
                      <p className="mt-2">{data.comment}</p>
                    </div>
                    <br />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FontColor>
    </>
  );
};

export default AllComments;
