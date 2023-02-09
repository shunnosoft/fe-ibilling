import apiLink from "../api/apiLink";
import {
  getResellerDataSuccess,
  packageBasedCustomerSuccess,
  packageBasedOtherCustomerSuccess,
  packageBasedPaidCustomerSuccess,
  packageBasedUnpaidCustomerSuccess,
} from "./resellerDataSlice";

export const getResellerData = async (
  ispOwnerId,
  resellerId,
  setIsLoading,
  filterData,
  dispatch
) => {
  setIsLoading(true);
  let year = filterData.year || new Date().getFullYear(),
    month = filterData.month || new Date().getMonth() + 1;
  try {
    const res = await apiLink.get(
      `/reseller/data/${ispOwnerId}/${resellerId}?year=${year}&month=${month}`
    );
    dispatch(getResellerDataSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const getPackageBasedCustomer = async (
  ispOwnerId,
  resellerId,
  packageId,
  year,
  month,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/package-based-customer/${ispOwnerId}/${resellerId}/${packageId}?year=${year}&month=${month}`
    );
    dispatch(packageBasedCustomerSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const getPackageBasedOtherCustomer = async (
  ispOwnerId,
  resellerId,
  packageId,
  year,
  month,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/package-based-other-customer/${ispOwnerId}/${resellerId}/${packageId}?year=${year}&month=${month}`
    );
    dispatch(packageBasedOtherCustomerSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const getPackageBasePaidCustomer = async (
  ispOwnerId,
  resellerId,
  packageId,
  year,
  month,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/package-based-paid-customer/${ispOwnerId}/${resellerId}/${packageId}?year=${year}&month=${month}`
    );
    dispatch(packageBasedPaidCustomerSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const getPackageBaseUnpaidCustomer = async (
  ispOwnerId,
  resellerId,
  packageId,
  year,
  month,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/package-based-unpaid-customer/${ispOwnerId}/${resellerId}/${packageId}?year=${year}&month=${month}`
    );
    dispatch(packageBasedUnpaidCustomerSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};
