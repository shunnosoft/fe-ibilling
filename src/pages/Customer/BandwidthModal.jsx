import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import CanvasJSReact from "@canvasjs/react-charts";
import apiLink from "../../api/apiLink";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BandwidthModal = ({ customer, modalShow, setModalShow }) => {
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
    let fetchInterval;
    const fetchBandwidthData = async () => {
      if (!modalShow || !customer?.id) return; // Stop fetching if modal is closed or no customer ID

      try {
        const response = await apiLink.get(
          `customer/mikrotik/bandwidth?customerId=${customer?.id}`
        );

        if (response.status === 200) {
          setChunkData(response.data?.data || []);
          fetchBandwidthData();
        }
      } catch (error) {
        toast.error(`Failed to fetch bandwidth data: ${error.message}`);
      }
    };

    // Fetch data every few seconds while modal is open
    if (modalShow) {
      fetchBandwidthData();
      // fetchInterval = setInterval(fetchBandwidthData, 2000); // Fetch every 5 seconds
    }

    return () => clearInterval(fetchInterval); // Clean up interval when modal closes or component unmounts
  }, [modalShow, customer?.id]);

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
          type: "column", // Bar chart for download
          showInLegend: true,
          legendText: `Download: ${
            dps1.length ? dps1[dps1.length - 1]?.y : 0
          } ${
            Number(formatToMbps(dps1[dps1.length - 1]?.y) / 1024) > 0
              ? "Mbps"
              : "kbps"
          }`,
          dataPointWidth: 2,
          dataPoints: dps1,
          // toolTipContent: `${dps1.length ? dps1[dps1.length - 1]?.y : 0} ${
          //   Number(formatToMbps(dps1[dps1.length - 1]?.y) / 1024) > 0
          //     ? "Mbps"
          //     : "kbps"
          // }`,
        },
        {
          type: "column", // Bar chart for upload
          showInLegend: true,
          legendText: `Upload: ${dps2.length ? dps2[dps2.length - 1]?.y : 0} ${
            Number(formatToMbps(dps2[dps2.length - 1]?.y) / 1024) > 0
              ? "Mbps"
              : "kbps"
          }`,
          dataPointWidth: 2,
          dataPoints: dps2,
          // toolTipContent: `${dps2.length ? dps2[dps2.length - 1]?.y : 0} ${
          //   Number(formatToMbps(dps2[dps2.length - 1]?.y) / 1024) > 0
          //     ? "Mbps"
          //     : "kbps"
          // }`,
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
