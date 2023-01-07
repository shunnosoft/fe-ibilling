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
      value: "expenditureDelete",
      label: "Expenditure Delete",
      isChecked: perm?.expenditureDelete,
    },
    {
      id: 6,
      value: "bulkAreaEdit",
      label: "Bulk Area Edit",
      isChecked: perm?.bulkAreaEdit,
    },
    {
      id: 7,
      value: "bulkStatusEdit",
      label: "Bulk Status Edit",
      isChecked: perm?.bulkStatusEdit,
    },
    {
      id: 8,
      value: "bulkBillingCycleEdit",
      label: "Bulk BillingCycle Edit",
      isChecked: perm?.bulkBillingCycleEdit,
    },
    {
      id: 9,
      value: "bulkPromiseDateEdit",
      label: "Bulk Promise Date Edit",
      isChecked: perm?.bulkPromiseDateEdit,
    },
    {
      id: 10,
      value: "bulkAutoDisableEdit",
      label: "Bulk Auto Disable Edit",
      isChecked: perm?.bulkAutoDisableEdit,
    },
    {
      id: 11,
      value: "bulkPackageEdit",
      label: "Bulk Package Edit",
      isChecked: perm?.bulkPackageEdit,
    },
    {
      id: 12,
      value: "bulkTransferToReseller",
      label: "Bulk Transfer To Reseller",
      isChecked: perm?.bulkTransferToReseller,
    },
    {
      id: 13,
      value: "bulkCustomerDelete",
      label: "Bulk Customer Delete",
      isChecked: perm?.bulkCustomerDelete,
    },
  ];
  return permission;
};
