import QRCode from "qrcode.react";
import React from "react";

const QrCodePdf = React.forwardRef((props, ref) => {
  const { codeUrl, ispData } = props;
  console.log(ispData);
  return (
    <div ref={ref}>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h4 className="text-primary">{ispData?.company}</h4>

        <QRCode
          id="qr-gen"
          value={codeUrl}
          size={500}
          level={"H"}
          includeMargin={true}
        />

        <p className="text-primary">{codeUrl}</p>
      </div>
    </div>
  );
});

export default QrCodePdf;
