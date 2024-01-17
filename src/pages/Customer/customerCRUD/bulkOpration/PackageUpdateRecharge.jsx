import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";
import moment from "moment";

// custom hooks import
import useISPowner from "../../../../hooks/useISPOwner";

//internal imports

// custom function import
import {
  getCustomerDayLeft,
  getMonthStartDay,
} from "../customerBillDayPromiseDate";

const BulkPackageUpdateRecharge = ({
  show,
  setShow,
  customer,
  bulkCustomer,
  singleMikrotik,
  mikrotikPackage,
}) => {
  console.log({ customer });
  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings, permission } = useISPowner();

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  //   const customersPackageUpdateHandle = (e) => {
  //     e.preventDefault();

  // bulkCustomer.map((temp) => temp.original.monthlyFee);

  // let otherCusetomerCount = 0;
  // let customers;
  // if (singleMikrotik) {
  //   customers = bulkCustomer.reduce((acc, current) => {
  //     if (current.original.mikrotik === singleMikrotik) {
  //       acc.push(current);
  //     } else {
  //       otherCusetomerCount++;
  //       toast.error("মাইক্রটিক এর মধ্যে এই" + current.original.name + "নেই");
  //     }
  //     return acc;
  //   }, []);
  // } else {
  //   alert(t("selectMikrotik"));
  // }

  // if (singleMikrotik && mikrotikPackage) {
  //   const data = {
  //     customerIds: customers.map((item) => item.original.id),
  //     mikrotikPackage,
  //   };
  //   const confirm = window.confirm(
  //     t("areYouWantToUpdateStatus") +
  //       customers.length +
  //       t("updateCustomerPackage") +
  //       "\n" +
  //       otherCusetomerCount +
  //       t("otherMtkUsers")
  //   );
  //   if (confirm) {
  //     bulkPackageEdit(dispatch, data, setIsLoading, setShow);
  //   }
  // } else {
  //   alert(t("selectPackage"));
  // }
  //   };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalBody></ModalBody>
        </ModalHeader>
      </Modal>
    </>
  );
};

export default BulkPackageUpdateRecharge;
