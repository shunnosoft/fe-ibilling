import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import ReactApexChart from "react-apexcharts";
import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";

const BandwidthModal = ({ modalShow, setModalShow, customer }) => {
  const { t } = useTranslation();

  //real time chank data state
  const [chankData, setChankData] = useState([]);

  //chart data state
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "TX",
        data: [],
      },
      {
        name: "RX",
        data: [],
      },
    ],
    options: {
      chart: {
        id: "realtime",
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: 2000,
          },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Real-time Bandwidth Usage",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Bandwidth (bps)",
        },
      },
      legend: {
        position: "top",
      },
    },
  });

  const getCurrentLiveStream = async (callCountRef) => {
    try {
      const response = await apiLink.get(
        `customer/live-bandwidth/${customer?.id}`
      );
      setChankData(response?.data || []);

      if (callCountRef.current < 3) {
        callCountRef.current += 1;
        setTimeout(() => getCurrentLiveStream(callCountRef), 10000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (customer?.id) {
      const callCountRef = { current: 1 };
      getCurrentLiveStream(callCountRef);
    }
  }, [customer?.id]);

  useEffect(() => {
    if (!chankData || chankData.length === 0) return;

    const txData = chankData.map((item) => parseInt(item[0]?.tx, 10) || 0);
    const rxData = chankData.map((item) => parseInt(item[0]?.rx, 10) || 0);

    let index = 0;

    const interval = setInterval(() => {
      if (index < txData.length) {
        const currentTime = Date.now();

        const newTxData = { x: currentTime, y: txData[index] };
        const newRxData = { x: currentTime, y: rxData[index] };

        setChartData((prevChartData) => ({
          ...prevChartData,
          series: [
            {
              name: "TX",
              data: [...prevChartData.series[0].data, newTxData],
            },
            {
              name: "RX",
              data: [...prevChartData.series[1].data, newRxData],
            },
          ],
        }));

        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [chankData]);

  return (
    <ComponentCustomModal
      show={modalShow}
      setShow={setModalShow}
      centered
      size="xl"
      header={`${customer?.name} ${t("bandwidthLive")}`}
    >
      <div id="chart">
        <ReactApexChart
          id="realtime"
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
    </ComponentCustomModal>
  );
};

export default BandwidthModal;
