import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { ArrowClockwise, FilterCircle } from "react-bootstrap-icons";
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

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <h2>{t("messageLog")}</h2>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title={t("filter")}
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

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
                >
                  <Tab eventKey="nonMasking" title={t("nonMasking")}>
                    <NonMasking
                      nonMaskingLoading={nonMasking}
                      setNonMaskingLoading={setNonMasking}
                      activeKeys={activeKeys}
                    />
                  </Tab>
                  <Tab eventKey="masking" title={t("masking")}>
                    <Masking
                      maskingLoading={masking}
                      setMaskingLoading={setMasking}
                      activeKeys={activeKeys}
                    />
                  </Tab>
                  <Tab eventKey="fixedNumber" title={t("fixedNumber")}>
                    <FixedNumber
                      fixedNumberLoading={fixedNumber}
                      setFixedNumberLoading={setFixedNumber}
                      activeKeys={activeKeys}
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
