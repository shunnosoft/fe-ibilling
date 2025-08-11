export const collectorPermission = (permission, resellerPermission) => {
  const permissionBn = [
    {
      id: 1,
      value: "customerAdd",
      label: "গ্রাহক সংযোগ",
      isChecked: permission?.customerAdd,
      isDisabled: !resellerPermission?.customerAdd,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "গ্রাহক আপডেট",
      isChecked: permission?.customerEdit,
      isDisabled: !resellerPermission?.customerEdit,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "গ্রাহক এক্টিভেট",
      isChecked: permission?.customerActivate,
      isDisabled: !resellerPermission?.customerStatusEdit,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "গ্রাহক বন্ধ",
      isChecked: permission?.customerDeactivate,
      isDisabled: !resellerPermission?.customerStatusEdit,
    },
    {
      id: 5,
      value: "viewCustomerList",
      label: "গ্রাহক দেখবে",
      isChecked: permission?.viewCustomerList,
      isDisabled: false,
    },
    {
      id: 6,
      value: "connectionFee",
      label: "কানেকশন ফি",
      isChecked: permission?.connectionFee, //ToDo
      isDisabled: false,
    },
    {
      id: 7,
      value: "customerMobileEdit",
      label: "মোবাইল পরিবর্তন",
      isChecked: permission?.customerMobileEdit, //ToDo
      isDisabled: false,
    },
    {
      id: 8,
      value: "sendSMS",
      label: "সিঙ্গেল ম্যাসেজ",
      isChecked: permission?.sendSMS,
      isDisabled: false,
    },
    {
      id: 9,
      value: "billPosting",
      label: "বিল পোস্টিং",
      isChecked: permission?.billPosting,
      isDisabled: false,
    },
    {
      id: 10,
      value: "instantRechargeBillPrint",
      label: "ইনস্ট্যান্ট রিচার্জ বিল প্রিন্ট",
      isChecked: permission?.instantRechargeBillPrint,
      // isDisabled: false,
      isDisabled: !resellerPermission?.instantRechargeBillPrint,
    },
    {
      id: 11,
      value: "bulkStatusEdit",
      label: "বাল্ক স্ট্যাটাস এডিট",
      isChecked: permission?.bulkStatusEdit,
      isDisabled: !resellerPermission?.bulkCustomerStatusEdit,
    },
  ];

  const permissionEn = [
    {
      id: 1,
      value: "customerAdd",
      label: "Customer Add",
      isChecked: permission?.customerAdd,
      isDisabled: !resellerPermission?.customerAdd,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "Customer Edit",
      isChecked: permission?.customerEdit,
      isDisabled: !resellerPermission?.customerEdit,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "Customer Active",
      isChecked: permission?.customerActivate,
      isDisabled: !resellerPermission?.customerStatusEdit,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "Customer Deactive",
      isChecked: permission?.customerDeactivate,
      isDisabled: !resellerPermission?.customerStatusEdit,
    },
    {
      id: 5,
      value: "viewCustomerList",
      label: "View Customer",
      isChecked: permission?.viewCustomerList,
      isDisabled: false,
    },
    {
      id: 6,
      value: "connectionFee",
      label: "Connection Fee",
      isChecked: permission?.connectionFee, //ToDo
      isDisabled: false,
    },
    {
      id: 7,
      value: "CustomerMobileEdit",
      label: "Change Mobile",
      isChecked: permission?.customerMobileEdit, //ToDo
      isDisabled: false,
    },
    {
      id: 8,
      value: "sendSMS",
      label: "Single Message",
      isChecked: permission?.sendSMS,
      isDisabled: false,
    },
    {
      id: 9,
      value: "billPosting",
      label: "Bill Posting",
      isChecked: permission?.billPosting,
      isDisabled: false,
    },
    {
      id: 10,
      value: "instantRechargeBillPrint",
      label: "Instant Recharge Bill Print",
      isChecked: permission?.instantRechargeBillPrint,
      isDisabled: !resellerPermission?.instantRechargeBillPrint,
    },
    {
      id: 11,
      value: "bulkStatusEdit",
      label: "Bulk Status Edit",
      isChecked: permission?.bulkStatusEdit,
      isDisabled: !resellerPermission?.bulkCustomerStatusEdit,
    },
  ];

  if (localStorage.getItem("oneBilling:lang") === "bn") return permissionBn;
  return permissionEn;
};
