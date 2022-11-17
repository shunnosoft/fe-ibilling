import React, { useEffect, useRef, useState } from "react";
import "../Customer/customer.css";

import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";

import Table from "../../components/table/Table";

import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import {
  ArrowClockwise,
  Cart2,
  CartPlus,
  PersonPlusFill,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { getProductApi } from "../../features/actions/inventoryAction";
import ProductPostModal from "./Modals/ProductPostModal";

function Stock() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const componentRef = useRef(); //reference of pdf export component

  const [isLoading, setIsLoading] = useState(false);

  //get ispOwner ID
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //get products
  const products = useSelector((state) => state.products.products);

  // reload handler
  const reloadHandler = () => {};

  useEffect(() => {
    getProductApi(dispatch, ispOwnerId, setIsLoading);
  }, []);

  const column = [
    {
      width: "10%",
      Header: "#",
      id: "row",
      accessor: (row) => Number(row.id + 1),
      Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
    },
    {
      width: "10%",
      Header: t("name"),
      accessor: "name",
    },
    {
      width: "10%",
      Header: t("description"),
      accessor: "description",
    },
    {
      width: "10%",
      Header: t("purchaseAmount"),
      accessor: "purchaseAmount",
    },
    {
      width: "10%",
      Header: t("sellAmount"),
      accessor: "sellAmount",
    },
    {
      width: "10%",
      Header: t("quantity"),
      accessor: "quantity",
    },
    {
      width: "15%",
      Header: () => <div className="text-center">{t("action")}</div>,
      id: "option",

      Cell: ({ row: { original } }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="dropdown">
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="customerDrop">
              <li>
                <div className="dropdown-item">
                  <div className="customerAction">
                    <Cart2 />
                    <p className="actionP">Sell Product</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("stock")}</div>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="addAndSettingIcon">
                      <ReactToPrint
                        documentTitle={t("stock")}
                        trigger={() => (
                          <PrinterFill
                            title={t("print")}
                            className="addcutmButton"
                          />
                        )}
                        content={() => componentRef.current}
                      />
                    </div>
                    <div
                      title={t("addProduct")}
                      className="header_icon"
                      data-bs-toggle="modal"
                      data-bs-target="#productModal"
                    >
                      <CartPlus />
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      data={products}
                      columns={column}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
        <ProductPostModal />
      </div>
    </>
  );
}

export default Stock;
