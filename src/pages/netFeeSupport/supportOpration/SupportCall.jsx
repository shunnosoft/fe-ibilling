import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { PersonFill, Telephone } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import "./support.css";
import { getIspOwnerNetFeeSupport } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import { FontColor } from "../../../assets/js/theme";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import Footer from "../../../components/admin/footer/Footer";

const SupportCall = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // iBilling support Numbers
  const supportNumbers = useSelector(
    (state) => state.netFeeSupport?.supportCall
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supportNumbers.length === 0 &&
      getIspOwnerNetFeeSupport(dispatch, setIsLoading);
  }, []);

  return (
    <>
      <Sidebar />
      <div className="isp_owner_invoice_list">
        <div className={useDash.dashboardWrapper}>
          <div class="card text-center m-4">
            <div class="card-header">
              <h5 className="modal-title text-success">
                {t("netFeeSupportTeam")}
              </h5>
            </div>
            <div class="card-body">
              <table class="table align-middle mt-3">
                <tbody>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    supportNumbers?.map((val) => (
                      <tr>
                        <td className="mt-3 support">
                          <PersonFill className="text-primary" />
                          {val.name}
                        </td>
                        <td>
                          {val.mobile1 && (
                            <h5 className="text-secondary">
                              <Telephone className="text-info" /> {val.mobile1}
                            </h5>
                          )}
                          {val.mobile2 && (
                            <h5 className="text-secondary">
                              <Telephone className="text-info" /> {val.mobile2}
                            </h5>
                          )}
                        </td>

                        <td>
                          <span className="badge bg-success fs-6">
                            <small className="fs-6">{val.start}</small>
                          </span>
                          &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                          <span className="badge bg-danger fs-6">
                            <small className="fs-6">{val.end}</small>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div class="card-footer text-muted">
              {t("netFeeSupportContact")}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SupportCall;
