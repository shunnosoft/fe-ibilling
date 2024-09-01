import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import ReactApexChart from "react-apexcharts";
import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";

const BandwidthModal = ({ modalShow, setModalShow, customer }) => {
  const { t } = useTranslation();

  const [chankData, setChankData] = useState([]);

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

  const getCurrentLiveStream = async () => {
    try {
      const response = await apiLink.get(
        `customer/mikrotik/bandwidth?customerId=${customer?.id}`
      );
      setChankData(response.data?.data || []);

      const intervalId = setInterval(() => {
        getCurrentLiveStream();
      }, 10000);

      return () => {
        clearInterval(intervalId);
      };
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    if (customer?.id) {
      getCurrentLiveStream();
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
    }, 1000);

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
