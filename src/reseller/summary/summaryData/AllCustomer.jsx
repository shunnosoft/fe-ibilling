import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import OtherCustomer from "./OtherCustomer";

import PackagedCustomer from "./PackagedCustomer";
import PaidCustomer from "./PaidCustomer";
import UnpaidCustomer from "./UnpaidCustomer";

const AllCustomer = ({ packageId, resellerId, year, month }) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="modal fade modal-dialog-scrollable "
        id="packageBasedCustomer"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("customer")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Tabs
                defaultActiveKey={"allCustomer"}
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="allCustomer" title={t("allCustomer")}>
                  <PackagedCustomer
                    packageId={packageId}
                    resellerId={resellerId}
                    year={year}
                    month={month}
                  />
                </Tab>
                <Tab eventKey="paidCustomer" title={t("totalPaidCustomer")}>
                  <PaidCustomer
                    packageId={packageId}
                    resellerId={resellerId}
                    year={year}
                    month={month}
                  />
                </Tab>
                <Tab eventKey="unPaidCustomer" title={t("totalUnpaidCustomer")}>
                  <UnpaidCustomer
                    packageId={packageId}
                    resellerId={resellerId}
                    year={year}
                    month={month}
                  />
                </Tab>
                <Tab eventKey="otherCustomer" title={t("otherCustomer")}>
                  <OtherCustomer
                    packageId={packageId}
                    resellerId={resellerId}
                    year={year}
                    month={month}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCustomer;
