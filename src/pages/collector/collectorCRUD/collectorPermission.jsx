export const collectorPermission = (
  permission,
  role,
  ispOwnerPermission,
  managerPermission
) => {
  // const permissionBn = [
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
  //     value: "viewCustomerList",
  //     label: "গ্রাহক দেখবে",
  //     isChecked: permission?.viewCustomerList,
  //     disabled: false,
  //   },
  //   {
  //     id: 4,
  //     value: "connectionFee",
  //     label: "কানেকশন ফি",
  //     isChecked: permission?.connectionFee, //ToDo
  //     disabled: false,
  //   },
  //   {
  //     id: 5,
  //     value: "customerMobileEdit",
  //     label: "মোবাইল পরিবর্তন",
  //     isChecked: permission?.customerMobileEdit, //ToDo
  //     disabled: false,
  //   },
  //   {
  //     id: 6,
  //     value: "sendSMS",
  //     label: "সিঙ্গেল ম্যাসেজ",
  //     isChecked: permission?.sendSMS,
  //     disabled: false,
  //   },
  //   {
  //     id: 7,
  //     value: "billPosting",
  //     label: "বিল পোস্টিং",
  //     isChecked: permission?.billPosting,
  //     disabled: false,
  //   },
  //   {
  //     id: 8,
  //     value: "billPrint",
  //     label: "বিল প্রিন্ট",
  //     isChecked: permission?.billPrint,
  //     disabled: false,
  //   },
  //   {
  //     id: 9,
  //     value: "billDelete",
  //     label: "বিল ডিলিট",
  //     isChecked: permission?.billDelete,
  //     disabled: !(role === "ispOwner"
  //       ? ispOwnerPermission?.reportDelete
  //       : role === "manager" &&
  //         managerPermission?.reportDelete &&
  //         ispOwnerPermission?.reportDelete),
  //   },
  //   {
  //     id: 10,
  //     value: "bulkStatusEdit",
  //     label: "বাল্ক স্ট্যাটাস এডিট",
  //     isChecked: permission?.bulkStatusEdit,
  //     disabled: !(role === "ispOwner"
  //       ? ispOwnerPermission?.bulkStatusEdit
  //       : role === "manager" &&
  //         ispOwnerPermission?.bulkStatusEdit &&
  //         managerPermission?.bulkStatusEdit),
  //   },
  //   {
  //     id: 11,
  //     value: "dashboardCollectionData",
  //     label: "ড্যাশবোর্ড কালেকশন",
  //     isChecked: permission?.dashboardCollectionData,
  //     disabled: !role === "ispOwner" ? true : false,
  //   },
  //   {
  //     id: 12,
  //     value: "expenditure",
  //     label: "খরচ",
  //     isChecked: permission?.expenditure,
  //     disabled: !role === "ispOwner" ? true : false,
  //   },
  //   {
  //     id: 13,
  //     value: "instantRechargeBillPrint",
  //     label: "ইনস্ট্যান্ট রিচার্জ বিল প্রিন্ট",
  //     isChecked: permission?.instantRechargeBillPrint,
  //     disabled: !(role === "ispOwner"
  //       ? ispOwnerPermission?.instantRechargeBillPrint
  //       : role === "manager" &&
  //         ispOwnerPermission?.instantRechargeBillPrint &&
  //         managerPermission?.instantRechargeBillPrint),
  //   },
  //   {
  //     id: 14,
  //     value: "bulkPaymentStatusEdit",
  //     label: "বাল্ক পেমেন্ট স্ট্যাটাস এডিট",
  //     isChecked: permission?.bulkPaymentStatusEdit,
  //     disabled: !(role === "ispOwner"
  //       ? ispOwnerPermission?.bulkPaymentStatusEdit
  //       : role === "manager" &&
  //         ispOwnerPermission?.bulkPaymentStatusEdit &&
  //         managerPermission?.bulkPaymentStatusEdit),
  //   },
  //   {
  //     id: 15,
  //     value: "package",
  //     label: "গ্রাহক প্যাকেজ আপডেট",
  //     isChecked: permission?.package,
  //     disabled: !managerPermission?.package,
  //   },
  // ];

  const permissions = [
    {
      id: 1,
      value: "customerAdd",
      label: "customerAdd",
      isChecked: permission?.customerAdd,
      disabled: false,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "customerEdit",
      isChecked: permission?.customerEdit,
      disabled: false,
    },
    {
      id: 16,
      value: "customerActivate",
      label: "customerActivate",
      isChecked: permission?.customerActivate || false,
      disabled: false,
    },
    {
      id: 17,
      value: "customerDeactivate",
      label: "customerDeactivate",
      isChecked: permission?.customerDeactivate || false,
      disabled: false,
    },
    {
      id: 3,
      value: "viewCustomerList",
      label: "customerList",
      isChecked: permission?.viewCustomerList,
      disabled: false,
    },
    {
      id: 4,
      value: "connectionFee",
      label: "connectionFee",
      isChecked: permission?.connectionFee, //ToDo
      disabled: false,
    },
    {
      id: 18,
      value: "billingCycleUpdate",
      label: "billingCycleUpdate",
      isChecked: permission?.billingCycleUpdate || false,
      disabled: false,
    },
    {
      id: 5,
      value: "customerMobileEdit",
      label: "mobileNumberUpdate",
      isChecked: permission?.customerMobileEdit, //ToDo
      disabled: false,
    },
    {
      id: 6,
      value: "sendSMS",
      label: "sendSMS",
      isChecked: permission?.sendSMS,
      disabled: false,
    },
    {
      id: 7,
      value: "billPosting",
      label: "billPosting",
      isChecked: permission?.billPosting,
      disabled: false,
    },
    {
      id: 8,
      value: "billPrint",
      label: "printInvoiceBill",
      isChecked: permission?.billPrint,
      disabled: false,
    },
    {
      id: 9,
      value: "billDelete",
      label: "billReportDelete",
      isChecked: permission?.billDelete,
      disabled: !(role === "ispOwner"
        ? ispOwnerPermission?.reportDelete
        : role === "manager" &&
          managerPermission?.reportDelete &&
          ispOwnerPermission?.reportDelete),
    },
    {
      id: 10,
      value: "bulkStatusEdit",
      label: "bulkStatusEdit",
      isChecked: permission?.bulkStatusEdit,
      disabled: !(role === "ispOwner"
        ? ispOwnerPermission?.bulkStatusEdit
        : role === "manager" &&
          ispOwnerPermission?.bulkStatusEdit &&
          managerPermission?.bulkStatusEdit),
    },
    {
      id: 11,
      value: "dashboardCollectionData",
      label: "dashboardCollectionData",
      isChecked: permission?.dashboardCollectionData,
      disabled: !role === "ispOwner" ? true : false,
    },
    {
      id: 12,
      value: "expenditure",
      label: "expenditure",
      isChecked: permission?.expenditure,
      disabled: !role === "ispOwner" ? true : false,
    },
    {
      id: 13,
      value: "instantRechargeBillPrint",
      label: "instantRechargeBillPrint",
      isChecked: permission?.instantRechargeBillPrint,
      disabled: !(role === "ispOwner"
        ? ispOwnerPermission?.instantRechargeBillPrint
        : role === "manager" &&
          ispOwnerPermission?.instantRechargeBillPrint &&
          managerPermission?.instantRechargeBillPrint),
    },
    {
      id: 14,
      value: "bulkPaymentStatusEdit",
      label: "bulkPaymentStatusEdit",
      isChecked: permission?.bulkPaymentStatusEdit,
      disabled: !(role === "ispOwner"
        ? ispOwnerPermission?.bulkPaymentStatusEdit
        : role === "manager" &&
          ispOwnerPermission?.bulkPaymentStatusEdit &&
          managerPermission?.bulkPaymentStatusEdit),
    },
    {
      id: 15,
      value: "package",
      label: "customerPackageUpdate",
      isChecked: permission?.package,
      disabled: role === "ispOwner" ? false : !managerPermission?.package,
    },
  ];

  return permissions;
};
