export const ispOwnerPermission = (perm) => {
  const permission = [
    {
      id: 1,
      value: "genCustomerId",
      label: "Customer Id Auto Generate",
      isChecked: perm?.genCustomerId,
    },
    {
      id: 2,
      value: "updateCustomerBalance",
      label: "Update Customer Balance",
      isChecked: perm?.updateCustomerBalance,
    },
    {
      id: 3,
      value: "mikrotikDelete",
      label: "Mikrotik Delete",
      isChecked: perm?.mikrotikDelete,
    },
    {
      id: 4,
      value: "promiseDate",
      label: "Promise Date",
      isChecked: perm?.promiseDate,
    },
    {
      id: 5,
      value: "reportDelete",
      label: "Report Delete",
      isChecked: perm?.reportDelete,
    },
    {
      id: 6,
      value: "expenditureDelete",
      label: "Expenditure Delete",
      isChecked: perm?.expenditureDelete,
    },
    {
      id: 7,
      value: "bulkAreaEdit",
      label: "Bulk Area Edit",
      isChecked: perm?.bulkAreaEdit,
    },
    {
      id: 8,
      value: "bulkStatusEdit",
      label: "Bulk Status Edit",
      isChecked: perm?.bulkStatusEdit,
    },
    {
      id: 9,
      value: "bulkBillingCycleEdit",
      label: "Bulk BillingCycle Edit",
      isChecked: perm?.bulkBillingCycleEdit,
    },
    {
      id: 10,
      value: "bulkPromiseDateEdit",
      label: "Bulk Promise Date Edit",
      isChecked: perm?.bulkPromiseDateEdit,
    },
    {
      id: 11,
      value: "bulkAutoDisableEdit",
      label: "Bulk Auto Disable Edit",
      isChecked: perm?.bulkAutoDisableEdit,
    },
    {
      id: 12,
      value: "bulkPackageEdit",
      label: "Bulk Package Edit",
      isChecked: perm?.bulkPackageEdit,
    },
    {
      id: 13,
      value: "bulkTransferToReseller",
      label: "Bulk Transfer To Reseller",
      isChecked: perm?.bulkTransferToReseller,
    },
    {
      id: 14,
      value: "bulkCustomerDelete",
      label: "Bulk Customer Delete",
      isChecked: perm?.bulkCustomerDelete,
    },
    {
      id: 15,
      value: "bulkCustomerMikrotikUpdate",
      label: "Bulk Customer Mikrotik Update",
      isChecked: perm?.bulkCustomerMikrotikUpdate,
    },
    {
      id: 16,
      value: "customerAutoConnection",
      label: "Customer Auto Connection",
      isChecked: perm?.customerAutoConnection,
    },
    {
      id: 17,
      value: "bulkCustomerRecharge",
      label: "Bulk Customer Recharge",
      isChecked: perm?.bulkCustomerRecharge,
    },
    {
      id: 18,
      value: "addCustomerWithMobile",
      label: "Add Customer with Mobile",
      isChecked: perm?.addCustomerWithMobile,
    },
  ];
  return permission;
};
