export const managerPermission = (permission) => {
//   accounts: true
// billEdit: false
// billPosting: false
// collectorAdd: false
// collectorEdit: false
// customerActivate: false
// customerAdd: false
// customerDeactivate: false
// customerDelete: false
// customerEdit: false
// fileExport: true
// inventory: true
// monthlyFeeEdit: false
// print: true
// sendSMS: false
// viewCollectorReport: false
// viewCustomerList: true
// viewTotalReport: true
// webLogin: true
   const per= [
    {
      id: 1,
      value: "customerAdd",
      label: "গ্রাহক সংযোগ",
      isChecked: permission.customerAdd,
    },
    {
      id: 2,
      value: "customerEdit",
      label: "গ্রাহক আপডেট",
      isChecked: permission.customerEdit,
    },
    {
      id: 3,
      value: "customerActivate",
      label: "গ্রাহক এক্টিভেট",
      isChecked: permission.customerActivate,
    },
    {
      id: 4,
      value: "customerDeactivate",
      label: "গ্রাহক বন্ধ",
      isChecked: permission.customerDeactivate,
    },
    {
      id: 5,
      value: "customerDelete",
      label: "গ্রাহক ডিলিট",
      isChecked: permission.customerDelete,
    },
    {
      id: 6,
      value: "billEdit",
      label: "বিল আপডেট",
      isChecked:  false,
    },
    {
      id: 7,
      value: "monthlyFeeEdit",
      label: "মাসিক ফি আপডেট",
      isChecked: false,
    },
    {
      id: 8,
      value: "sendSMS",
      label: "ম্যাসেজ বোর্ড",
      isChecked: permission.sendSMS,
    },
    {
      id: 10,
      value: "billPosting",
      label: "বিল পোস্টিং",
      isChecked: permission.billPosting,
    },
    {
      id: 11,
      value: "collectorAdd",
      label: "কালেক্টর অ্যাড",
      isChecked: permission.collectorAdd,
    },
    {
      id: 12,
      value: "collectorEdit",
      label: "কালেক্টর আপডেট",
      isChecked: permission.collectorEdit,
    },
    {
      id: 13,
      value: "viewCollectorReport",
      label: "কালেক্টর রিপোর্ট দেখবে",
      isChecked: permission.viewCollectorReport,
    },
  ];

  return per ; 
};
