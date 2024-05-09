import moment from "moment";

export const handleActiveFilter = (mainData, filterOptions) => {
  let findAnyCustomer = mainData.reduce((acc, c) => {
    const {
      mikrotik,
      mikrotikPackage,
      area,
      subArea,
      poleBox,
      status,
      paymentStatus,
      allCustomer,
      billDayLeft,
      startDate,
      endDate,
      changeCustomer,
    } = filterOptions;
    console.log(allCustomer);

    // make date object
    const billingCycle = new Date(
      moment(c.billingCycle).format("YYYY-MM-DD hh:mm a")
    );

    const promiseDate = new Date(
      moment(c.promiseDate).format("YYYY-MM-DD hh:mm a")
    );

    const billingStartData = new Date(
      moment(startDate).format("YYYY-MM-DD hh:mm a")
    );

    const billingEndData = new Date(
      moment(endDate).format("YYYY-MM-DD hh:mm a")
    );

    // make connection status true or false
    let connectionStatus;
    if (changeCustomer === "true") {
      connectionStatus = false;
    } else if (changeCustomer === "false") {
      connectionStatus = true;
    }

    // make possible conditions objects if the filter value not selected thats return true
    //if filter value exist then compare
    const conditions = {
      mikrotik: mikrotik ? c.mikrotik === mikrotik : true,
      package: mikrotikPackage ? c.mikrotikPackage === mikrotikPackage : true,
      area: area ? c.area === area : true,
      subArea: subArea ? c.subArea === subArea : true,
      poleBox: poleBox ? c.poleBox === poleBox : true,
      status: status ? c.status === status : true,
      paid: paymentStatus ? c.paymentStatus === "paid" : true,
      unpaid: paymentStatus
        ? c.paymentStatus === "unpaid" && c.monthlyFee !== 0
        : true,
      free: paymentStatus ? c.monthlyFee === 0 : true,
      partial: paymentStatus
        ? c.paymentStatus === "unpaid" &&
          c.monthlyFee > c.balance &&
          c.balance > 0
        : true,
      advance: paymentStatus
        ? c.monthlyFee <= c.balance && c.monthlyFee > 0
        : true,
      overDue: paymentStatus
        ? c.paymentStatus === "unpaid" && c.balance < 0
        : true,
      freeUser: allCustomer ? c.monthlyFee === 0 : true,
      nonFreeUser: allCustomer ? c.monthlyFee > 0 : true,
      prepaid: allCustomer ? c.customerBillingType === "prepaid" : true,
      postpaid: allCustomer ? c.customerBillingType === "postpaid" : true,
      billDayLeft: billDayLeft
        ? moment(c.billingCycle).diff(moment(), "days") === Number(billDayLeft)
        : true,
      billingDate:
        startDate && endDate
          ? billingStartData <= billingCycle && billingEndData >= billingCycle
          : true,
      promiseDate:
        changeCustomer === "promiseDate" ? billingCycle < promiseDate : true,
      autoDisable: changeCustomer ? c.autoDisable !== connectionStatus : true,
    };

    //check if condition pass got for next step or is fail stop operation
    //if specific filter option value not exist it will return true

    let isPass = false;

    isPass = conditions["mikrotik"];
    if (!isPass) return acc;

    isPass = conditions["package"];
    if (!isPass) return acc;

    isPass = conditions["area"];
    if (!isPass) return acc;

    isPass = conditions["poleBox"];
    if (!isPass) return acc;

    isPass = conditions["subArea"];
    if (!isPass) return acc;

    isPass = conditions["status"];
    if (!isPass) return acc;

    if (paymentStatus) {
      isPass = conditions[paymentStatus];
      if (!isPass) return acc;
    }

    isPass = conditions[allCustomer];
    if (!isPass) return acc;

    isPass = conditions["billDayLeft"];
    if (!isPass) return acc;

    isPass = conditions["billingDate"];
    if (!isPass) return acc;

    isPass = conditions["promiseDate"];
    if (!isPass) return acc;

    isPass = conditions["autoDisable"];
    if (!isPass) return acc;

    if (isPass) acc.push(c);

    return acc;
  }, []);

  // set filter customer in customer state
  return findAnyCustomer;
};
