import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";

// INTERNAL IMPORT
import { printOptionData } from "../../pages/Customer/customerCRUD/printOptionData";
import PrintCustomer from "../../pages/Customer/customerPDF";

const PrintOptions = ({
  show,
  setShow,
  filterData,
  tableData,
  page,
  printOptions,
}) => {
  const { t } = useTranslation();
  const componentRef = useRef();

  // single bill report id
  const [printOption, setPrintOption] = useState();

  // report copy print
  const [printCopy, setPrintCopy] = useState("customer");

  // set customer print options in state
  useEffect(() => {
    if (page === "customer") {
      setPrintOption(printOptionData?.customer);
    } else {
      setPrintOption(printOptionData?.report);
    }
  }, [page]);

  //modal close handle
  const closeHandler = () => setShow(false);

  //print option controller handler
  const printOptionsController = ({ target }) => {
    const updatedState = printOption.map((item) => {
      if (item.value === target.value) {
        item.checked = target.checked;
      }
      return item;
    });
    setPrintOption(updatedState);
  };

  // print customer or customer & office copy
  const printCopyHandle = ({ target }) => {
    setPrintCopy(target.value);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={closeHandler}
        backdrop="static"
        keyboard={false}
        size="md"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="text-secondary">{t("printOptions")}</h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {/* all report option checked */}
          <div className="displayGrid3">
            {printOption?.map((item) => (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={item.id}
                  value={item.value}
                  checked={item.checked}
                  onChange={printOptionsController}
                />
                <label
                  htmlFor={item.id}
                  className="form-check-label text-secondary"
                >
                  {t(item.label)}
                </label>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between align-items-center">
          {/* print page manually create option checked */}
          {page === "billReport" && (
            <div className="d-flex gap-2">
              {printOptions?.map((item) => (
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={item.id}
                    value={item.value}
                    checked={printCopy === item.value}
                    onChange={printCopyHandle}
                  />
                  <label
                    htmlFor={item.id}
                    className="form-check-label text-secondary"
                  >
                    {t(item.label)}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* onclick report print handle */}
          <div onClick={closeHandler}>
            <ReactToPrint
              documentTitle={t("print")}
              trigger={() => <Button variant="primary">{t("print")}</Button>}
              content={() => componentRef.current}
            />
          </div>
        </ModalFooter>
      </Modal>

      {show && (
        <div style={{ display: "none" }}>
          <PrintCustomer
            ref={componentRef}
            page={page}
            printCopy={printCopy}
            filterData={filterData}
            currentCustomers={tableData}
            printOptions={printOption}
          />
        </div>
      )}
    </>
  );
};

export default PrintOptions;
