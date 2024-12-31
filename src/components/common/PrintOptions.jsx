import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";

// custome hooks import
import useISPowner from "../../hooks/useISPOwner";

// INTERNAL IMPORT
import { printOptionData } from "../../pages/Customer/customerCRUD/printOptionData";
import PrintCustomer from "../../pages/Customer/customerPDF";
import ComponentCustomModal from "./customModal/ComponentCustomModal";

const PrintOptions = ({
  show,
  setShow,
  filterData,
  tableData,
  customerData,
  page,
  printData,
  printOptions,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();

  // get user & current user data form useISPOwner hook
  const { ispOwnerId } = useISPowner();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // single bill report id
  const [printOption, setPrintOption] = useState();

  // report copy print
  const [printCopy, setPrintCopy] = useState("customer");

  // set customer print options in state
  useEffect(() => {
    if (page === "customer") {
      if (printData) {
        let pageOption = [...printOptionData?.customer];
        pageOption.splice(2, 0, printData);
        setPrintOption(pageOption);
      } else {
        setPrintOption(printOptionData?.customer);
      }
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
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={true}
        size="md"
        header={t("printOptions")}
        footer={
          <>
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
          </>
        }
      >
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
      </ComponentCustomModal>

      {show && (
        <div style={{ display: "none" }}>
          <PrintCustomer
            ref={componentRef}
            page={page}
            printCopy={printCopy}
            filterData={filterData}
            currentCustomers={tableData}
            printOptions={printOption}
            customerData={customerData}
          />
        </div>
      )}
    </>
  );
};

export default PrintOptions;
