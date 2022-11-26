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
  ];
  return permission;
};
