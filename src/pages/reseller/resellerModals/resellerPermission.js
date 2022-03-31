export const resellerPermissions = (permission) => {
  
  
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
        value: "viewCustomer",
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
        value: "CustomerMobileEdit",
        label: "মোবাইল পরিবর্তন",
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
        label: "বিল প্রিন্ট",
        isChecked: permission?.billPrint,
      },
    ];
  
    return per;
  };
  