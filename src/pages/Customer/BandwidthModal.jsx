import { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiLink from "../../api/apiLink";
// import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";

// import "chartjs-adapter-luxon";
// import StreamingPlugin from "chartjs-plugin-streaming";
import { toast } from "react-toastify";
import { Tab, Tabs } from "react-bootstrap";

// Chart.register(StreamingPlugin);
let callCount = 0;
let err = false;
const BandwidthModal = ({ modalShow, setModalShow, customerId }) => {
  // const [err, setErr] = useState(false);
  const [bandwidth, setBandWidth] = useState([]);
  const [tx, setTx] = useState([]);

  const getCurrentSession = async () => {
    if (!err) {
      try {
        const res = await apiLink(
          "customer/mikrotik/currentSession?customerId=" + customerId
        );
        setBandWidth([
          ...bandwidth,
          parseInt((res.data.data[0].rxPacket / 1024).toFixed(2)),
        ]);
        setTx([...tx, parseInt((res.data.data[0].txPacket / 1024).toFixed(2))]);
        callCount++;
      } catch (error) {
        callCount++;
        err = true;
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (modalShow) {
      const interval = setInterval(() => {
        if (callCount <= 10) {
          if (err) {
            clearInterval(interval);
            return;
          }
          getCurrentSession();
        } else {
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [modalShow, bandwidth]);

  const chartsData = {
    labels: [...Array(10).keys()].map((item) => {
      return item;
    }),
    datasets: [
      {
        label: "rx",
        data: bandwidth,
        backgroundColor: "rgb(110 110 110 / 24%)",
        borderJoinStyle: "round",
        borderColor: "#00a4e3",
        fill: "origin",
        borderWidth: 2,
      },
    ],
  };

  const onCloseModal = () => {
    setModalShow(false);
    // setErr(false);
    err = false;
    setBandWidth([]);
    setTx([]);
  };

  const txData = {
    labels: [...Array(10).keys()].map((item) => {
      return item;
    }),
    datasets: [
      {
        label: "tx",
        data: tx,
        backgroundColor: "rgb(110 110 110 / 24%)",
        borderJoinStyle: "round",
        borderColor: "#00a4e3",
        fill: "origin",
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
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
            <Tabs
              defaultActiveKey="rx"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="rx" title="Download">
                <div className="lineChart">
                  <Line
                    data={chartsData}
                    height={400}
                    width={600}
                    options={{
                      tension: 0.4,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Tab>
              <Tab eventKey="tx" title="Upload">
                <div className="lineChart">
                  <Line
                    data={txData}
                    height={400}
                    width={600}
                    options={{
                      tension: 0.4,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onCloseModal}>Close</Button>
          {/* <Button onClick={() => setModalShow(false)}>Save</Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BandwidthModal;
