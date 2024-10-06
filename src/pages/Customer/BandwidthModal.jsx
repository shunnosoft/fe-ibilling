import { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import CanvasJSReact from "@canvasjs/react-charts";
import apiLink from "../../api/apiLink";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BandwidthModal = ({ customer, modalShow, setModalShow }) => {
  const abortControllerRef = useRef(null);

  const [chunkData, setChunkData] = useState([]);
  const [dps1, setDps1] = useState([]);
  const [dps2, setDps2] = useState([]);
  const [xVal, setXVal] = useState(0); // X-axis values

  const dataLength = 80; // Number of visible data points

  // Helper function to format data to Mbps or Kbps
  const formatToMbps = (value) => {
    return (value / 1024).toFixed(2); // Convert to Kbps otherwise
  };

  useEffect(() => {
    if (!modalShow) {
      setDps1([]);
      setDps2([]);
      setXVal(0);
    }
  }, [modalShow]);

  useEffect(() => {
    if (!modalShow) {
      setDps1([]);
      setDps2([]);
      setXVal(0);

      // Cancel any ongoing API calls
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    } else {
      // Start fetching data when modal opens
      fetchBandwidthData();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [modalShow]);

  const fetchBandwidthData = async () => {
    if (!modalShow || !customer?.id) return;

    // Create a new AbortController for this fetch
    abortControllerRef.current = new AbortController();

    try {
      const response = await apiLink.get(
        `customer/mikrotik/bandwidth?customerId=${customer?.id}`,
        { signal: abortControllerRef.current.signal }
      );

      if (response.status === 200) {
        setChunkData(response.data?.data || []);

        // Only call fetchBandwidthData again if the modal is still open
        if (modalShow) {
          fetchBandwidthData();
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (chunkData.length > 0) {
      const rxValue = chunkData[0].rx || 0;
      const txValue = chunkData[1].tx || 0;

      // Update data points for both download and upload
      setDps1((prevDps1) => {
        const newDps1 = [
          ...prevDps1,
          { x: xVal, y: Number(formatToMbps(rxValue)) },
        ];
        return newDps1.length > dataLength ? newDps1.slice(1) : newDps1;
      });

      setDps2((prevDps2) => {
        const newDps2 = [
          ...prevDps2,
          { x: xVal, y: Number(formatToMbps(txValue)) },
        ];
        return newDps2.length > dataLength ? newDps2.slice(1) : newDps2;
      });

      setXVal((prevXVal) => prevXVal + 1); // Increment xVal for the next update
    }
  }, [chunkData]);

  // Memoize chart options for performance optimization
  const options = useMemo(
    () => ({
      exportEnabled: true,
      title: {
        text: "Real-time Bandwidth Usage",
      },
      axisX: {
        minimum: xVal - dataLength + 1, // Dynamic x-axis start point
        maximum: xVal, // Current xVal as end point
      },
      data: [
        {
          type: "column",
          showInLegend: true,
          legendText: `Download: ${
            dps1[dps1.length - 1]?.y / 1024 >= 1
              ? (dps1[dps1.length - 1]?.y / 1024).toFixed(2)
              : dps1[dps1.length - 1]?.y
          } ${Number(dps1[dps1.length - 1]?.y / 1024) >= 1 ? "Mbps" : "kbps"}`,
          dataPointWidth: 2,
          dataPoints: dps1,
        },
        {
          type: "column",
          showInLegend: true,
          legendText: `Upload: ${
            dps2[dps2.length - 1]?.y / 1024 >= 1
              ? (dps2[dps2.length - 1]?.y / 1024).toFixed(2)
              : dps2[dps2.length - 1]?.y
          } ${Number(dps2[dps2.length - 1]?.y / 1024) >= 1 ? "Mbps" : "kbps"}`,
          dataPointWidth: 2,
          dataPoints: dps2,
        },
      ],
    }),
    [xVal, dps1, dps2]
  );

  return (
    <ComponentCustomModal
      show={modalShow}
      setShow={setModalShow}
      centered
      size="lg"
      header={customer?.name} //Real-time Bandwidth Usage
    >
      <div>
        <CanvasJSChart options={options} />
      </div>
    </ComponentCustomModal>
  );
};

export default BandwidthModal;
