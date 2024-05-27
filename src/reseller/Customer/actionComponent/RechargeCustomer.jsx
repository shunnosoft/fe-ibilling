import { Card, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//internal imports
import "../../Customer/customer.css";
import CustomerBillCollect from "../customerCRUD/CustomerBillCollect";
import { getConnectionFee } from "../../../features/apiCalls";

const RechargeCustomer = ({ show, setShow, single, customerData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get customer connection fee due form redux store
  const paidConnectionFee = useSelector(
    (state) => state?.customer?.connectionFeeDue
  );

  // get customer api call
  useEffect(() => {
    //get customer paid connection fee
    getConnectionFee(dispatch, single);
  }, [single]);

  // modal close handler
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("recharge")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <Card>
          <Card.Body className="pb-0">
            <table
              className="table table-bordered"
              style={{ lineHeight: "12px" }}
            >
              <tbody>
                <tr>
                  <td>{t("id")}</td>
                  <td>
                    <b>{customerData?.customerId}</b>
                  </td>
                  <td>{t("pppoe")}</td>
                  <td>
                    <b>{customerData?.pppoe.name}</b>
                  </td>
                </tr>
                <tr>
                  <td>{t("name")}</td>
                  <td>
                    <b>{customerData?.name}</b>
                  </td>
                  <td>{t("mobile")}</td>
                  <td className="text-primary">
                    <b>{customerData?.mobile}</b>
                  </td>
                </tr>
                <tr>
                  <td>{t("monthly")}</td>
                  <td className="text-primary">
                    <b>{customerData?.monthlyFee}</b>
                  </td>
                  <td>{t("balance")}</td>
                  <td
                    className={
                      customerData?.balance < 0 ? "text-danger" : "text-success"
                    }
                  >
                    <b>{customerData?.balance}</b>
                  </td>
                </tr>
                {customerData?.connectionFee > 0 && (
                  <tr className="border border-2 border-success bg-light">
                    <td>{t("connectionFee")}</td>
                    <td>
                      <b>{customerData?.connectionFee}</b>
                    </td>
                    <td>{paidConnectionFee >= 0 ? t("paid") : t("due")}</td>
                    <td>
                      <b
                        className={
                          paidConnectionFee >= 0
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {paidConnectionFee >= 0
                          ? paidConnectionFee
                          : customerData?.connectionFee}
                      </b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card.Body>

          <CustomerBillCollect
            customerId={single}
            customerData={customerData}
            page="recharge"
            setShow={setShow}
          />
        </Card>
      </Modal>
    </>
  );
};

export default RechargeCustomer;
