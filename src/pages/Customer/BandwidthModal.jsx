import { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiLink from "../../api/apiLink";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";
// import "chartjs-adapter-luxon";
import StreamingPlugin from "chartjs-plugin-streaming";
import { toast } from "react-toastify";

Chart.register(StreamingPlugin);

const BandwidthModal = ({ brandWithModal, setBrandWithModal, customerId }) => {
  const [bandwidth, setBandWidth] = useState({});

  if (brandWithModal) {
    console.log("bashar");
  }
  // let i = 0;

  // const myFunc = () => {
  //   console.log(++i);
  //   if (i == 5) clearInterval(start);
  // };
  // const start = setInterval(myFunc, 1000);

  // const chartsData = {
  //   datasets: [
  //     {
  //       label: "RX",
  //       borderColor: "rgb(255, 99, 132)",
  //       data: [],
  //     },
  //   ],
  // };

  // const options = {
  //   scales: {
  //     x: {
  //       type: "realtime",
  //       realtime: {
  //         delay: 1000,
  //         onRefresh: (chart) => {
  //           console.log(chart.data);
  //           chart.data.datasets.forEach((dataset) => {
  //             dataset.data.push({
  //               x: Date.now(),
  //               y: Math.random(),
  //             });
  //           });
  //         },
  //       },
  //     },
  //   },
  // };

  let callCount = 1;
  const getCurrentSession = async () => {
    try {
      const res = await apiLink(
        "customer/mikrotik/currentSession?customerId=" + customerId
      );
      console.log(res.data.data);
      // setBandWidth({
      //   RX: res.data.data[0].rxByte,
      //   TX: res.data.data[0].txByte,
      // });
      callCount++;
    } catch (error) {
      toast.error(error.message);
    }
  };
  // console.log(bandwidth);
  useEffect(() => {
    if (brandWithModal) {
      getCurrentSession();
      const interval = setInterval(() => {
        if (callCount < 2) {
          getCurrentSession();
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [brandWithModal]);

  return (
    <>
      <Modal
        show={brandWithModal}
        onHide={() => setBrandWithModal(false)}
        size="lg"
        aria-labelledby="customerBandWidth"
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title id="customerBandWidth">Bandwidth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Centered Modal</h4> */}
          <div className="bandwidth-graph">
            {/* <Line data={chartsData} options={options} /> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setBrandWithModal(false)}>Close</Button>
          <Button onClick={() => setBrandWithModal(false)}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BandwidthModal;
