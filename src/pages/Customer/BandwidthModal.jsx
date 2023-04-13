import { useEffect, useRef } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { useSelector } from "react-redux";
import TdLoader from "../../components/common/TdLoader";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

// let callCount = 0;
let err = false;
const BandwidthModal = ({ modalShow, setModalShow, customerId }) => {
  const { t } = useTranslation();
  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find editable data
  const data = customer.find((item) => item.id === customerId);

  let [bandwidth, setBandWidth] = useState([]);
  let [tx, setTx] = useState([]);

  let [time, setTime] = useState([]);

  let date = new Date();
  date = date.toLocaleTimeString("en-US");

  const getCurrentSession = async () => {
    if (!err) {
      try {
        const res = await apiLink(
          "customer/mikrotik/currentSession?customerId=" + customerId
        );
        if (bandwidth.length > 13) {
          bandwidth.pop();
          tx.pop();
          time.pop();
        }
        setBandWidth([
          parseInt(res.data.data[0].rxByte?.toFixed(2) / 1048576),
          ...bandwidth,
        ]);
        setTx([parseInt(res.data.data[0].txByte?.toFixed(2) / 1048576), ...tx]);

        setTime([date, ...time]);
        // callCount++;
      } catch (error) {
        // callCount++;
        err = true;
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (modalShow) {
      interval = setInterval(() => {
        // if (callCount <= 5) {
        if (err) {
          clearInterval(interval);
          return;
        }
        getCurrentSession();
        // } else {
        //   clearInterval(interval);
        // }
      }, 4000);
      return () => {
        clearInterval(interval);
      };
    } else {
      clearInterval(interval);
    }
  }, [modalShow, bandwidth, tx, time]);

  const resetState = () => {
    err = false;
    setBandWidth([]);
    setTx([]);
    setTime([]);
  };

  const onCloseModal = () => {
    setModalShow(false);
    setTimeout(resetState, 3000);
  };

  const [chartData, setChartData] = useState({});

  useEffect(() => {
    setChartData({
      labels: time,
      datasets: [
        {
          label: "Rx",
          data: bandwidth,
          backgroundColor: "red",
          borderWidth: 4,
          barThickness: 16,
        },
        {
          label: "Tx",
          data: tx,
          backgroundColor: "green",
          borderWidth: 4,
          barThickness: 16,
        },
      ],
    });
  }, [time, bandwidth, tx]);

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
          <Modal.Title id="customerBandWidth">
            {t("bandwidthLive")}{" "}
            <span className="text-secondary">{data?.pppoe?.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!bandwidth.length ? (
            <div className="d-flex justify-content-center">
              <TdLoader />
            </div>
          ) : (
            <>
              <div
                className="bandwidth-graph"
                style={{ height: "36vh", overflow: "auto" }}
              >
                <div className="live-bandwith d-flex justify-content-around">
                  <div className="dateTime">
                    <h5>{t("time")}</h5>
                    {time.map((item, key) => (
                      <p key={key}>{item}</p>
                    ))}
                  </div>

                  <div className="rx">
                    <h5>Rx</h5>
                    {bandwidth.map((item, key) => (
                      <p key={key}>
                        {FormatNumber(item)}
                        <span className="text-secondary"> kbps</span>
                      </p>
                    ))}
                  </div>

                  <div className="tx">
                    <h5>Tx</h5>
                    {tx.map((item, key) => (
                      <p key={key}>
                        {FormatNumber(item)}
                        <span className="text-secondary"> kbps</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <Bar data={chartData} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onCloseModal}>{t("close")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BandwidthModal;
