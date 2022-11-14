import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import {
  getFixedNumberMessageLog,
  getMaskingMessageLog,
  getMessageLog,
} from "../../features/messageLogApi";
import FixedNumber from "./FixedNumber";
import Masking from "./Masking";
import NonMasking from "./NonMasking";

const MessageLog = () => {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // loading state
  const [nonMasking, setNonMasking] = useState(false);
  const [masking, setMasking] = useState(false);
  const [fixedNumber, setFixedNumber] = useState(false);

  // reload handler
  const reloadHandler = () => {
    getMessageLog(dispatch, setNonMasking, ispOwner);
    getFixedNumberMessageLog(dispatch, setFixedNumber, ispOwner);
    getMaskingMessageLog(dispatch, setMasking, ispOwner);
  };

  return (
    <>
      <Sidebar />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("messageLog")}</h2>
                    <div className="reloadBtn">
                      {nonMasking || fixedNumber || masking ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <Tabs
                  defaultActiveKey={"nonMasking"}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="nonMasking" title={t("nonMasking")}>
                    <NonMasking
                      nonMaskingLoading={nonMasking}
                      setNonMaskingLoading={setNonMasking}
                    />
                  </Tab>
                  <Tab eventKey="masking" title={t("masking")}>
                    <Masking
                      maskingLoading={masking}
                      setMaskingLoading={setMasking}
                    />
                  </Tab>
                  <Tab eventKey="fixedNumber" title={t("fixedNumber")}>
                    <FixedNumber
                      fixedNumberLoading={fixedNumber}
                      setFixedNumberLoading={setFixedNumber}
                    />
                  </Tab>
                </Tabs>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageLog;
