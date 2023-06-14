import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { PersonFill, Telephone } from "react-bootstrap-icons";
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
        size="lg"
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
                    <Telephone className="text-info" /> 01896192222
                  </h5>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01321141785
                  </h5>
                </td>
                <td>
                  <span className="badge bg-success fs-6">
                    <small className="fs-6">02:00 PM</small>
                  </span>
                  &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                  <span className="badge bg-danger fs-6">
                    <small className="fs-6">11:00 PM</small>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Farabi Farhad")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01896192223
                  </h5>
                </td>
                <td>
                  <span className="badge bg-success fs-6">
                    <small className="fs-6">11:00 AM</small>
                  </span>
                  &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                  <span className="badge bg-danger fs-6">
                    <small className="fs-6">08:00 PM</small>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="mt-3 support">
                  <PersonFill className="text-primary" /> {t("Abdur Razzaq")}
                </td>
                <td>
                  <h5 className="text-secondary">
                    <Telephone className="text-info" /> 01896192224
                  </h5>
                </td>
                <td>
                  <span className="badge bg-success fs-6">
                    <small className="fs-6">02:00 PM</small>
                  </span>
                  &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                  <span className="badge bg-danger fs-6">
                    <small className="fs-6">11:00 PM</small>
                  </span>
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
                    <Telephone className="text-info" /> 01321141787
                  </h5>
                </td>
                <td>
                  <span className="badge bg-success fs-6">
                    <small className="fs-6">10:00 AM</small>
                  </span>
                  &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                  <span className="badge bg-danger fs-6">
                    <small className="fs-6">07:00 PM</small>
                  </span>
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
                <td>
                  <span className="badge bg-success fs-6">
                    <small className="fs-6">10:00 AM</small>
                  </span>
                  &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                  <span className="badge bg-danger fs-6">
                    <small className="fs-6">08:00 PM</small>
                  </span>
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
                <td>
                  <span className="badge bg-success fs-6">
                    <small className="fs-6">10:00 AM</small>
                  </span>
                  &nbsp;&nbsp; {t("to")} &nbsp;&nbsp;
                  <span className="badge bg-danger fs-6">
                    <small className="fs-6">09:00 PM</small>
                  </span>
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
