export const collectorPermission = (permission) => {
    // currently added 
  // customerAdd(pin):true
  // customerEdit(pin):true
  // customerActivate(pin):true
  // customerDeactivate(pin):true
  // sendSMS(pin):true
  // billPosting(pin):true


//NOt implimented 
  // viewTotalReport(pin):true
  // webLogin(pin):true
  
  //these are not matched with manager
  // viewCustomerList(pin):true//
  // connectionFee(pin):true //
  // customerMobileEdit(pin):true //
  // billPrint(pin):true //

  const per = [
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
      value: "customerDelete",
      label: "গ্রাহক Dekhbe",
      isChecked: permission?.viewCustomerList,
    },
    {
      id: 6,
      value: "billEdit",
      label: "Connection Fee",
      isChecked: permission?.connectionFee, //ToDo
    },
    {
      id: 7,
      value: "monthlyFeeEdit",
      label: "customer Mobile Edit",
      isChecked: permission?.customerMobileEdit, //ToDo
    },
    {
      id: 8,
      value: "sendSMS",
      label: "ম্যাসেজ বোর্ড",
      isChecked: permission?.sendSMS,
    },
    {
      id: 10,
      value: "billPosting",
      label: "বিল পোস্টিং",
      isChecked: permission?.billPosting,
    },
    {
      id: 11,
      value: "billPosting",
      label: "বিল Print",
      isChecked: permission?.billPrint,
    },
  ];

  return per;
};
