export const collectorPermission = (
  permission,
  role,
  ispOwnerPermission,
  managerPermission
) => {
  const permissionBn = [
    {
      id: 1,
      value: "customerAdd",
      label: "গ্রাহক সংযোগ",
      isChecked: permission?.customerAdd,
      disabled: false,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "গ্রাহক আপডেট",
      isChecked: permission?.customerEdit,
      disabled: false,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "গ্রাহক এক্টিভেট",
      isChecked: permission?.customerActivate,
      disabled: false,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "গ্রাহক বন্ধ",
      isChecked: permission?.customerDeactivate,
      disabled: false,
    },
    {
      id: 5,
      value: "viewCustomerList",
      label: "গ্রাহক দেখবে",
      isChecked: permission?.viewCustomerList,
      disabled: false,
    },
    {
      id: 6,
      value: "connectionFee",
      label: "কানেকশন ফি",
      isChecked: permission?.connectionFee, //ToDo
      disabled: false,
    },
    {
      id: 7,
      value: "customerMobileEdit",
      label: "মোবাইল পরিবর্তন",
      isChecked: permission?.customerMobileEdit, //ToDo
      disabled: false,
    },
    {
      id: 8,
      value: "sendSMS",
      label: "সিঙ্গেল ম্যাসেজ",
      isChecked: permission?.sendSMS,
      disabled: false,
    },
    {
      id: 9,
      value: "billPosting",
      label: "বিল পোস্টিং",
      isChecked: permission?.billPosting,
      disabled: false,
    },
    {
      id: 10,
      value: "billPrint",
      label: "বিল প্রিন্ট",
      isChecked: permission?.billPrint,
      disabled: false,
    },
    {
      id: 11,
      value: "billDelete",
      label: "বিল ডিলিট",
      isChecked: permission?.billDelete,
      disabled: !(role === "ispOwner"
        ? ispOwnerPermission?.reportDelete
        : role === "manager" &&
          ispOwnerPermission?.reportDelete &&
          managerPermission?.reportDelete),
    },
  ];

  const permissionEn = [
    {
      id: 1,
      value: "customerAdd",
      label: "Customer Add",
      isChecked: permission?.customerAdd,
      disabled: false,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "Customer Update",
      isChecked: permission?.customerEdit,
      disabled: false,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "Customer Activate",
      isChecked: permission?.customerActivate,
      disabled: false,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "Customer Deactivate",
      isChecked: permission?.customerDeactivate,
      disabled: false,
    },
    {
      id: 5,
      value: "viewCustomerList",
      label: "View Customer",
      isChecked: permission?.viewCustomerList,
      disabled: false,
    },
    {
      id: 6,
      value: "connectionFee",
      label: "Connection Fee",
      isChecked: permission?.connectionFee, //ToDo
      disabled: false,
    },
    {
      id: 7,
      value: "CustomerMobileEdit",
      label: "Change Mobile Number",
      isChecked: permission?.customerMobileEdit, //ToDo
      disabled: false,
    },
    {
      id: 8,
      value: "sendSMS",
      label: "Single Message",
      isChecked: permission?.sendSMS,
      disabled: false,
    },
    {
      id: 9,
      value: "billPosting",
      label: "Bill Posting",
      isChecked: permission?.billPosting,
      disabled: false,
    },
    {
      id: 10,
      value: "billPrint",
      label: "Print Bill",
      isChecked: permission?.billPrint,
      disabled: false,
    },
    {
      id: 11,
      value: "billDelete",
      label: "Bill Delete",
      isChecked: permission?.billDelete,
      disabled:
        (role === "ispOwner" && ispOwnerPermission?.reportDelete) ||
        (role === "manager" &&
          managerPermission?.reportDelete &&
          ispOwnerPermission?.reportDelete),
    },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return permissionBn;
  return permissionEn;
};
