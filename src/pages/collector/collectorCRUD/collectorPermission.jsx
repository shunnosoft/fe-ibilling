export const collectorPermission = (permission) => {
  const permissionBn = [
    {
      id: 1,
      value: "customerAdd",
      label: "গ্রাহক সংযোগ",
      isChecked: permission?.customerAdd,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "গ্রাহক আপডেট",
      isChecked: permission?.customerEdit,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "গ্রাহক এক্টিভেট",
      isChecked: permission?.customerActivate,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "গ্রাহক বন্ধ",
      isChecked: permission?.customerDeactivate,
    },
    {
      id: 5,
      value: "viewCustomerList",
      label: "গ্রাহক দেখবে",
      isChecked: permission?.viewCustomerList,
    },
    {
      id: 6,
      value: "connectionFee",
      label: "কানেকশন ফি",
      isChecked: permission?.connectionFee, //ToDo
    },
    {
      id: 7,
      value: "customerMobileEdit",
      label: "মোবাইল পরিবর্তন",
      isChecked: permission?.customerMobileEdit, //ToDo
    },
    {
      id: 8,
      value: "sendSMS",
      label: "সিঙ্গেল ম্যাসেজ",
      isChecked: permission?.sendSMS,
    },
    {
      id: 9,
      value: "billPosting",
      label: "বিল পোস্টিং",
      isChecked: permission?.billPosting,
    },
    {
      id: 10,
      value: "billPrint",
      label: "বিল প্রিন্ট",
      isChecked: permission?.billPrint,
    },
    {
      id: 11,
      value: "billDelete",
      label: "বিল ডিলিট",
      isChecked: permission?.billDelete,
    },
  ];

  const permissionEn = [
    {
      id: 1,
      value: "customerAdd",
      label: "Customer Add",
      isChecked: permission?.customerAdd,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "Customer Update",
      isChecked: permission?.customerEdit,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "Customer Activate",
      isChecked: permission?.customerActivate,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "Customer Deactivate",
      isChecked: permission?.customerDeactivate,
    },
    {
      id: 5,
      value: "viewCustomerList",
      label: "View Customer",
      isChecked: permission?.viewCustomerList,
    },
    {
      id: 6,
      value: "connectionFee",
      label: "Connection Fee",
      isChecked: permission?.connectionFee, //ToDo
    },
    {
      id: 7,
      value: "CustomerMobileEdit",
      label: "Change Mobile Number",
      isChecked: permission?.customerMobileEdit, //ToDo
    },
    {
      id: 8,
      value: "sendSMS",
      label: "Single Message",
      isChecked: permission?.sendSMS,
    },
    {
      id: 9,
      value: "billPosting",
      label: "Bill Posting",
      isChecked: permission?.billPosting,
    },
    {
      id: 10,
      value: "billPrint",
      label: "Print Bill",
      isChecked: permission?.billPrint,
    },
    {
      id: 11,
      value: "billDelete",
      label: "Bill Delete",
      isChecked: permission?.billDelete,
    },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return permissionBn;
  return permissionEn;
};
