import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GearFill } from "react-bootstrap-icons";

// custom hooks import
import useISPowner from "../../../../hooks/useISPOwner";

// bulk modal import
import BulkCustomerMessage from "./BulkCustomerMessage";
import BulkPromiseDateEdit from "./BulkPromiseDateEdit";
import BulkBillingCycleEdit from "./bulkBillingCycleEdit";
import BulkPaymentStatusEdit from "./BulkPaymentStatusEdit";
import BulkSubAreaEdit from "./bulkSubAreaEdit";
import BulkStatusEdit from "./bulkStatusEdit";
import BulkBalanceEdit from "./BulkBalanceEdit";
import BulkRecharge from "./BulkRecharge";
import BulkCustomerTransfer from "./bulkCustomerTransfer";
import BulkPackageEdit from "./bulkPackageEdit";
import BulkAutoConnectionEdit from "./bulkAutoConnectionEdit";
import BulkCustomerDelete from "./BulkdeleteModal";
import BulkMikrotikEdit from "./bulkMikrotikEdit";

const BulkOptions = ({ bulkCustomers, page }) => {
  const { t } = useTranslation();

  // get user & current user data form useISPOwner hook
  const { role, bpSettings, hasMikrotik, permissions } = useISPowner();

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

  // bulk modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // customer data update bulk option
  const bulkOption = [
    {
      id: 1,
      name: "bulkMessage",
      class: "bg-white",
      isVisiable:
        bpSettings?.bulkMessage &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkMessage)),
      icon: <i class="fa-regular fa-envelope" />,
      value: "bulkMessage",
    },
    {
      id: 2,
      name: "editPromiseDate",
      class: "bg-info",
      isVisiable:
        bpSettings?.bulkPromiseDateEdit &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkPromiseDateEdit)),
      icon: <i class="fas fa-calendar-week fa-xs" />,
      value: "editPromiseDate",
    },
    {
      id: 3,
      name: "editBillingCycle",
      class: "bg-warning",
      isVisiable:
        bpSettings?.bulkBillingCycleEdit &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkBillingCycleEdit)),
      icon: <i class="far fa-calendar-alt fa-xs" />,
      value: "editBillingCycle",
    },
    {
      id: 4,
      name: "editPaymentStatus",
      class: "bg-danger",
      isVisiable:
        bpSettings?.bulkPaymentStatusEdit &&
        (role === "ispOwner" ||
          (["manager", "collector"].includes(role) &&
            permissions?.bulkPaymentStatusEdit)),
      icon: <i className="fas fa-box-open fa-xs" />,
      value: "editPaymentStatus",
    },
    {
      id: 5,
      name: "editArea",
      class: "bg-white",
      isVisiable:
        bpSettings?.bulkAreaEdit &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkAreaEdit)),
      icon: <i class="fas fa-map-marked-alt fa-xs" />,
      value: "editArea",
    },
    {
      id: 6,
      name: "editStatus",
      class: "bg-info",
      isVisiable:
        bpSettings?.bulkStatusEdit &&
        (role === "ispOwner" ||
          (["manager", "collector"].includes(role) &&
            permissions?.bulkStatusEdit)),
      icon: <i className="fas fa-edit fa-xs" />,
      value: "editStatus",
    },
    {
      id: 7,
      name: "editBalance",
      class: "bg-warning",
      isVisiable:
        bpSettings?.updateCustomerBalance &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.updateCustomerBalance)),
      icon: <i className="fas fa-dollar fa-xs " />,
      value: "editBalance",
    },
    {
      id: 8,
      name: "bulkRecharge",
      class: "bg-danger",
      isVisiable:
        bpSettings?.bulkCustomerRecharge &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkCustomerRecharge)),
      icon: <i className="fas fa-dollar fa-xs" />,
      value: "bulkRecharge",
    },
    {
      id: 9,
      name: "transferReseller",
      class: "bg-white",
      isVisiable:
        bpSettings?.bulkTransferToReseller &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkTransferToReseller)),
      icon: <i className="fa-solid fa-right-left fa-xs" />,
      value: "transferReseller",
    },
    {
      id: 10,
      name: "updatePackage",
      class: "bg-info",
      isVisiable:
        bpSettings?.bulkPackageEdit &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkPackageEdit)),
      icon: <i class="fas fa-wifi fa-xs" />,
      value: "updatePackage",
    },
    {
      id: 11,
      name: "automaticConnectionOff",
      class: "bg-warning",
      isVisiable:
        hasMikrotik &&
        bpSettings?.bulkAutoDisableEdit &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkAutoDisableEdit)),
      icon: <i class="fas fa-power-off fa-xs" />,
      value: "automaticConnectionOff",
    },
    {
      id: 12,
      name: "customerDelete",
      class: "bg-danger",
      isVisiable:
        bpSettings?.bulkCustomerDelete &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkCustomerDelete)),
      icon: <i className="fas fa-trash-alt fa-xs" />,
      value: "customerDelete",
    },
    {
      id: 13,
      name: "changeMikrotik",
      class: "bg-warning",
      isVisiable:
        hasMikrotik &&
        bpSettings?.bulkCustomerMikrotikUpdate &&
        (role === "ispOwner" ||
          (role === "manager" && permissions?.bulkCustomerMikrotikUpdate)),
      icon: <i class="fas fa-server fa-xs" />,
      value: "changeMikrotik",
    },
  ];

  return (
    <>
      {bulkCustomers.length > 0 && (
        <div className="client_wraper2">
          <div
            className={`settings_wraper2 ${
              isMenuOpen ? "show-menu2" : "hide-menu2"
            }`}
          >
            <div className="service_wraper">
              <ul className="client_service_list2 ps-0">
                {bulkOption.map(
                  (item) =>
                    item?.isVisiable && (
                      <>
                        <li
                          className="p-1"
                          type="button"
                          value={item?.value}
                          onClick={() => {
                            setModalStatus(item?.value);
                            setShow(true);
                          }}
                        >
                          <div>
                            <button
                              className={`btn btn-sm py-0 ${item?.class}`}
                              title={t(item?.name)}
                            >
                              <span className="menu_icon2">{item?.icon}</span>
                              <span className="button_title">
                                {t(item?.name)}
                              </span>
                            </button>
                          </div>
                          <div className="menu_label2">{t(item?.name)}</div>
                        </li>
                        <hr className="mt-0 mb-0" />
                      </>
                    )
                )}
              </ul>
            </div>

            {/* bulk option setting icon */}
            <div className="setting_icon_wraper2">
              <div
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="client_setting_icon2"
              >
                <GearFill />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* bulk option modal start */}

      {/* bulk message modal */}
      {modalStatus === "bulkMessage" && (
        <BulkCustomerMessage
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk promise date modal */}
      {modalStatus === "editPromiseDate" && (
        <BulkPromiseDateEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk billing cycle modal */}
      {modalStatus === "editBillingCycle" && (
        <BulkBillingCycleEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk payment status modal */}
      {modalStatus === "editPaymentStatus" && (
        <BulkPaymentStatusEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk sub area modal */}
      {modalStatus === "editArea" && (
        <BulkSubAreaEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk status edit modal */}
      {modalStatus === "editStatus" && (
        <BulkStatusEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk balance edit modal */}
      {modalStatus === "editBalance" && (
        <BulkBalanceEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk recharge modal */}
      {modalStatus === "bulkRecharge" && (
        <BulkRecharge
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk transfer modal */}
      {modalStatus === "transferReseller" && (
        <BulkCustomerTransfer
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk package edit */}
      {modalStatus === "updatePackage" && (
        <BulkPackageEdit
          show={show}
          page={page}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk auto connection edit */}
      {modalStatus === "automaticConnectionOff" && (
        <BulkAutoConnectionEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk customer delete modal */}
      {modalStatus === "customerDelete" && (
        <BulkCustomerDelete
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk mikrotik edit */}
      {modalStatus === "changeMikrotik" && (
        <BulkMikrotikEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomers}
        />
      )}

      {/* bulk option modal end */}
    </>
  );
};

export default BulkOptions;
