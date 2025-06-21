export const collectorPermission = (
  permission,
  role,
  ispOwnerPermission,
  managerPermission
) => {
  console.log(permission);

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
      value: "viewCustomerList",
      label: "গ্রাহক দেখবে",
      isChecked: permission?.viewCustomerList,
      disabled: false,
    },
    {
      id: 4,
      value: "connectionFee",
      label: "কানেকশন ফি",
      isChecked: permission?.connectionFee, //ToDo
      disabled: false,
    },
    {
      id: 5,
      value: "customerMobileEdit",
      label: "মোবাইল পরিবর্তন",
      isChecked: permission?.customerMobileEdit, //ToDo
      disabled: false,
    },
    {
      id: 6,
      value: "sendSMS",
      label: "সিঙ্গেল ম্যাসেজ",
      isChecked: permission?.sendSMS,
      disabled: false,
    },
    {
      id: 7,
      value: "billPosting",
      label: "বিল পোস্টিং",
      isChecked: permission?.billPosting,
      disabled: false,
    },
    {
      id: 8,
      value: "billPrint",
      label: "বিল প্রিন্ট",
      isChecked: permission?.billPrint,
      disabled: false,
    },
    {
      id: 9,
      value: "billDelete",
      label: "বিল ডিলিট",
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
      label: "বাল্ক স্ট্যাটাস এডিট",
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
      label: "ড্যাশবোর্ড কালেকশন",
      isChecked: permission?.dashboardCollectionData,
      disabled: !role === "ispOwner" ? true : false,
    },
    {
      id: 12,
      value: "expenditure",
      label: "খরচ",
      isChecked: permission?.expenditure,
      disabled: !role === "ispOwner" ? true : false,
    },
    {
      id: 13,
      value: "instantRechargeBillPrint",
      label: "ইনস্ট্যান্ট রিচার্জ বিল প্রিন্ট",
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
      label: "বাল্ক পেমেন্ট স্ট্যাটাস এডিট",
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
      label: "গ্রাহক প্যাকেজ আপডেট",
      isChecked: permission?.package,
      disabled: !managerPermission?.package,
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
      value: "customerActivate",
      label: "customerActivate",
      isChecked: permission?.customerActivate || false,
      disabled: false,
    },
    {
      value: "customerDeactivate",
      label: "customerDeactivate",
      isChecked: permission?.customerDeactivate || false,
      disabled: false,
    },
    {
      id: 3,
      value: "viewCustomerList",
      label: "View Customer",
      isChecked: permission?.viewCustomerList,
      disabled: false,
    },
    {
      id: 4,
      value: "connectionFee",
      label: "Connection Fee",
      isChecked: permission?.connectionFee, //ToDo
      disabled: false,
    },
    {
      value: "billingCycleUpdate",
      label: "billingCycleUpdate",
      isChecked: permission?.billingCycleUpdate || false,
      disabled: false,
    },
    {
      id: 5,
      value: "customerMobileEdit",
      label: "Change Mobile Number",
      isChecked: permission?.customerMobileEdit, //ToDo
      disabled: false,
    },
    {
      id: 6,
      value: "sendSMS",
      label: "Single Message",
      isChecked: permission?.sendSMS,
      disabled: false,
    },
    {
      id: 7,
      value: "billPosting",
      label: "Bill Posting",
      isChecked: permission?.billPosting,
      disabled: false,
    },
    {
      id: 8,
      value: "billPrint",
      label: "Print Bill",
      isChecked: permission?.billPrint,
      disabled: false,
    },
    {
      id: 9,
      value: "billDelete",
      label: "Bill Delete",
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
      label: "Bulk Status Edit",
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
      label: "Dashboard Collection",
      isChecked: permission?.dashboardCollectionData,
      disabled: !role === "ispOwner" ? true : false,
    },
    {
      id: 12,
      value: "expenditure",
      label: "Expenditure",
      isChecked: permission?.expenditure,
      disabled: !role === "ispOwner" ? true : false,
    },
    {
      id: 13,
      value: "instantRechargeBillPrint",
      label: "Instant Recharge Bill Print",
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
      label: "Bulk Payment Status Edit",
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
      label: "Customer Package Update",
      isChecked: permission?.package,
      disabled: role === "ispOwner" ? false : !managerPermission?.package,
    },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return permissionBn;
  return permissionEn;
};
