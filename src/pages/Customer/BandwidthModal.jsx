import { useEffect, useRef, useState } from "react";
import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { SmoothieChart, TimeSeries } from "smoothie";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import { ArrowDownShort, ArrowUpShort } from "react-bootstrap-icons";
import axios from "axios";

const BandwidthModal = ({ modalShow, setModalShow, customerId }) => {
  const { t } = useTranslation();

  const canvasRef = useRef();
  const line1Ref = useRef(new TimeSeries());
  const line2Ref = useRef(new TimeSeries());

  // load the current live stream
  const [streamDone, setStreamDone] = useState(false);

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find editable data
  const data = customer.find((item) => item.id === customerId);

  const getCurrentLiveStream = async (customerId) => {
    setStreamDone(false);
    const TOKEN = await JSON.parse(localStorage.getItem("netFeeToken"));
    try {
      const res = await axios.get(
        `http://45.77.244.36:3131/api/v1/customer/mikrotik/bandwidth?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      // Get the readable stream from the response
      const reader = res?.body?.getReader();

      // Function to process each chunk of data
      const processChunk = ({ done, value }) => {
        if (done) {
          setStreamDone(true);
          return;
        }

        // Decode the chunk (assuming UTF-8 encoding)
        const textDecoder = new TextDecoder("utf-8");
        const chunk = textDecoder?.decode(value, { stream: true });

        const parseChunk = JSON.parse(chunk);
        console.log(parseChunk);

        // -> SETUP  CHUNK DATA SET UP IN SMOOTHIE
        line1Ref.current.append(
          new Date().getTime(),
          parseChunk[0]?.rx / 1024 / 1024
        );

        line2Ref.current.append(
          new Date().getTime(),
          parseChunk[0]?.tx / 1024 / 1024
        );

        // Continue reading the stream
        return reader?.read()?.then(processChunk);
      };

      // Start reading the stream
      reader?.read()?.then(processChunk);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (customerId) {
      const smoothie = new SmoothieChart({
        grid: {
          millisPerPixel: 22,
          borderVisible: false,
          verticalSections: 2,
          lineWidth: 0.3,
        },
        labels: { fontSize: 13 },
        tooltip: true,
        tooltipLine: { strokeStyle: "#bbbbbb" },
      });

      // smoothie?.streamTo(canvasRef?.current, 1000);

      smoothie?.addTimeSeries(line1Ref?.current, {
        strokeStyle: "#00FF00",
        lineWidth: 2,
      });

      smoothie?.addTimeSeries(line2Ref?.current, {
        strokeStyle: "yellow",
        lineWidth: 2,
      });

      // !streamDone &&
      getCurrentLiveStream(customerId);
    }
  }, [customerId]);

  return (
    <>
      <ComponentCustomModal
        show={modalShow}
        setShow={setModalShow}
        centered={true}
        size="lg"
        header={data?.name + " " + t("bandwidthLive")}
      >
        <div className="container">
          <div className="displayGrid2 d-flex justify-content-center align-items-center mb-2">
            <div className="d-flex gap-2">
              <p className="bandwithKbps">
                <ArrowDownShort />
                100kbps
              </p>
              <p className="bg-success bandwithRxTx">Rx</p>
            </div>

            <div className="d-flex gap-2">
              <p className="bg-danger bandwithRxTx">Tx</p>
              <p className="bandwithKbps">
                100kbps
                <ArrowUpShort />
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <canvas
              ref={canvasRef}
              id="chart"
              width="745"
              height="300"
            ></canvas>
          </div>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default BandwidthModal;
