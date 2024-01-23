const customerBillMonth = (customerData, amount) => {
  // current month date
  const date = new Date();
  const monthDate = date.getMonth();

  // twelve month options
  const options = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  let temp = [];

  // customer billing date
  const dataMonth = new Date(customerData?.billingCycle).getMonth();

  if (customerData?.balance === 0 && customerData?.paymentStatus === "unpaid") {
    // month to monthly bill
    temp.push(options[dataMonth]);
  } else if (
    customerData?.balance === 0 &&
    customerData?.paymentStatus === "paid"
  ) {
    // month to monthly bill
    temp.push(options[dataMonth]);
  } else if (
    customerData?.balance >= customerData?.monthlyFee &&
    customerData?.paymentStatus === "paid"
  ) {
    // customer advance monthly bill
    const modVal = Math.floor(customerData?.balance / customerData?.monthlyFee);
    temp.push(options[dataMonth + modVal]);

    if (dataMonth + modVal > 11) {
      const totalMonth = dataMonth + modVal - 12;
      temp.push(options[totalMonth]);
    }
  } else if (
    customerData?.balance < 0 &&
    customerData?.paymentStatus === "unpaid" &&
    (customerData?.status === "active" || customerData?.status === "expired")
  ) {
    // customer privous monthly bill
    const modVal = Math.floor(
      Math.abs(customerData?.balance / customerData?.monthlyFee)
    );

    // customer privous years total due month
    const dueMonth = dataMonth - modVal;

    //find customer privous years dou month
    if (dueMonth < 0) {
      const totalMonth = 12 - Math.abs(dueMonth);

      for (let i = totalMonth; i <= 11; i++) {
        temp.push(options[i]);
      }
    }

    //find customer current years dou month
    if (modVal < 11) {
      for (let i = dueMonth; i <= dataMonth; i++) {
        if (!(i < 0)) {
          temp.push(options[i]);
        }
      }

      // if the customer don't pay the current month bill
      if (amount < customerData?.monthlyFee) {
        temp.splice(temp.length - 1, 1);
      }
    }
  } else if (
    customerData?.balance < 0 &&
    customerData?.paymentStatus === "unpaid" &&
    customerData?.status === "inactive"
  ) {
    // customer privous monthly bill
    const modVal = Math.floor(
      Math.abs(customerData?.balance / customerData?.monthlyFee)
    );

    // customer total due month
    const dueMonth = dataMonth - modVal;

    //find customer privous years dou month
    if (dueMonth < 0) {
      const totalMonth = 12 - Math.abs(dueMonth);

      for (let i = totalMonth; i <= 11; i++) {
        temp.push(options[i]);
      }
    }

    //find customer current years dou month
    if (modVal < 11) {
      for (let i = dueMonth; i <= monthDate; i++) {
        if (!(i < 0)) {
          temp.push(options[i]);
        }
      }
    }
  }

  return temp;
};

export default customerBillMonth;
