import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { PersonFill, Telephone, Whatsapp } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import "./support.css";

const SupportCall = ({ isOpen }) => {
  const { t } = useTranslation();

  //modal handler
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

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
          <Modal.Title>
            <h5 className="text-success">{t("netFeeSupportTeam")}</h5>
          </Modal.Title>
        </ModalHeader>
        <ModalBody>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Towkir Hossain")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Whatsapp className="text-info" /> 01896192222
                  </h5>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01321141785
                  </h5>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Farabi Farhad")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Whatsapp className="text-success" /> 01896192223
                  </h5>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Abdur Razzaq")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Whatsapp className="text-success" /> 01896192224
                  </h5>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Rasel Ali")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01896192225
                  </h5>
                  <h5 className="text-secondary">
                    <Whatsapp className="text-success" /> 01321141787
                  </h5>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Marof")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01896192227
                  </h5>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Ashim Kumar")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01896192229
                  </h5>
                </td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SupportCall;
