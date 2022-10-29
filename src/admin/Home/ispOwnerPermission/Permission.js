export const ispOwnerPermission = (perm) => {
  const permission = [
    {
      id: 1,
      value: "genCustomerId",
      label: "Customer Id Auto Generate",
      isChecked: perm?.genCustomerId,
    },
  ];
  return permission;
};
