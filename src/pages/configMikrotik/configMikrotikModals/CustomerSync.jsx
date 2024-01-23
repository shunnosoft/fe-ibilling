import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";

// internal import
import Loader from "../../../components/common/Loader";
import { fetchMikrotikSyncUser } from "../../../features/apiCalls";
import apiLink from "../../../api/apiLink";
import Table from "../../../components/table/Table";
import IndeterminateCheckbox from "../../../components/table/bulkCheckbox";
import { badge } from "../../../components/common/Utils";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import TdLoader from "../../../components/common/TdLoader";

const CustomerSync = ({
  show,
  setShow,
  mikrotikId,
  ispOwner,
  inActiveCustomer,
  setInActiveCustomer,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // customer state
  const [customer, setCustomer] = useState([]);

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

    fetchMikrotikSyncUser(dispatch, data, setIsloading, setShow);
  };

  // sync first time
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
        Header: t("monthly"),
        accessor: "monthlyFee",
      },

      {
        width: "11%",
        Header: t("billDate"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    []
  );

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={customer?.length ? "xl" : "md"}
        header={t("PPPoECustomerSync")}
      >
        <div>
          {isLoading && (
            <div className="d-flex justify-content-center align-items-center">
              <TdLoader />
            </div>
          )}
          {!loaded ? (
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                checked={inActiveCustomer}
                id="InActiveCustomer"
                onChange={(event) => setInActiveCustomer(event.target.checked)}
              />
              <label class="form-check-label" htmlFor="InActiveCustomer">
                <small className="text-secondary">
                  {t("doYouWantToSyncWithInActiveCustomer")}
                </small>
              </label>
            </div>
          ) : (
            <Table
              columns={column}
              data={customer}
              isLoading={false}
              bulkState={{
                setBulkCustomer,
              }}
              bulkLength={bulkCustomers.length}
            ></Table>
          )}
        </div>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={() => setShow(false)}
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
      </ComponentCustomModal>
    </>
  );
};

export default CustomerSync;
