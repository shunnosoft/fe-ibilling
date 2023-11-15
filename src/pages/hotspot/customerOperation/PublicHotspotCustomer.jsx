import React, { useRef } from "react";
import { t } from "i18next";
import QRCode from "qrcode.react";
import { Modal, ModalBody } from "react-bootstrap";
import { Download, Link45deg } from "react-bootstrap-icons";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";

//internal import
import QrCodePdf from "./QrCodePdf";

const PublicHotspotCustomer = ({ show, setShow, ispData }) => {
  const componentRef = useRef();

  // IspOwner hotspot custome create url
  const codeUrl = `localhost:3000/isp/hotspot/${ispData.netFeeId}`;

  // IspOwner hotspot custome create url copy handler
  const companyLinkCopyHandler = () => {
    navigator.clipboard.writeText(codeUrl);
    return toast.success("Link copied successfully");
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        keyboard={false}
        centered
      >
        <ModalBody>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <QRCode
              id="qr-gen"
              value={codeUrl}
              size={300}
              level={"H"}
              includeMargin={true}
            />

            <img />
          </div>
          <div className="downCopy">
            <ReactToPrint
              documentTitle={t("hotspotCustomerUrl")}
              trigger={() => (
                <button className="btn btn-primary fw-bolder">
                  <h5 className="mb-0">
                    {t("download")}
                    <Download className="ms-1" size={20} />
                  </h5>
                </button>
              )}
              content={() => componentRef.current}
            />

            <button
              onClick={companyLinkCopyHandler}
              className="btn text-primary border boreder-1"
            >
              <h5 className="mb-0">
                {t("copyLink")}
                <Link45deg className="ms-1" size={20} />
              </h5>
            </button>
          </div>
        </ModalBody>
      </Modal>

      <div style={{ display: "none" }}>
        <QrCodePdf ref={componentRef} codeUrl={codeUrl} ispData={ispData} />
      </div>
    </>
  );
};

export default PublicHotspotCustomer;
