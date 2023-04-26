import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../components/common/Loader";
import { fetchMikrotikSyncUser } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import apiLink from "../../../api/apiLink";
import Table from "../../../components/table/Table";
import IndeterminateCheckbox from "../../../components/table/bulkCheckbox";
import { badge } from "../../../components/common/Utils";
import moment from "moment";

const CustomerSync = ({
  mikrotikId,
  ispOwner,
  inActiveCustomer,
  setInActiveCustomer,
}) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [loaded, setLoaded] = useState(false);
  // bulk customer state
  const [bulkCustomers, setBulkCustomer] = useState([]);
  // Sync Customer
  const syncCustomer = () => {
    // send data for api
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
      inActiveCustomer: inActiveCustomer,
      customers: bulkCustomers.map((item) => item.original),
    };

    fetchMikrotikSyncUser(dispatch, data, setIsloading);
  };

  const syncCustomerFirstTime = async () => {
    setIsloading(true);
    try {
      const { data } = await apiLink({
        method: "POST",
        url: `/mikrotik/customer/${ispOwner}/${mikrotikId}?inActiveCustomer=${inActiveCustomer}&&isSelected=${false}`,
      });
      setCustomer(data);
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
    setIsloading(false);
  };

  const column = React.useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox
            customeStyle={true}
            {...getToggleAllPageRowsSelectedProps()}
          />
        ),
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
        width: "2%",
      },

      {
        width: "9%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "9%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: "pppoe.disabled",
        Cell: ({ cell: { value } }) => {
          return value ? badge("inactive") : badge("active");
        },
      },

      {
        width: "9%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },

      {
        width: "11%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    []
  );

  return (
    <div
      className="modal fade"
      id="SyncCustomer"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div
        className={`modal-dialog modal-dialog-scrollable ${
          customer.length && "modal-xl"
        }`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("PPPoECustomerSync")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {isLoading && (
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            )}
            {!loaded ? (
              <div class="form-check mt-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  checked={inActiveCustomer}
                  id="flexCheckDefault"
                  onChange={(event) =>
                    setInActiveCustomer(event.target.checked)
                  }
                />
                <label class="form-check-label" for="flexCheckDefault">
                  <small className="text-secondary">
                    {t("doYouWantToSyncWithInActiveCustomer")}
                  </small>
                </label>
              </div>
            ) : (
              <>
                <h4>{t("selectCustomer")}</h4>
                <Table
                  columns={column}
                  data={customer}
                  isLoading={false}
                  bulkState={{
                    setBulkCustomer,
                  }}
                ></Table>
              </>
            )}
          </div>
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              {t("cancel")}
            </button>
            <button
              onClick={loaded ? syncCustomer : syncCustomerFirstTime}
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("sync")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSync;
