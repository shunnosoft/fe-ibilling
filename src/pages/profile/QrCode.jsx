//External Lib Import
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";

const QrCode = ({ ispInfo, size }) => {
  const { t } = useTranslation();

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${ispInfo?.mobile}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <QRCode
        id="qr-gen"
        value={`https://app.one-billing.com/isp/${ispInfo.netFeeId}`}
        size={size}
        level={"H"}
        includeMargin={true}
      />

      <div>
        <button class="btn btn-primary m-3" onClick={downloadQRCode}>
          {t("downloadQRCode")}
        </button>
      </div>
    </div>
  );
};

export default QrCode;
