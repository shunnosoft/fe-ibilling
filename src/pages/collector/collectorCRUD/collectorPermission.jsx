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
    // {
    //   id: 12,
    //   value: "bulkAreaEdit",
    //   label: "বাল্ক এরিয়া এডিট",
    //   isChecked: permission?.bulkAreaEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkAreaEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkAreaEdit &&
    //       managerPermission?.bulkAreaEdit),
    // },
    // {
    //   id: 13,
    //   value: "bulkStatusEdit",
    //   label: "বাল্ক স্ট্যাটাস এডিট",
    //   isChecked: permission?.bulkStatusEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkStatusEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkStatusEdit &&
    //       managerPermission?.bulkStatusEdit),
    // },
    // {
    //   id: 14,
    //   value: "bulkBillingCycleEdit",
    //   label: "বাল্ক বিলিং সাইকেল এডিট",
    //   isChecked: permission?.bulkBillingCycleEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkBillingCycleEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkBillingCycleEdit &&
    //       managerPermission?.bulkBillingCycleEdit),
    // },
    // {
    //   id: 19,
    //   value: "bulkPromiseDateEdit",
    //   label: "বাল্ক প্রমিজ ডেট এডিট",
    //   isChecked: permission?.bulkPromiseDateEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkPromiseDateEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkPromiseDateEdit &&
    //       managerPermission?.bulkPromiseDateEdit),
    // },
    // {
    //   id: 20,
    //   value: "bulkAutoDisableEdit",
    //   label: "বাল্ক আটো ডিজেবল এডিট",
    //   isChecked: permission?.bulkAutoDisableEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkAutoDisableEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkAutoDisableEdit &&
    //       managerPermission?.bulkAutoDisableEdit),
    // },
    // {
    //   id: 21,
    //   value: "bulkPackageEdit",
    //   label: "বাল্ক প্যকেজ এডিট",
    //   isChecked: permission?.bulkPackageEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkPackageEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkPackageEdit &&
    //       managerPermission?.bulkPackageEdit),
    // },

    // {
    //   id: 22,
    //   value: "bulkCustomerDelete",
    //   label: "বাল্ক গ্রাহক ডিলিট",
    //   isChecked: permission?.bulkCustomerDelete,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkCustomerDelete
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkCustomerDelete &&
    //       managerPermission?.bulkCustomerDelete),
    // },
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
    // {
    //   id: 12,
    //   value: "bulkAreaEdit",
    //   label: "Bulk Area Edit",
    //   isChecked: permission?.bulkAreaEdit,
    //   disabled:
    //     (role === "ispOwner" && ispOwnerPermission?.bulkAreaEdit) ||
    //     (role === "manager" &&
    //       managerPermission?.bulkAreaEdit &&
    //       ispOwnerPermission?.bulkAreaEdit),
    // },
    // {
    //   id: 13,
    //   value: "bulkStatusEdit",
    //   label: "Bulk Status Edit",
    //   isChecked: permission?.bulkStatusEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkStatusEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkStatusEdit &&
    //       managerPermission?.bulkStatusEdit),
    // },
    // {
    //   id: 14,
    //   value: "bulkBillingCycleEdit",
    //   label: "Bulk BillingCycle Edit",
    //   isChecked: permission?.bulkBillingCycleEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkBillingCycleEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkBillingCycleEdit &&
    //       managerPermission?.bulkBillingCycleEdit),
    // },
    // {
    //   id: 19,
    //   value: "bulkPromiseDateEdit",
    //   label: "Bulk Promise Date Edit",
    //   isChecked: permission?.bulkPromiseDateEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkPromiseDateEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkPromiseDateEdit &&
    //       managerPermission?.bulkPromiseDateEdit),
    // },
    // {
    //   id: 20,
    //   value: "bulkAutoDisableEdit",
    //   label: "Bulk Auto Disable Edit",
    //   isChecked: permission?.bulkAutoDisableEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkAutoDisableEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkAutoDisableEdit &&
    //       managerPermission?.bulkAutoDisableEdit),
    // },
    // {
    //   id: 21,
    //   value: "bulkPackageEdit",
    //   label: "Bulk Package Edit",
    //   isChecked: permission?.bulkPackageEdit,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkPackageEdit
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkPackageEdit &&
    //       managerPermission?.bulkPackageEdit),
    // },
    // {
    //   id: 22,
    //   value: "bulkCustomerDelete",
    //   label: "Bulk Customer Delete",
    //   isChecked: permission?.bulkCustomerDelete,
    //   disabled: !(role === "ispOwner"
    //     ? ispOwnerPermission?.bulkCustomerDelete
    //     : role === "manager" &&
    //       ispOwnerPermission?.bulkCustomerDelete &&
    //       managerPermission?.bulkCustomerDelete),
    // },
  ];

  if (localStorage.getItem("netFee:lang") === "bn") return permissionBn;
  return permissionEn;
};
