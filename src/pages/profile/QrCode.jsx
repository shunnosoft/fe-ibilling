//External Lib Import
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";

const QrCode = ({ ispInfo }) => {
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
    <div>
      <QRCode
        id="qr-gen"
        value={`http://192.168.1.48:3000/isp/${ispInfo.netFeeId}`}
        size={290}
        level={"H"}
        includeMargin={true}
      />

      <button
        class="btn btn-primary d-block mb-3 ms-4"
        onClick={downloadQRCode}
      >
        {t("downloadQRCode")}
      </button>
    </div>
  );
};

export default QrCode;
