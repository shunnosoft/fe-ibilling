export const resellerPermissions = (permission, bpSettings) => {
  // const per = [
  //   {
  //     id: 1,
  //     value: "customerAdd",
  //     label: "গ্রাহক সংযোগ",
  //     isChecked: permission?.customerAdd,
  //     disabled: false,
  //   },
  //   {
  //     id: 2,
  //     value: "customerEdit",
  //     label: "গ্রাহক আপডেট",
  //     isChecked: permission?.customerEdit,
  //     disabled: false,
  //   },
  //   {
  //     id: 3,
  //     value: "customerActivate",
  //     label: "গ্রাহক এক্টিভেট",
  //     isChecked: permission?.customerActivate,
  //     disabled: false,
  //   },
  //   {
  //     id: 4,
  //     value: "customerDeactivate",
  //     label: "গ্রাহক বন্ধ",
  //     isChecked: permission?.customerDeactivate,
  //     disabled: false,
  //   },
  //   {
  //     id: 5,
  //     value: "viewCustomer",
  //     label: "গ্রাহক দেখবে",
  //     isChecked: permission?.viewCustomerList,
  //     disabled: false,
  //   },
  //   {
  //     id: 6,
  //     value: "connectionFee",
  //     label: "কানেকশন ফি",
  //     isChecked: permission?.connectionFee, //ToDo
  //     disabled: false,
  //   },
  //   {
  //     id: 7,
  //     value: "CustomerMobileEdit",
  //     label: "মোবাইল পরিবর্তন",
  //     isChecked: permission?.customerMobileEdit, //ToDo
  //     disabled: false,
  //   },
  //   {
  //     id: 8,
  //     value: "sendSMS",
  //     label: "ম্যাসেজ বোর্ড",
  //     isChecked: permission?.sendSMS,
  //     disabled: false,
  //   },
  //   {
  //     id: 10,
  //     value: "billPosting",
  //     label: "বিল পোস্টিং",
  //     isChecked: permission?.billPosting,
  //     disabled: false,
  //   },
  //   {
  //     id: 11,
  //     value: "billPosting",
  //     label: "বিল প্রিন্ট",
  //     isChecked: permission?.billPrint,
  //     disabled: false,
  //   },
  //   {
  //     id: 12,
  //     value: "instantRechargeBillPrint",
  //     label: "ইনস্ট্যান্ট রিচার্জ বিল প্রিন্ট",
  //     isChecked: permission?.instantRechargeBillPrint,
  //     disabled: !bpSettings?.instantRechargeBillPrint,
  //   },
  // ];

  const permissionEn = [
    {
      id: 1,
      label: "Customer Add",
      value: "customerAdd",
      isChecked: permission?.customerAdd,
      disabled: false,
    },

    {
      id: 2,
      label: "Customer Edit",
      value: "customerEdit",
      isChecked: permission?.customerEdit,
      disabled: false,
    },

    {
      id: 4,
      label: "Edit monthly Fee",
      value: "monthlyFeeEdit",
      isChecked: permission?.monthlyFeeEdit,
      disabled: false,
    },

    {
      id: 5,
      label: "Package Edit",
      value: "customerMikrotikPackageEdit",
      isChecked: permission?.customerMikrotikPackageEdit,
      disabled: false,
    },
    {
      id: 6,
      label: "Status Edit",
      value: "customerStatusEdit",
      isChecked: permission?.customerStatusEdit,
      disabled: false,
    },
    {
      id: 7,
      label: "Auto Disabled",
      value: "customerAutoDisableEdit",
      isChecked: permission?.customerAutoDisableEdit,
      disabled: false,
    },
    {
      id: 8,
      label: "Area Delete",
      value: "areaDelete",
      isChecked: permission?.areaDelete,
      disabled: false,
    },
    // {
    //   id: 9,
    //   label: "Area Add",
    //   value: "areaAdd",
    //   isChecked: permission?.areaAdd,
    //disabled: false,
    // },
    {
      id: 10,
      label: "Bulk Area Edit",
      value: "bulkAreaEdit",
      isChecked: permission?.bulkAreaEdit,
      disabled: !bpSettings?.bulkAreaEdit,
    },
    {
      id: 11,
      label: "Bulk Status Edit",
      value: "bulkCustomerStatusEdit",
      isChecked: permission?.bulkCustomerStatusEdit,
      disabled: false,
    },
    {
      id: 12,
      label: "Bulk BillingCycle Edit",
      value: "bulkCustomerBillingCycleEdit",
      isChecked: permission?.bulkCustomerBillingCycleEdit,
      disabled: false,
    },
    {
      id: 13,
      label: "Bulk Customer Recharge",
      value: "bulkCustomerRecharge",
      isChecked: permission?.bulkCustomerRecharge,
      disabled: !bpSettings?.bulkCustomerRecharge,
    },
    {
      id: 14,
      label: "Instant Recharge Bill Print",
      value: "instantRechargeBillPrint",
      isChecked: permission?.instantRechargeBillPrint,
      disabled: !bpSettings?.instantRechargeBillPrint,
    },
  ];

  const permissionBn = [
    {
      id: 1,
      label: "কাস্টমার অ্যাড",
      value: "customerAdd",
      isChecked: permission?.customerAdd,
      disabled: false,
    },

    {
      id: 2,
      label: "কাস্টমার এডিট",
      value: "customerEdit",
      isChecked: permission?.customerEdit,
      disabled: false,
    },

    {
      id: 4,
      label: "মাসিক ফি এডিট",
      value: "monthlyFeeEdit",
      isChecked: permission?.monthlyFeeEdit,
      disabled: false,
    },

    {
      id: 5,
      label: "প্যাকেজ এডিট",
      value: "customerMikrotikPackageEdit",
      isChecked: permission?.customerMikrotikPackageEdit,
      disabled: false,
    },
    {
      id: 6,
      label: "স্টাটাস এডিট",
      value: "customerStatusEdit",
      isChecked: permission?.customerStatusEdit,
      disabled: false,
    },
    {
      id: 7,
      label: "অটো ডিসেবল",
      value: "customerAutoDisableEdit",
      isChecked: permission?.customerAutoDisableEdit,
      disabled: false,
    },
    {
      id: 8,
      label: "এরিয়া ডিলিট",
      value: "areaDelete",
      isChecked: permission?.areaDelete,
      disabled: false,
    },
    // {
    //   id: 9,
    //   label: "এড এরিয়া",
    //   value: "areaAdd",
    //   isChecked: permission?.areaAdd,
    //disabled: false,
    // },
    {
      id: 10,
      label: "বাল্ক এরিয়া এডিট",
      value: "bulkAreaEdit",
      isChecked: permission?.bulkAreaEdit,
      disabled: !bpSettings?.bulkAreaEdit,
    },
    {
      id: 11,
      label: "বাল্ক স্ট্যাটাস এডিট",
      value: "bulkCustomerStatusEdit",
      isChecked: permission?.bulkCustomerStatusEdit,
      disabled: false,
    },
    {
      id: 12,
      label: "বাল্ক বিলিং সাইকেল এডিট",
      value: "bulkCustomerBillingCycleEdit",
      isChecked: permission?.bulkCustomerBillingCycleEdit,
      disabled: false,
    },
    {
      id: 13,
      label: "বাল্ক গ্রাহক রিচার্জ",
      value: "bulkCustomerRecharge",
      isChecked: permission?.bulkCustomerRecharge,
      disabled: !bpSettings?.bulkCustomerRecharge,
    },
    {
      id: 14,
      label: "ইনস্ট্যান্ট রিচার্জ বিল প্রিন্ট",
      value: "instantRechargeBillPrint",
      isChecked: permission?.instantRechargeBillPrint,
      disabled: !bpSettings?.instantRechargeBillPrint,
    },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return permissionBn;
  return permissionEn;
};
