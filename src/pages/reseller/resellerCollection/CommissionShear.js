// admin reseller commission handler function
export const adminResellerCommission = (reseller, data, role) => {
  // single reseller find in customer report data
  const singleReseller =
    role === "ispOwner"
      ? reseller?.find((item) => item.id === data.reseller)
      : reseller;

  // customer bill amount
  let commissionAmount = data.amount;

  // customer bill amount ispOwner commission and reseller commission
  let ispOwnerCommission = 0;
  let resellerCommission = 0;

  if (
    commissionAmount != 0 &&
    data.medium !== "cash" &&
    data.billType === "bill"
  ) {
    // handle packageBased resellers
    if (singleReseller?.commissionType === "packageBased") {
      // find reseller packages rate
      const resellerPackageRate = singleReseller.resellerPackageRates.find(
        (pack) => pack.mikrotikPackage === data.customer.mikrotikPackage
      );

      // check commission style is percentage or fixedRate
      if (singleReseller?.commissionStyle === "percentage") {
        ispOwnerCommission =
          (resellerPackageRate.ispOwnerRate * Number(commissionAmount)) / 100;
        resellerCommission = commissionAmount - ispOwnerCommission;
      }
      if (singleReseller?.commissionStyle === "fixedRate") {
        ispOwnerCommission = resellerPackageRate.ispOwnerRate;
        resellerCommission = commissionAmount - ispOwnerCommission;
      }
    } else if (singleReseller?.commissionType === "global") {
      // handle other resellers
      ispOwnerCommission =
        (singleReseller.commissionRate.isp * Number(commissionAmount)) / 100;
      resellerCommission = commissionAmount - ispOwnerCommission;
    }
  } else {
    ispOwnerCommission = data.ispOwnerCommission;
    resellerCommission = data.resellerCommission;
  }
  // set ispOwner & reseller commission
  return {
    resellerCommission,
    ispOwnerCommission,
  };
};
