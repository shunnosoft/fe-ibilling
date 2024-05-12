import { Card, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import { useTranslation } from "react-i18next";

//internal imports
import "../../../Customer/customer.css";
import CustomerBillCollect from "../CustomerBillCollect";
import { getConnectionFee } from "../../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

const RechargeCustomer = ({ show, setShow, single, customerData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get customer connection fee due form redux store
  const paidConnectionFee = useSelector(
    (state) => state.customer.connectionFeeDue
  );

  // get api calls
  useEffect(() => {
    //get customer paid connection fee
    getConnectionFee(dispatch, customerData.id);
  }, [customerData]);

  // modal close handler
  const handleClose = () => setShow(false);

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="md"
        header={t("recharge")}
      >
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
                  <td className="text-success">
                    <b>{customerData?.monthlyFee}</b>
                  </td>
                  <td>{t("balance")}</td>
                  <td className="text-info">
                    <b>{customerData?.balance}</b>
                  </td>
                </tr>
                {customerData?.connectionFee ? (
                  <tr className="border border-2 border-success bg-light">
                    <td>{t("connectionFee")}</td>
                    <td>
                      <b>{customerData?.connectionFee}</b>
                    </td>
                    <td>{paidConnectionFee ? t("paid") : t("due")}</td>
                    <td>
                      <b
                        className={
                          paidConnectionFee ? "text-success" : "text-danger"
                        }
                      >
                        {paidConnectionFee
                          ? paidConnectionFee
                          : customerData?.connectionFee}
                      </b>
                    </td>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </Card.Body>

          <CustomerBillCollect
            single={single}
            status="pppoe"
            page="recharge"
            setShow={setShow}
          />
        </Card>
      </ComponentCustomModal>
    </>
  );
};

export default RechargeCustomer;
