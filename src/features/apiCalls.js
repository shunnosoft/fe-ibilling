import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import {
  getMultipleManagerSuccess,
  managerAddSuccess,
  managerDeleteSuccess,
  managerEditSuccess,
  managerFetchFailure,
  managerFetchStart,
  managerFetchSuccess,
} from "./managerSlice";
import { hideModal } from "./actions/managerHandle";
import {
  AddAreaSuccess,
  AddPoleBoxSuccess,
  AddSubAreaSuccess,
  DeleteAreaSuccess,
  DeleteSubAreaSuccess,
  EditAreaSuccess,
  EditPoleBoxSuccess,
  EditSubAreaSuccess,
  FetchAreaSuccess,
} from "./areaSlice";
import {
  addCollectorSuccess,
  deleteCollectorSuccess,
  editCollectorSuccess,
  getCollectorAllPrevBalance,
  getCollectorBills,
  getCollectorReportSuccess,
  getCollectorSuccess,
} from "./collectorSlice";
import {
  addCustomerSuccess,
  deleteCustomerSuccess,
  editCustomerSuccess,
  getCustomerSuccess,
  updateBalance,
  getStaticCustomerSuccess,
  editStaticCustomerSuccess,
  addStaticCustomerSuccess,
  deleteStaticCustomerSuccess,
  updateBalanceStaticCustomer,
  getStaticCustomerActiveSuccess,
  getDueCustomerSuccess,
  getStaticDueCustomerSuccess,
  getFireWllFilterIpDrop,
  updateFireWallFilterIpDrop,
  postFireWllFilterIpDrop,
  getSearchCustomer,
  getNewCustomerSuccess,
  getCustomerConnectionFeeDue,
} from "./customerSlice";
import {
  mtkIsLoading,
  addMikrotikSuccess,
  deleteMikrotikSuccess,
  deletepppoePackageSuccess,
  editMikrotikSuccess,
  editpppoePackageSuccess,
  fetchMikrotikSyncUserSuccess,
  getMikrotikSuccess,
  getPackagefromDatabaseSuccess,
  getpppoeActiveUserSuccess,
  getpppoePackageSuccess,
  getpppoeUserSuccess,
  resetPackagefromDatabase,
  resetpppoeActiveUser,
  resetpppoePackage,
  resetpppoeUser,
  fetchMikrotikSyncSimpleQueueUserSuccess,
  getMikrotikSystemResourceSuccess,
} from "./mikrotikSlice";
import {
  addResellerSuccess,
  deleteResellerSuccess,
  editResellerforRecharge,
  editResellerSuccess,
  getResellerCollectionReport,
  getResellerrSuccess,
} from "./resellerSlice";
import {
  setBpsetting,
  updateProfile,
  setIspOwnerData,
  updateUserData,
} from "./authSlice";
import {
  getAllBillsSuccess,
  getDepositSuccess,
  getmyDepositSucces,
  getTotalBalanceSuccess,
  updateDepositSuccess,
  addDepositSucces,
  getCollectorDeposite,
  editBillReportSuccess,
  getIspOwnerCustomerInvoice,
  getCustomerInvoice,
  updateCustomerInvoice,
  deleteCustomerInvoice,
  getDepositReportSuccess,
  updateDepositReportSuccess,
  getCustomerBillReport,
  deleteCustomerBillReport,
  deleteBillReportSuccess,
  getCustomersWebhookMessageSuccess,
  getAllWebhookMessageSuccess,
  updateReferenceIDSuccess,
  getPendingDepositSuccess,
  deleteDepositSuccess,
} from "./paymentSlice";
import {
  getChartSuccess,
  getCardDataSuccess,
  getDashboardOverViewData,
  getBelowAdminCardData,
  getBelowManagerCardData,
  getBelowCollectorCardData,
  getBelowResellerCardData,
  getDashboardOverViewCustomerData,
  getDashboardOverviewManagerCustomerDataSuccess,
  getDashboardOverviewManagerCollectionDataSuccess,
} from "./chartsSlice";
import {
  getAllRechargeHistory,
  historyEditSuccess,
  prevMonthReportSlice,
  resellerRechargeHistorySlice,
} from "./rechargeSlice";
import {
  getInvoiceListSuccess,
  getUnpaidInvoiceSuccess,
  invoiceDelete,
} from "./invoiceSlice";
import { showModal } from "./uiSlice";
import {
  addPackageSuccess,
  editPackageSuccess,
  deletePackageSuccess,
  getpackageSuccess,
  getAllPackagesSuccess,
  getPppoePackages,
} from "./packageSlice";
import {
  addExpenditureSectorsSuccess,
  addExpenditureSuccess,
  deleteExpenditureSuccess,
  editExpenditureSectorsSuccess,
  editExpenditureSuccess,
  getExpenditureSectorsSuccess,
  getExpenditureSuccess,
} from "./expenditureSlice";
import { deleteReCustomer } from "./resellerCustomerAdminSlice";
import { userLogout } from "./actions/authAsyncAction";
import { createNote, getNotesSuccess } from "./customerNoteSlice";
import {
  AddNetFeeSupport,
  deleteBulletinSuccess,
  deleteIspOwnerSupports,
  deleteNetFeeSupport,
  deleteSupportNumbers,
  getBulletinSuccess,
  getIspOwnerPackageChangeRequest,
  getIspOwnerSupports,
  getNetFeeSupport,
  getSupportCall,
  getSupportNumbers,
  patchBulletinSuccess,
  postBulletinSuccess,
  postIspOwnerSupports,
  postSupportNumbers,
  updateIspOwnerSupports,
  updateNetFeeSupport,
  updatePackageChangeRequest,
  updateSupportNumbers,
} from "./netFeeSupportSlice";
import {
  getActiveCustomerSuccess,
  getDiscountCustomerSuccess,
  getExpiredCustomerSuccess,
  getFreeCustomerSuccess,
  getInactiveCustomerSuccess,
  getIspOwnerCollectorSuccess,
  getIspOwnerManagerSuccess,
  getIspOwnerResellerSuccess,
  getPaidCustomerSuccess,
  getUnpaidCustomerSuccess,
} from "./dashboardInformationSlice";
import { Flag } from "react-bootstrap-icons";
import {
  deleteMikrotikCustomerSuccess,
  deleteNetFeeCustomerSuccess,
  getMikrotikCustomerSuccess,
  getMikrotikStaticCustomerSuccess,
  getNetFeeCustomerSuccess,
  getNetFeeStaticCustomerSuccess,
} from "./customerCrossCheckSlice";
import { updatePermissionSuccess } from "./adminNetFeeSupportSlice";
import axios from "axios";
import { config } from "../config";
import {
  deleteNetworkDeviceSuccess,
  getNetworkDeviceOutputSuccess,
  getNetworkDeviceSuccess,
  getNetworkDiagramDeviceSuccess,
  postNetworkDeviceSuccess,
  updateNetworkDeviceSuccess,
  updateNetworkDiagramDeviceSuccess,
} from "./network.slice";
import { data } from "jquery";

const netFeeLang = localStorage.getItem("netFee:lang");

const langMessage = (color, bangla, english) => {
  // Notification for english language for
  if (netFeeLang === "bn") {
    if (color === "success") {
      return toast.success(bangla);
    } else {
      return toast.error(bangla);
    }
  }
  // Notification for Bangla language
  if (netFeeLang === "en") {
    if (color === "success") {
      return toast.success(english);
    } else {
      return toast.error(english);
    }
  }
};

//manager
export const getManger = async (dispatch, ispWonerId) => {
  dispatch(managerFetchStart());
  try {
    const res = await apiLink.get(`/ispOwner/managers/${ispWonerId}`);
    dispatch(managerFetchSuccess(res.data));
  } catch (error) {
    dispatch(managerFetchFailure());
    toast.error(error.response?.data?.message);
  }
};

export const getManagerDashboardCharts = async (
  setLoading,
  dispatch,
  managerId,
  year,
  month,
  collectorId
) => {
  try {
    const plusMonth = Number(month) + 1;
    setLoading(true);
    const res = await apiLink(
      `dashboard/manager/chart-data/${managerId}?year=${year}&month=${plusMonth}&user=${collectorId}`
    );
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
    toast.error(err.response?.data?.message);
  }
  setLoading(false);
};

export const getCollectorDashboardCharts = async (
  setLoading,
  dispatch,
  collectorId,
  year,
  month
) => {
  const plusMonth = Number(month) + 1;
  try {
    setLoading(true);
    const res = await apiLink(
      `dashboard/collector/chart-data/${collectorId}?year=${year}&month=${plusMonth}`
    );
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
    toast.error(err.response?.data?.message);
  }
  setLoading(false);
};

export const getCharts = async (dispatch, ispOwnerId, year, month, user) => {
  try {
    let link = `/dashboard/${ispOwnerId}?year=${year}&month=${month}`;
    if (user)
      link = `/dashboard/${ispOwnerId}?year=${year}&month=${month}&user=${user}`;
    const res = await apiLink(link);
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
  }
};

export const getIspOwnerCharts = async (
  setIsloading,
  dispatch,
  ispOwnerId,
  year,
  month,
  collectorId
) => {
  const plusMonth = Number(month) + 1;

  try {
    setIsloading(true);
    const res = await apiLink(
      `dashboard/ispOwner/chart-data/${ispOwnerId}?year=${year}&month=${plusMonth}&user=${collectorId}`
    );
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

//
export const getChartsReseller = async (
  dispatch,
  resellerId,
  filterData,
  user,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink(
      `/dashboard/reseller/chart-data/${resellerId}?year=${filterData.year}&month=${filterData.month}&user=${user}`
    );
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

// Reseller Collector dashboard chart data
export const getChartsResellerCollector = async (
  dispatch,
  collectorId,
  filterData,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink(
      `/dashboard/reseller-collector/chart-data/${collectorId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

export const getDashboardCardData = async (
  dispatch,
  setIsloading,
  ispOwnerId,
  resellerId,
  collector,
  filterData = {}
) => {
  if (!collector) collector = "";
  let year = filterData.year || new Date().getFullYear(),
    month = filterData.month || new Date().getMonth() + 1;
  let link = resellerId
    ? `/dashboard/reseller/card/${resellerId}?collector=${collector}&year=${year}&month=${month}`
    : `/dashboard/card/${ispOwnerId}?collector=${collector}&year=${year}&month=${month}`;

  try {
    setIsloading(true);
    const res = await apiLink(link);

    dispatch(getCardDataSuccess(res.data));
  } catch (err) {
    console.log("Card data error: ", err);
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

export const getIspOwnerDashboardCardData = async (
  dispatch,
  setIsloading,
  ispOwnerId,
  filterData = {}
) => {
  let year = filterData.year || new Date().getFullYear(),
    month = filterData.month || new Date().getMonth() + 1;

  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/ispOwner/${ispOwnerId}?year=${year}&month=${month}`
    );
    dispatch(getCardDataSuccess(res.data));
  } catch (err) {
    console.log("Card data error: ", err);
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get dashboard overview collection data
export const getIspOwnerDashboardOverViewData = async (
  dispatch,
  setDashboardLoading,
  ispOwnerId,
  filterData
) => {
  try {
    setDashboardLoading(true);
    const res = await apiLink(
      `/dashboard/bill-overview/${ispOwnerId}?year=${filterData.year}&month=${filterData.month}`
    );

    dispatch(getDashboardOverViewData(res.data));
    setDashboardLoading(false);
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
};

// get dashboard overview customer data
export const getIspOwnerDashboardOverViewCustomerData = async (
  dispatch,
  setDashboardLoading,
  ispOwnerId,
  filterData
) => {
  try {
    setDashboardLoading(true);
    const res = await apiLink(
      `/dashboard/customer-overview/${ispOwnerId}?year=${filterData.year}&month=${filterData.month}`
    );

    localStorage.setItem("webhook", res?.data.customers);
    dispatch(getDashboardOverViewCustomerData(res.data));
    setDashboardLoading(false);
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
};

// get dashboard below admin card data
export const getDashboardBelowIspOwnerCardData = async (
  dispatch,
  setIsloading,
  ispOwnerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/ispOwner/data/${ispOwnerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getBelowAdminCardData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get dashboard below manager card data
export const getDashboardBelowManagerCardData = async (
  dispatch,
  setIsloading,
  ispOwnerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/manager/data/${ispOwnerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getBelowManagerCardData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get dashboard below collector card data
export const getDashboardBelowCollectorCardData = async (
  dispatch,
  setIsloading,
  ispOwnerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/collector/data/${ispOwnerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getBelowCollectorCardData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get dashboard below collector card data
export const getDashboardBelowResellerCardData = async (
  dispatch,
  setIsloading,
  ispOwnerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/reseller/data/${ispOwnerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getBelowResellerCardData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get reseller dashboard over view
export const getResellerDashboardOverViewData = async (
  dispatch,
  setIsloading,
  resellerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/reseller/customer/${resellerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getDashboardOverViewData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get reseller collector below card data
export const getResellerCollectorBwlowCardData = async (
  dispatch,
  setIsloading,
  resellerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/reseller/collector/${resellerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getBelowCollectorCardData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get reseller collector dashboard over view
export const getResellerCollectorDashboardOverViewData = async (
  dispatch,
  setIsloading,
  collectorId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/reseller-collector/${collectorId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getDashboardOverViewData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get manager dashboard below card data
export const getManagerDashboardCardData = async (
  dispatch,
  setIsloading,
  managerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/manager/${managerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getCardDataSuccess(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get manager dashboard collection overview card data
export const getManagerDashboardCollectionOverviewData = async (
  dispatch,
  setIsloading,
  managerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/manager/collection-overview/${managerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getDashboardOverviewManagerCollectionDataSuccess(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get manager dashboard customer overview card data
export const getManagerDashboardCustomerOverviewData = async (
  dispatch,
  setIsloading,
  managerId,
  filterData
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/manager/customer-overview/${managerId}?year=${filterData.year}&month=${filterData.month}`
    );
    dispatch(getDashboardOverviewManagerCustomerDataSuccess(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

// get manager dashboard overview card
export const getManagerDashboardOverViewCardData = async (
  dispatch,
  setIsloading,
  managerId,
  filterDate
) => {
  setIsloading(true);
  try {
    const res = await apiLink(
      `/dashboard/manager/customer/${managerId}?year=${filterDate.year}&month=${filterDate.month}`
    );
    dispatch(getDashboardOverViewData(res.data));
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

export const getCollectorDashboardCardData = async (
  dispatch,
  setIsloading,
  collectorId,
  filterData = {}
) => {
  let year = filterData.year || new Date().getFullYear(),
    month = filterData.month || new Date().getMonth() + 1;
  try {
    setIsloading(true);
    const res = await apiLink(
      `/dashboard/collector/${collectorId}?year=${year}&month=${month}`
    );
    dispatch(getCardDataSuccess(res.data));
  } catch (err) {
    console.log("Card data error: ", err);
    toast.error(err.response?.data?.message);
  }
  setIsloading(false);
};

export const getInactiveCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/inactive/customer/${ispOwnerId}?month=${month}&year=${year}`
    );
    dispatch(getInactiveCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.response?.data?.message);
  }
  setIsLoading(false);
};

//get expired customer
export const getExpiredCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/expired/customer/${ispOwnerId}?month=${month}&year=${year}`
    );
    dispatch(getExpiredCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }

  setIsLoading(false);
};

//get free customer
export const getFreeCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/free/customer/${ispOwnerId}?month=${month}&year=${year}`
    );
    dispatch(getFreeCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }

  setIsLoading(false);
};

//get paid customer
export const getPaidCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/paid/customer/${ispOwnerId}?month=${month}&year=${year}`
    );
    dispatch(getPaidCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }

  setIsLoading(false);
};

// get unpaid customer
export const getUnpaidCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/unpaid/customer/${ispOwnerId}?month=${month}&year=${year}`
    );
    dispatch(getUnpaidCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }

  setIsLoading(false);
};

// get unpaid customer
export const getActiveCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/active/customer/${ispOwnerId}?month=${month}&year=${year}`
    );
    dispatch(getActiveCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }

  setIsLoading(false);
};

export const getIspOwnerReseller = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `dashboard/reseller/state/${ispOwnerId}?year=${year}&month=${month}`
    );
    dispatch(getIspOwnerResellerSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }
  setIsLoading(false);
};

// get all manager data
export const getIspOwnerManager = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `dashboard/manager/state/${ispOwnerId}?year=${year}&month=${month}`
    );
    dispatch(getIspOwnerManagerSuccess(res.data));
  } catch (error) {
    console.log(error.response?.data?.message);
  }
  setIsLoading(false);
};

export const getIspOwnerCollector = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `dashboard/collector/state/${ispOwnerId}?year=${year}&month=${month}`
    );
    console.log(res.data);
    dispatch(getIspOwnerCollectorSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }
  setIsLoading(false);
};

export const addManager = async (
  dispatch,
  addStaffStatus,
  managerData,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(
      `/ispOwner/manager?addStaff=${addStaffStatus}`,
      managerData
    );

    dispatch(managerAddSuccess(res.data));
    setShow(false);
    langMessage(
      "success",
      "ম্যানেজার সংযুক্ত সফল হয়েছে",
      "Manager Create Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const deleteManager = async (
  dispatch,
  setIsLoading,
  ispOwnerId,
  managerId
) => {
  await apiLink({
    url: `/ispOwner/manager/${ispOwnerId}`,
    method: "DELETE",
  })
    .then((res) => {
      dispatch(managerDeleteSuccess(res.data));
      // window.location.reload();
    })
    .catch((error) => {
      toast.error(error.message);
    });
};

export const editManager = async (
  dispatch,
  managerData,
  managerId,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  await apiLink({
    url: `/ispOwner/update-manager/${managerData.ispOwner}/${managerId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: managerData,
  })
    .then((res) => {
      dispatch(managerEditSuccess(res.data));
      hideModal();

      langMessage(
        "success",
        "ম্যানেজার আপডেট সফল হয়েছে",
        "Manager Updated Successfully"
      );

      setShow(false);
    })
    .catch((err) => {
      if (err.response) {
        langMessage(
          "error",
          err.response?.data?.message,
          err.response?.data?.message
        );
      }
    });
  setIsLoading(false);
};

//Areas
export const getArea = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);

    const res = await apiLink.get(`/ispOwner/area/v2/${ispOwnerId}`);
    dispatch(FetchAreaSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
  setIsLoading(false);
};

export const addArea = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/ispOwner/area", data);
    dispatch(AddAreaSuccess(res.data));
    setShow(false);
    langMessage("success", "এরিয়া সংযুক্ত সফল হয়েছে", "Area Add Successfully");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};
export const editArea = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/area/${data.ispOwner}/${data.id}`,
      data
    );
    dispatch(EditAreaSuccess(res.data));
    setShow(false);
    langMessage("success", "এরিয়া এডিট সফল হয়েছে", "Area Updated Successfully");
  } catch (error) {
    langMessage("error", "এরিয়া এডিট সফল হয়নি", "Area Update Failed");
  }
  setIsLoading(false);
};

export const deleteArea = async (dispatch, data, setIsLoading) => {
  try {
    await apiLink.delete(`/ispOwner/area/${data.ispOwner}/${data.id}`);
    dispatch(DeleteAreaSuccess(data.id));
    setIsLoading(false);
    langMessage(
      "success",
      "এরিয়া ডিলিট সফল হয়েছে",
      "Area Deleted Successfully"
    );
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response.data.message);
  }
};

//subarea

export const addSubArea = async (dispatch, data, setIsLoading, setPostShow) => {
  setIsLoading(false);
  try {
    const res = await apiLink.post("/ispOwner/subArea", data);

    dispatch(AddSubAreaSuccess(res.data));
    setPostShow(false);
    langMessage(
      "success",
      "সাব-এরিয়া সংযুক্ত সফল হয়েছে",
      "Sub-Area Added Successfully"
    );
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//Pole Box Post

export const addPoleBox = async (dispatch, data, setIsLoading, setPostShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/ispOwner/poleBox/post", data);

    dispatch(AddPoleBoxSuccess(res.data));
    setPostShow(false);
    langMessage(
      "success",
      "পোল বক্স সংযুক্ত সফল হয়েছে",
      "Pole Box Added Successfully"
    );
  } catch (error) {
    document.querySelector("#poleBoxPostModal").click();
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const addPoleBox2 = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/ispOwner/poleBox/post", data);

    dispatch(AddPoleBoxSuccess(res.data));
    document.querySelector("#poleBoxAdd2").click();
    langMessage(
      "success",
      "পোল বক্স সংযুক্ত সফল হয়েছে",
      "Pole Box Added Successfully"
    );
  } catch (error) {
    document.querySelector("#poleBoxAdd2").click();
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

// PATCH sub area
export const editSubArea = async (
  dispatch,
  data,
  setIsLoading,
  setEditShow
) => {
  setIsLoading(true);
  const { ispOwnerID, id, ...rest } = data;
  await apiLink({
    url: `/ispOwner/subArea/${ispOwnerID}/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(EditSubAreaSuccess(res.data));
      setEditShow(false);
      langMessage(
        "success",
        "সাব-এরিয়া আপডেট সফল হয়েছে",
        "Sub-Area Updated Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.message);
    });
  setIsLoading(false);
};

// PATCH Pole Box
export const editPoleBox = async (
  dispatch,
  sendingData,
  ispOwnerId,
  poleId,
  setIsLoading,
  setEditShow
) => {
  setIsLoading(true);
  await apiLink({
    url: `/ispOwner/poleBox/update/${ispOwnerId}/${poleId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: sendingData,
  })
    .then((res) => {
      dispatch(EditPoleBoxSuccess(res.data));
      setEditShow(false);
      langMessage(
        "success",
        "পোল বক্স আপডেট সফল হয়েছে",
        "Pole Box Updated Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.message);
    });
  setIsLoading(false);
};

// DELETE sub area
export const deleteSubArea = async (dispatch, data, setIsLoading) => {
  const { ispOwnerId, subAreaId, areaId } = data;
  setIsLoading(true);
  try {
    const res = await apiLink.delete(
      `/ispOwner/subArea/${ispOwnerId}/${subAreaId}`
    );
    if (res) {
      dispatch(DeleteSubAreaSuccess({ areaId, subAreaId }));
      langMessage(
        "success",
        "সাব-এরিয়া ডিলিট সফল হয়েছে",
        "Sub-Area Deleted Successfully"
      );
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
  setIsLoading(false);
};

// Collector

export const getCollector = async (dispatch, ispOwnerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/ispOwner/collector/${ispOwnerId}`);
    dispatch(getCollectorSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const collectorAllPrevBalance = async (
  dispatch,
  collectorId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/deposit/all-previous-balance/${collectorId}`
    );
    dispatch(getCollectorAllPrevBalance(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const addCollector = async (
  dispatch,
  data,
  setIsLoading,
  addStaffStatus,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(
      `ispOwner/collector?addStaff=${addStaffStatus}`,
      data
    );

    dispatch(addCollectorSuccess(res.data));
    langMessage(
      "success",
      "কালেক্টর সংযুক্ত সফল হয়েছে",
      "Collector Added Successfully"
    );
    setShow(false);
  } catch (err) {
    toast.error(err.message);
  }
  setIsLoading(false);
};

export const editCollector = async (dispatch, data, setIsLoading, setShow) => {
  const { ispOwnerId, collectorId, ...rest } = data;
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `ispOwner/collector/${ispOwnerId}/${collectorId}`,
      rest
    );
    dispatch(editCollectorSuccess(res.data));

    langMessage(
      "success",
      "কালেক্টর এডিট সফল হয়েছে",
      "Collector Updated Successfully"
    );
    setShow(false);
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const deleteCollector = async (
  dispatch,
  setIsDeleting,
  ispOwnerId,
  collectorId
) => {
  setIsDeleting(true);
  try {
    await apiLink.delete(`ispOwner/collector/${ispOwnerId}/${collectorId}`);
    dispatch(deleteCollectorSuccess(collectorId));
    langMessage(
      "success",
      "কালেক্টর ডিলিট সফল হয়েছে",
      "Collector Deleted Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsDeleting(false);
};

export const getCollectorBillReport = async (
  collectorId,
  year,
  month,
  dispatch,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/collector-bill-report/${collectorId}?year=${year}&month=${month}`
    );
    dispatch(getCollectorReportSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//Customers
export const getAllCustomerCount = async (ispOwner, setCustomerCount) => {
  try {
    const res = await apiLink.get(`/ispOwner/customer/count/${ispOwner}`);
    setCustomerCount(res.data);
  } catch (error) {
    console.log(error.message);
  }
};

//Customers
export const getCustomer = async (dispatch, ispOwner, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/ispOwner/customer/${ispOwner}`);
    dispatch(getCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
  setIsloading(false);
};

//customer connection fee api
export const getConnectionFee = async (dispatch, customerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/connection-fee/${customerId}`);
    dispatch(getCustomerConnectionFeeDue(res.data.amount));
  } catch (error) {
    console.log(error.message);
  }
};

export const getNewCustomer = async (
  dispatch,
  ispOwner,
  year,
  month,
  setIsloading
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/new/customer/${ispOwner}?year=${year}&month=${month}`
    );
    dispatch(getNewCustomerSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
  setIsloading(false);
};

export const addCustomerNote = async (
  dispatch,
  setIsLoading,
  data,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/ispOwner/addNote`, data);
    dispatch(createNote(res.data));
    setShow(false);
    langMessage("success", "নোট সংযুক্ত সফল হয়েছে", "Note Added Successfully");
  } catch (error) {
    console.log(error.message);
  }
  setIsLoading(false);
};

export const getCustomerNotes = async (dispatch, setIsLoading, customerId) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/ispOwner/getNotes/${customerId}`);
    dispatch(getNotesSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
  setIsLoading(false);
};

// get due Customers
export const getDueCustomer = async (
  dispatch,
  ispOwner,
  month,
  year,
  setIsloading
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(
      `/customer/due/${ispOwner}?month=${month}&year=${year}`
    );
    dispatch(getDueCustomerSuccess(res.data.customers));
  } catch (error) {
    console.log(error.message);
  }
  setIsloading(false);
};

//Static Customers
export const getStaticCustomer = async (dispatch, ispOwner, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/ispOwner/static-customer/${ispOwner}`);
    dispatch(getStaticCustomerSuccess(res.data));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

//Static Customers
export const getStaticActiveCustomer = async (
  dispatch,
  ispOwnerId,
  mikrotikId,
  setIsloading
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(
      `mikrotik/arpList/${ispOwnerId}/${mikrotikId}`
    );
    dispatch(getStaticCustomerActiveSuccess(res.data.arpList));
  } catch (error) {
    console.log(error.response.data.message);
  }
  setIsloading(false);
};

export const addCustomer = async (
  dispatch,
  data,
  setIsloading,
  resetForm,
  setShow
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post("/ispOwner/customer", data);
    dispatch(addCustomerSuccess(res.data));
    langMessage(
      "success",
      "কাস্টমার সংযুক্ত সফল হয়েছে",
      "Customer Added Successfully"
    );
    setShow(false);
    resetForm();
  } catch (err) {
    toast.error(err.message);
  }
  setIsloading(false);
};

// customer profile update api
export const editCustomer = async (
  dispatch,
  data,
  setIsloading,
  setShow,
  status
) => {
  const { singleCustomerID, ispOwner, ...sendingData } = data;
  setIsloading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/customer/${ispOwner}/${singleCustomerID}`,
      sendingData
    );
    if (data?.queue?.name) {
      dispatch(editStaticCustomerSuccess(res.data));
    } else {
      dispatch(editCustomerSuccess(res.data));
    }

    if (status === "auto") {
      langMessage(
        "success",
        "কাস্টমার আটো ডিজেবল আপডেট সফল হয়েছে",
        "Customer Auto Disable Updated Successfully"
      );
    } else if (status === "status") {
      langMessage(
        "success",
        "কাস্টমার স্টাটাস আপডেট সফল হয়েছে",
        "Customer Status Updated Successfully"
      );
    } else {
      langMessage(
        "success",
        "কাস্টমার এডিট সফল হয়েছে",
        "Customer Updated Successfully"
      );
    }
    setShow(false);
  } catch (error) {
    toast.error(error.message);
  }
  setIsloading(false);
};

export const deleteACustomer = async (
  dispatch,
  data,
  setIsLoading,
  isResellerCustomer = false,
  setShow
) => {
  setIsLoading(true);
  try {
    await apiLink.delete(
      `/ispOwner/customer/${data.ispID}/${data.customerID}?mikrotik=${data.mikrotik}`
    );

    // delete customer from owner
    if (data.userType === "pppoe") {
      dispatch(deleteCustomerSuccess(data.customerID));
    } else {
      dispatch(deleteStaticCustomerSuccess(data.customerID));
    }

    // delete customer from reseller
    isResellerCustomer && dispatch(deleteReCustomer(data.customerID));

    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );

    setShow(false);
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const deleteStaticCustomerApi = async (
  dispatch,
  data,
  setIsLoading,
  isResellerCustomer = false
) => {
  try {
    setIsLoading(true);
    await apiLink.delete(
      `/ispOwner/customer/${data.ispID}/${data.customerID}?mikrotik=${data.mikrotik}`
    );
    dispatch(deleteStaticCustomerSuccess(data.customerID));
    isResellerCustomer && dispatch(deleteReCustomer(data.customerID));
    document.querySelector("#staticCustomerDelete").click();

    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const deleteNetFeeCustomer = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    await apiLink.delete(
      `/ispOwner/customer/${data.ispID}/${data.customerID}?mikrotik=${data.mikrotik}`
    );
    dispatch(deleteNetFeeCustomerSuccess(data.customerID));
    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const deleteMikrotikCustomer = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    await apiLink.delete(
      `/ispOwner/mikrotik-customer-delete/${data.ispOwnerId}/${data.mikrotikId}?name=${data.name}`
    );
    dispatch(deleteMikrotikCustomerSuccess(data.name));
    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

// get Mikrotik Sync user
export const fetchMikrotikSyncUser = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  await apiLink({
    method: "POST",
    url: `/mikrotik/customer/${data.ispOwner}/${
      data.mikrotikId
    }?inActiveCustomer=${data.inActiveCustomer}&&isSelected=${true}`,
    data: { customers: data.customers },
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncUserSuccess(res.data));
      setIsLoading(false);
      setShow(false);
      langMessage(
        "success",
        "মাইক্রোটিক থেকে PPPoE গ্রাহক সিঙ্ক সফল হয়েছে",
        "PPPoE Customer sync from Mikrotik is successful"
      );
    })
    .catch((error) => {
      setIsLoading(false);
      toast.error(error.response?.data.message);
    });
};

// get Mikrotik Sync user
export const syncMikrotikStaticUser = async (
  dispatch,
  data,
  setIsLoading,
  setInActiveCustomer,
  setShow
) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/sync/static/customer/${data.ispOwner}/${data.mikrotikId}?inActiveCustomer=${data.inActiveCustomer}`,
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncSimpleQueueUserSuccess(res.data));
      setShow(false);
      langMessage(
        "success",
        "মাইক্রোটিক থেকে স্ট্যাটিক গ্রাহক সিঙ্ক সফল হয়েছে",
        "Static Customer Sync form Mikrotik is Successful"
      );
    })
    .catch((error) => {
      toast.error(error.response?.data.message);
    });
  setIsLoading(false);
};

// get Mikrotik Sync user
export const testFireWallApi = async (setIsLoading, data) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/syncSimpleQueueToFirewallFilterRule/${data.ispOwner}/${data.mikrotikId}`,
  })
    .then((res) => {
      // dispatch(fetchMikrotikSyncSimpleQueueUserSuccess(res.data));
      console.log(res.data);
      langMessage(
        "success",
        "মাইক্রোটিক থেকে স্ট্যাটিক গ্রাহক সিঙ্ক সফল হয়েছে",
        "Static Customer Sync form Mikrotik is Successful"
      );
    })
    .catch((error) => {
      toast.error(error.response?.data.message);
    });
  setIsLoading(false);
};

// GET mikrotik
export const fetchMikrotik = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await apiLink({
      method: "GET",
      url: `/mikrotik/${ispOwnerId}`,
    });
    dispatch(getMikrotikSuccess(response.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

// POST mikrotik
export const postMikrotik = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  await apiLink({
    url: "/mikrotik",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  })
    .then((res) => {
      dispatch(addMikrotikSuccess(res.data));
      setShow(false);
      langMessage(
        "success",
        "মাইক্রোটিক সংযুক্ত সফল হয়েছে",
        "Mikrotik Connected Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.message);
    });
  setIsLoading(false);
};

// GET mikrotik connection check api function
export const getMikrotikConnectionCheck = async (
  ispOwner,
  mikrotik,
  name,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    await apiLink.get(`/mikrotik/testConnection/${ispOwner}/${mikrotik}`);

    toast.success(`${name} এর কানেকশন ঠিক আছে`);
  } catch (error) {
    toast.error(`দুঃখিত, ${name} এর কানেকশন ঠিক নেই!`);
  }
  setIsLoading(false);
};

// GET mikrotik system resource api function
export const getMikrotikSystemResource = async (
  dispatch,
  ispOwner,
  mikrotik,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/mikrotik/testConnection/${ispOwner}/${mikrotik}`
    );

    dispatch(getMikrotikSystemResourceSuccess(res.data?.resource));
  } catch (error) {
    toast.error(error.response.data.message);
  }
  setIsLoading(false);
};

// PATCH mikrotik
export const editSingleMikrotik = async (dispatch, data, setShow) => {
  const { ispId, id, ...rest } = data;

  await apiLink({
    url: `/mikrotik/${ispId}/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(editMikrotikSuccess(res.data));
      setShow(false);
      langMessage(
        "success",
        "মাইক্রোটিক এডিট সফল হয়েছে",
        "Mikrotik Edited Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.message);
    });
};

// GET single mikrotik
export const fetchSingleMikrotik = async (mikrotik, id) => {
  const data = mikrotik.find((item) => item.id === id);
  if (data) {
    return data;
  } else {
    langMessage(
      "error",
      "মাইক্রোটিক পাওয়া যায় নি",
      "Single mikrotik not found!"
    );
  }
};

// DELETE single mikrotik
export const deleteSingleMikrotik = async (
  dispatch,
  IDs,
  setIsloading,
  setShow
) => {
  setIsloading(true);
  await apiLink({
    method: "DELETE",
    url: `/mikrotik/${IDs.ispOwner}/${IDs.id}`,
  })
    .then((res) => {
      dispatch(deleteMikrotikSuccess(IDs.id));
      setShow(false);
      langMessage(
        "success",
        "মাইক্রোটিক ডিলিট সফল হয়েছে",
        "Mikorik Deleted Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.response?.data.message);
    });
  setIsloading(false);
};

//  test
export const mikrotikTesting = async (IDs) => {
  await apiLink({
    method: "GET",
    url: `/mikrotik/testConnection/${IDs.ispOwner}/${IDs.id}`,
  })
    .then(() => {
      langMessage(
        "success",
        "মাইক্রোটিক কানেকশন ঠিক আছে",
        "Mikrotik Connection is Fine"
      );
    })
    .catch((err) => {
      langMessage(
        "error",
        "দুঃখিত, মাইক্রোটিক কানেকশন নাই!",
        "Sorry, No mikrotik Connection!"
      );
    });
};

//---> OLT Connection check function
export const getOLTConnection = async (ispOwner, olt, name, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/olt/${ispOwner}/${olt}/connection`);
    toast.success(`${name} ${res.data?.message}`);
  } catch (error) {
    toast.error(`${name} ${error.message}`);
  }
  setIsLoading(false);
};

export const netFeeCustomerGet = async (
  mikrotikId,
  ispOwnerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/netFee/users/${ispOwnerId}/${mikrotikId}`,
  })
    .then((res) => {
      dispatch(getNetFeeCustomerSuccess(res.data));
    })
    .catch((error) => {
      console.log(error);
    });
  setIsLoading(false);
};

export const getNetFeeStaticCustomer = async (
  mikrotikId,
  ispOwnerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/netFee/static/users/${ispOwnerId}/${mikrotikId}`,
  })
    .then((res) => {
      dispatch(getNetFeeStaticCustomerSuccess(res.data));
    })
    .catch((error) => {
      console.log(error);
    });
  setIsLoading(false);
};

export const getExtraMikrotikCustomers = async (
  mikrotikId,
  ispOwnerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/extra/users/${ispOwnerId}/${mikrotikId}`,
  })
    .then((res) => {
      dispatch(getMikrotikCustomerSuccess(res.data));
    })
    .catch((error) => {
      console.log(error);
    });
  setIsLoading(false);
};

export const getStaticExtraMikrotikCustomers = async (
  mikrotikId,
  ispOwnerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/extra/static/users/${ispOwnerId}/${mikrotikId}`,
  })
    .then((res) => {
      dispatch(getMikrotikStaticCustomerSuccess(res.data));
    })
    .catch((error) => {
      console.log(error);
    });
  setIsLoading(false);
};

// get PPPoE user
export const getPPPoEActiveCustomer = async (
  dispatch,
  IDs,
  mtkName,
  setIsLoading,
  userType
) => {
  setIsLoading(true);
  dispatch(resetpppoeUser());
  dispatch(mtkIsLoading(true));
  try {
    // const res = await apiLink({
    //   method: "GET",
    //   url: `/mikrotik/PPPsecretUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    // });

    const PPPSecretCustomers = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPSecretCustomers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });

    const PPPInterfaceList = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPInterfaceList/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });

    const PPPActiveUsers = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPActiveUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });

    const PPPgetCustomer = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPgetCustomer/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });

    const pppsecretUsers = PPPSecretCustomers?.data?.pppsecretUsers;
    let interfaaceList = PPPInterfaceList?.data?.interfaceList;
    let activepppSecretUsers = PPPActiveUsers?.data?.activepppSecretUsers;
    let customers = PPPgetCustomer?.data?.customers;

    if (pppsecretUsers && interfaaceList && activepppSecretUsers && customers) {
      customers = customers.map((customerItem) => {
        const lastLogout = pppsecretUsers.find(
          (j) => j?.name == customerItem.pppoe?.name
        );
        if (lastLogout) {
          customerItem = {
            ...customerItem,
            lastLogoutTime: lastLogout.lastLoggedOut,
            status: customerItem.status,
          };
        }
        return customerItem;
      });

      const temp = [];
      interfaaceList = interfaaceList.map((interfaceItem) => {
        const ipAddress = activepppSecretUsers.find(
          (ip) => "<pppoe-" + ip.name + ">" === interfaceItem.name
        );

        if (ipAddress) {
          interfaceItem = {
            ...interfaceItem,
            ip: ipAddress.address,
            uptime: ipAddress.uptime,
            callerId: ipAddress.callerId,
          };
        }
        return interfaceItem;
      });

      if (userType === "user") {
        customers.forEach((i) => {
          const match = interfaaceList.find(
            (item) => item.name === "<pppoe-" + i.pppoe?.name + ">"
          );
          if (match) {
            temp.push({
              ...match,
              ...i,
            });
          }
          if (!match) temp.push(i);
        });
      }

      if (userType === "mikrotikUser") {
        pppsecretUsers.forEach((i) => {
          let match = false;
          interfaaceList.forEach((j) => {
            if (j.name === "<pppoe-" + i.name + ">") {
              match = true;

              temp.push({
                ...j,
                ...i,
              });
            }
          });
          if (!match) temp.push(i);
        });
      }

      dispatch(getpppoeUserSuccess(temp));
      dispatch(mtkIsLoading(false));
    }

    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.log(error);

    dispatch(mtkIsLoading(false));
    langMessage(
      "error",
      `${mtkName} মাইক্রোটিকের PPPoE গ্রাহক পাওয়া যায়নি!`,
      `${mtkName} Mikrotik's PPPoE Customer not found!`
    );
  }
};
// get PPPoE user
// to do
export const fetchpppoeUserForReseller = async (
  dispatch,
  IDs,
  mtkName,
  setIsLoading,
  userType
) => {
  setIsLoading(true);
  dispatch(resetpppoeUser());
  dispatch(mtkIsLoading(true));
  try {
    const res = await apiLink({
      method: "GET",
      url: `/reseller/PPPsecretUsers/${IDs.resellerId}/${IDs.mikrotikId}`,
    });

    let customers = res.data?.customers;
    const pppsecretUsers = res.data?.pppsecretUsers;
    let interfaaceList = res.data?.interfaceList;
    let activepppSecretUsers = res.data?.activepppSecretUsers;

    if (pppsecretUsers && interfaaceList && activepppSecretUsers && customers) {
      customers = customers.map((customerItem) => {
        const lastLogout = pppsecretUsers.find(
          (j) => j?.name == customerItem.pppoe?.name
        );
        if (lastLogout) {
          customerItem = {
            ...customerItem,
            lastLogoutTime: lastLogout.lastLoggedOut,
            status: customerItem.status,
          };
        }
        return customerItem;
      });

      const temp = [];
      interfaaceList = interfaaceList.map((interfaceItem) => {
        const ipAddress = activepppSecretUsers.find(
          (ip) => "<pppoe-" + ip.name + ">" === interfaceItem.name
        );
        if (ipAddress) {
          interfaceItem = {
            ...interfaceItem,
            ip: ipAddress.address,
            uptime: ipAddress.uptime,
            callerId: ipAddress.callerId,
          };
        }
        return interfaceItem;
      });

      if (userType === "user") {
        customers.forEach((i) => {
          const match = interfaaceList.find(
            (item) => item.name === "<pppoe-" + i.pppoe.name + ">"
          );

          if (match) {
            temp.push({
              ...match,
              ...i,
            });
          }
          if (!match) temp.push(i);
        });
      }

      if (userType === "mikrotikUser") {
        pppsecretUsers.forEach((i) => {
          let match = false;
          interfaaceList.forEach((j) => {
            if (j.name === "<pppoe-" + i.name + ">") {
              match = true;

              temp.push({
                ...j,
                ...i,
              });
            }
          });
          if (!match) temp.push(i);
        });
      }

      dispatch(getpppoeUserSuccess(temp));
      dispatch(mtkIsLoading(false));
    }

    setIsLoading(false);
  } catch (error) {
    console.log(error);
    setIsLoading(false);

    dispatch(mtkIsLoading(false));
    langMessage(
      "error",
      `${mtkName} মাইক্রোটিকের PPPoE গ্রাহক পাওয়া যায়নি!`,
      `${mtkName} Mikrotik's PPPoE Customer not found!!`
    );
  }
};

// get PPPoE Active user
export const fetchActivepppoeUser = async (
  dispatch,
  IDs,
  mtkName,
  setIsLoading
) => {
  dispatch(resetpppoeActiveUser());
  dispatch(mtkIsLoading(true));
  try {
    setIsLoading(true);
    const res = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPactiveUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    const activeUsers = res.data?.activeUsers;
    const interfaaceList = res.data?.interfaceList;
    const temp = [];

    interfaaceList.forEach((i) => {
      activeUsers.forEach((j) => {
        if (i.name === "<pppoe-" + j.name + ">") {
          temp.push({
            ...i,
            ...j,
          });
        }
      });
    });

    dispatch(getpppoeActiveUserSuccess(temp));
    dispatch(mtkIsLoading(false));
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);

    dispatch(mtkIsLoading(false));
    langMessage(
      "error",
      `${mtkName} মাইক্রোটিকের এক্টিভ গ্রাহক পাওয়া যায়নি!`,
      `${mtkName} Mikrotik's Active Customer not Found!`
    );
  }
};
export const fetchActivepppoeUserForReseller = async (
  dispatch,
  resellerId,
  mikrotikId,
  setIsLoading
) => {
  dispatch(resetpppoeActiveUser());
  dispatch(mtkIsLoading(true));
  try {
    setIsLoading(true);
    const res = await apiLink.get(
      `/reseller/PPPactiveCustomer/${resellerId}/${mikrotikId}`
    );
    dispatch(getpppoeActiveUserSuccess(res.data?.activePPPcustomers));
    dispatch(mtkIsLoading(false));
    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    console.log(error);
    dispatch(mtkIsLoading(false));
    langMessage(
      "error",
      "মাইক্রোটিকের এক্টিভ গ্রাহক পাওয়া যায়নি!",
      "Mikrotik's Active Customer not Found"
    );
  }
};

// get pppoe Package
export const fetchpppoePackage = async (dispatch, IDs, mtkName) => {
  dispatch(resetpppoePackage());
  dispatch(mtkIsLoading(true));
  try {
    const res = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPpackages/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });

    dispatch(getpppoePackageSuccess(res.data));
    dispatch(mtkIsLoading(false));
    // toast.success("PPPoE প্যাকেজ fetch success");
  } catch (error) {
    dispatch(mtkIsLoading(false));
    langMessage(
      "error",
      `${mtkName} মাইক্রোটিকের PPPoE প্যাকেজ পাওয়া যায়নি!`,
      `${mtkName} Mikrotik PPPoE Package not found!`
    );
  }
};

export const fetchPackagefromDatabase = async (dispatch, IDs, setIsLoading) => {
  setIsLoading(true);
  if (IDs.mikrotikId) {
    dispatch(resetPackagefromDatabase());
    dispatch(mtkIsLoading(true));
    try {
      const res = await apiLink.get(`/mikrotik/ppp/package/${IDs.mikrotikId}`);

      // console.log(res.data);
      dispatch(getPackagefromDatabaseSuccess(res.data));
      dispatch(mtkIsLoading(false));
      // toast.success("PPPoE প্যাকেজ fetch success");
    } catch (error) {
      // toast.error("প্যাকেজ পাওয়া যায়নি!");
      dispatch(mtkIsLoading(false));
      console.log(error.response);
    }
  }
  setIsLoading(false);
};

// Edit pppoe Package
export const editPPPoEpackageRate = async (
  dispatch,
  data,
  setLoading,
  resetForm,
  setShow
) => {
  setLoading(true);
  const { mikrotikId, pppPackageId, ...rest } = data;
  await apiLink({
    method: "PATCH",
    url: `/mikrotik/PPPpackage/${mikrotikId}/${pppPackageId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(editpppoePackageSuccess(res.data));
      setShow(false);
      langMessage(
        "success",
        "PPPoE প্যাকেজ রেট এডিট সফল হয়েছে!",
        "PPPoE Package Rate Edited Successfully"
      );
      resetForm();
      setLoading(false);
    })
    .catch((err) => {
      if (err.response) {
        toast.error("Error! ", err.response?.data?.message);
        resetForm();
        setLoading(false);
      }
    });
};

// DELETE pppoe Package
export const deletePPPoEpackage = async (dispatch, IDs) => {
  const { mikrotikId, pppPackageId } = IDs;
  await apiLink({
    method: "DELETE",
    url: `/mikrotik/PPPpackage/${mikrotikId}/${pppPackageId}`,
  })
    .then((res) => {
      dispatch(deletepppoePackageSuccess(pppPackageId));
      langMessage(
        "success",
        "PPPoE প্যাকেজ ডিলিট সফল হয়েছে!",
        "PPPoE Package Deleted Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.message);
    });
};

// Reseller

// GET reseller
export const fetchReseller = async (dispatch, ispOwner, setDataLoader) => {
  try {
    setDataLoader(true);
    const res = await apiLink.get(`/ispOwner/reseller/${ispOwner}`);
    dispatch(getResellerrSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
  setDataLoader(false);
};

// add reseller
export const postReseller = async (
  dispatch,
  data,
  setIsLoading,
  resetForm,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/ispOwner/reseller", data);
    dispatch(addResellerSuccess(res.data));
    setShow(false);
    langMessage(
      "success",
      "রিসেলার এড সফল হয়েছে !",
      "Reseller Added Successfully"
    );
    resetForm();
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

// Edit reseller
export const editReseller = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  try {
    const { ispId, resellerId, ...rest } = data;
    const res = await apiLink.patch(
      `/ispOwner/reseller/${ispId}/${resellerId}`,
      rest
    );

    dispatch(editResellerSuccess(res.data));
    setShow(false);
    langMessage(
      "success",
      "রিসেলার আপডেট সফল হয়েছে ",
      "Reseller Updated Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

//update reseller balance
export const updateResellerBalance = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  const { ispId, resellerId, ...rest } = data;
  try {
    const res = await apiLink.patch(
      `/ispOwner/reseller/${ispId}/${resellerId}`,
      rest
    );
    dispatch(editResellerSuccess(res.data));
    setShow(false);
    langMessage(
      "success",
      "রিসেলার ব্যালেন্স আপডেট সফল হয়েছে ",
      "Reseller Balance Updated Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

// Delete reseller
export const deleteReseller = async (dispatch, IDs, setIsLoading) => {
  setIsLoading(true);
  const { ispId, resellerId } = IDs;
  try {
    const res = await apiLink.delete(
      `/ispOwner/reseller/${ispId}/${resellerId}`
    );

    dispatch(deleteResellerSuccess(resellerId));
    document.querySelector("#resellerModal").click();
    langMessage(
      "success",
      "রিসেলার ডিলিট সফল হয়েছে",
      "Reseller Deleted Successfully"
    );
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

//password update
export const passwordUpdate = async ({
  data,
  setIsLoadingpass,
  setRedirectTime,
  setStartRedirect,
}) => {
  setIsLoadingpass(true);

  try {
    await apiLink.post(`/auth/update-password`, data);
    setIsLoadingpass(false);
    langMessage(
      "success",
      "পাসওয়ার্ড আপডেট সফল হয়েছে",
      "Password Updated Successfully"
    );

    setStartRedirect(true);

    //if password changed than execute force logout
    let redirectTime = 10;
    const interval = setInterval(() => {
      setRedirectTime(redirectTime - 1);
      redirectTime--;
      if (redirectTime === 0) {
        clearInterval(interval);
        userLogout();
      }
    }, 1000);
  } catch (error) {
    console.log(error.message);
    setIsLoadingpass(false);
    toast.error(error.response?.data.message);
  }
};

export const profileUpdate = async ({
  dispatch,
  data,
  id,
  mobile,
  setIsLoading,
  setRedirectTime,
  setStartRedirect,
}) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/ispOwner/${id}`, data);
    // console.log(res.data);

    //if mobile number change than execute force logout

    if (res.data.mobile && mobile && mobile !== res.data.mobile) {
      setStartRedirect(true);
      let redirectTime = 10;
      const interval = setInterval(() => {
        setRedirectTime(redirectTime - 1);
        redirectTime--;
        if (redirectTime === 0) {
          clearInterval(interval);
          userLogout();
        }
      }, 1000);
    }
    dispatch(updateProfile(res.data));

    langMessage(
      "success",
      "প্রোফাইল আপডেট সফল হয়েছে",
      "Profile Updated Successfully"
    );
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const resellerProfileUpdate = async ({
  dispatch,
  data,
  resellerId,
  setIsLoading,
  setRedirectTime,
  setStartRedirect,
  mobile,
}) => {
  setIsLoading(true);

  try {
    const res = await apiLink.patch(`/reseller/${resellerId}`, data);
    // console.log(res.data);

    //if mobile number change than execute force logout
    if (res.data.mobile && mobile && mobile !== res.data.mobile) {
      setStartRedirect(true);
      let redirectTime = 10;
      const interval = setInterval(() => {
        setRedirectTime(redirectTime - 1);
        redirectTime--;
        if (redirectTime === 0) {
          clearInterval(interval);
          userLogout();
        }
      }, 1000);
    }

    dispatch(updateProfile(res.data));
    setIsLoading(false);
    langMessage(
      "success",
      "প্রোফাইল আপডেট সফল হয়েছে",
      "Profile Updated Successfully"
    );
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
};

export const collectorProfileUpdate = async ({
  dispatch,
  data,
  resellerId,
  collectorId,
  setIsLoading,
  setRedirectTime,
  setStartRedirect,
  mobile,
}) => {
  setIsLoading(true);

  try {
    const res = await apiLink.patch(
      `/reseller/collector/${resellerId}/${collectorId}`,
      data
    );
    //if mobile number change than force logout
    if (res.data.mobile && mobile && mobile !== res.data.mobile) {
      setStartRedirect(true);
      let redirectTime = 10;
      const interval = setInterval(() => {
        setRedirectTime(redirectTime - 1);
        redirectTime--;
        if (redirectTime === 0) {
          clearInterval(interval);
          userLogout();
        }
      }, 1000);
    }

    dispatch(updateProfile(res.data));
    setIsLoading(false);
    langMessage(
      "success",
      "প্রোফাইল আপডেট সফল হয়েছে",
      "Profile Updated Successfully"
    );
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
};

//Bill
export const billCollect = async (
  dispatch,
  billData,
  paidConnectionFee,
  setLoading,
  resetForm = null,
  setResponseData,
  setTest,
  setShow = null
) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/bill/monthlyBill", billData);

    if (billData.userType === "pppoe") {
      dispatch(updateBalance(res.data));
      setResponseData(res.data);
      setTest(true);
    } else {
      dispatch(updateBalanceStaticCustomer(res.data));
      setResponseData(res.data);
      setTest(true);
    }

    // customer profile connection fee update after bill collect
    if (res.data.billType === "connectionFee") {
      const connectionFeeDue = paidConnectionFee + res.data.amount;
      dispatch(getCustomerConnectionFeeDue(connectionFeeDue));
    }

    langMessage(
      "success",
      `${res.data.billType} বিল গ্রহণ সফল হয়েছে।`,
      `${res.data.billType} Acceptance is Successful.`
    );

    if (typeof setShow === "function") {
      setShow(false);
    }
    resetForm();
  } catch (error) {
    toast.error(error.message);
  }
  setLoading(false);
};

//bill recharge from invoice
export const billCollectInvoice = async (
  dispatch,
  billData,
  setLoading,
  resetForm = null,
  invoiceId,
  setShow
) => {
  setLoading(true);
  try {
    const res = await apiLink.patch(`/bill/invoice/${invoiceId}`, billData);
    dispatch(updateCustomerInvoice(res.data));

    setShow(false);
    langMessage(
      "success",
      `${res.data.billType} বিল গ্রহণ সফল হয়েছে।`,
      `${res.data.billType} Acceptance is Successful.`
    );
    resetForm();
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setLoading(false);
};

//create invoice
export const createCustomerInvoice = async (
  billData,
  setLoading,
  resetForm = null,
  setShow
) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/bill/customer/invoice", billData);
    setShow(false);

    langMessage(
      "success",
      `${res.data.billType} ইনভয়েস তৈরি সফল হয়েছে।`,
      `${res.data.billType} Invoice Create Successful.`
    );

    resetForm();
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setLoading(false);
};

export const addDeposit = async (dispatch, data, setLoading, setShow) => {
  setLoading(true);
  try {
    const res = await apiLink.post(`/deposit`, data);
    dispatch(addDepositSucces(res.data));
    langMessage("success", "একসেপ্ট এর জন্য অপেক্ষা করেন", "Wait for Accept");
    setShow(false);
  } catch (error) {
    setLoading(false);
    toast.error(error.message);
  }
};

//balance

export const getTotalbal = async (dispatch) => {
  try {
    const res = await apiLink.get(`bill/monthlyBill/balance`);
    dispatch(getTotalBalanceSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

export const getDeposit = async (
  dispatch,
  ispOwner,
  year,
  month,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await apiLink.get(
      `/deposit/all/${ispOwner}?year=${year}&month=${month}`
    );
    dispatch(getDepositSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setLoading(false);
};

// ispOwner employee pending deposit
export const getPendingDeposit = async (dispatch, ispOwner, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.get(`/deposit/pending/${ispOwner}`);

    dispatch(getPendingDepositSuccess(res.data?.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setLoading(false);
};

// ispOwner employee pending deposit delete
export const deletePendingDeposit = async (dispatch, ispOwner, deposit) => {
  try {
    const res = await apiLink.delete(`/deposit/pending/${ispOwner}/${deposit}`);

    dispatch(deleteDepositSuccess(deposit));
    toast.success(res?.data.message);
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

export const getDepositReport = async (
  dispatch,
  manager,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/deposit/manager-collects/${manager}?year=${year}&month=${month}`
    );
    dispatch(getDepositReportSuccess(res.data));
  } catch (error) {
    console.log(error);
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

export const depositAcceptReject = async (
  dispatch,
  status,
  id,
  setAccLoading,
  ispOwner
) => {
  setAccLoading(true);
  try {
    const res = await apiLink.patch(`/deposit/${id}`, { status: status });
    if (ispOwner) {
      dispatch(updateDepositSuccess(res.data));
    } else {
      dispatch(updateDepositReportSuccess(res.data));
    }
    if (res.data.status === "accepted") {
      langMessage(
        "success",
        "ডিপোজিট গ্রহণ সফল হয়েছে।",
        "Deposite Accepted Successfully"
      );
    } else if (res.data.status === "rejected") {
      langMessage(
        "success",
        "ডিপোজিট বাতিল সফল হয়েছে।",
        "Deposit Cancellation Successfully"
      );
    }
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setAccLoading(false);
};

export const getAllBills = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/bill/${ispOwnerId}?year=${year}&month=${month}`
    );
    dispatch(getAllBillsSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const getAllManagerBills = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);

  try {
    const res = await apiLink.get(
      `/bill/get-bill-by-managerId/${ispOwnerId}?year=${year}&month=${month}`
    );
    dispatch(getAllBillsSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const editBillReport = async (
  dispatch,
  setIsLoading,
  reportId,
  data,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/bill/monthlyBill/${reportId}`, data);
    dispatch(editBillReportSuccess(res.data));
    setShow(false);
    langMessage("success", "নোট এডিট সফল হয়েছে", "Note Edited Successfully");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//my deposit

export const getMyDeposit = async (dispatch, year, month, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/deposit?year=${year}&month=${month}`);
    dispatch(getmyDepositSucces(res.data));
  } catch (error) {
    console.log(error?.response?.data.message);
  }
  setIsLoading(false);
};

//Collector Bills

export const getCollectorBill = async (dispatch, year, month, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/bill/monthlyBill?year=${year}&month=${month}`
    );

    dispatch(getCollectorBills(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

//recharge
//isp Owner end
export const recharge = async (data, setIsLoading, dispatch, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/reseller/recharge", data);
    dispatch(editResellerforRecharge(res.data));

    setShow(false);
    langMessage("success", "রিচার্জ সফল হয়েছে", "Recharge is Successful");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const rechargeHistoryfunc = async (
  dispatch,
  ispOwnerId,
  setRechargeLoading
) => {
  setRechargeLoading(true);
  try {
    const res = await apiLink.get(`/ispOwner/recharge/${ispOwnerId}`);
    dispatch(getAllRechargeHistory(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setRechargeLoading(false);
};

export const rechargeHistoryEdit = async (
  dispatch,
  rechargeId,
  data,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/reseller/recharge/${rechargeId}`, data);
    dispatch(historyEditSuccess(res.data));
    document.querySelector("#rechargeCommentEdit").click();
    langMessage("success", "কমেন্ট এডিট সফল হয়েছে", "Commnet edit Success");
  } catch (error) {
    console.log(error.response?.data.message);
    langMessage("success", "কমেন্ট এডিট ব্যার্থ হয়েছে", "Commnet edit Failed");
  }
  setIsLoading(false);
};

export const getResellerRechargeHistioty = async (
  resellerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/reseller/recharge/${resellerId}`);
    dispatch(resellerRechargeHistorySlice(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const prevMonthReport = async (
  ispOwnerId,
  resellerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/ispOwner/prev-month-reseller-report/${ispOwnerId}/${resellerId}`
    );
    dispatch(prevMonthReportSlice(res.data.report));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const getInvoices = async (dispatch, ispOwnerId, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/ispOwner/invoice/${ispOwnerId}`);

    dispatch(getInvoiceListSuccess(res.data));
    setIsloading(false);
  } catch (err) {
    setIsloading(false);
    console.log("Invoice error: ", err);
  }
};

// invoice delete
export const deleteInvoice = async (dispatch, invoiceId, setDeleteInvoice) => {
  setDeleteInvoice(true);
  try {
    const res = await apiLink.delete(`/ispOwner/delete-invoice/${invoiceId}`);
    dispatch(invoiceDelete(invoiceId));
    langMessage(
      "success",
      "ইনভয়েস ডিলিট সফল হয়েছে",
      "Invoice Deleted Successfully"
    );
  } catch (error) {
    console.log(error.response?.data?.message);
    toast.error(error.response?.data?.message);
  }
  setDeleteInvoice(false);
};

export const initiatePayment = async (invoice, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/payment/generate-payment-url`, invoice);
    window.location.href = res.data.paymentUrl;
    setIsloading(false);
  } catch (err) {
    console.log("Invoice error: ", err);
    setIsloading(false);
  }
};

export const purchaseSms = async (
  data,
  setIsloading,
  dispatch,
  setShow,
  navigate
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/sms`, data);
    dispatch(showModal(res.data));

    setShow(false);
    navigate("/payment", { state: res.data });
  } catch (err) {
    console.log("SMS purchase error: ", err);
  }
  setIsloading(false);
};

export const getUnpaidInvoice = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/dashboard/invoice/unpaid/${ispOwnerId}`);
    console.log(res);
    if (
      res.data &&
      new Date(res.data?.dueDate).getTime() < new Date().getTime()
    ) {
      if (
        window.location.pathname !== "/payment" &&
        window.location.pathname !== "/acountSuspend"
      ) {
        window.location.href = "/payment";
      }
    }

    dispatch(getUnpaidInvoiceSuccess(res.data));
  } catch (err) {
    console.log("unpaid invoice error: ", err);
  }
};

export const ispOwnerPayment = async (invoice, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/payment/generate-payment-url`, invoice);
    if (res.data) window.location.href = res.data.paymentUrl;
  } catch (err) {
    console.log("ispOwnerPayment error: ", err);
  }
  setIsLoading(false);
};

//get ispwoner with
export const getIspOwnerWitSMS = async (
  ispOwnerId,
  setIspOwner,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await apiLink.get(`/ispOwner/${ispOwnerId}`);
    setIspOwner(res.data);
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setLoading(false);
};

//mikrotik packages without mikrotik access

export const getWithoutMikrotikPackage = async (
  ispOwnerId,
  dispatch,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(`/mikrotik/package/${ispOwnerId}`);
    // console.log(res.data.packages);
    dispatch(getpackageSuccess(res.data.packages));
    dispatch(getpppoePackageSuccess(res.data.packages));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

export const getAllPackages = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(
      `/mikrotik/ppp/mikrotik/package/${ispOwnerId}`
    );
    dispatch(getAllPackagesSuccess(res.data.packages));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

export const getQueuePackageByIspOwnerId = async (
  ispOwnerId,
  dispatch,
  setIsloading
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/mikrotik/queue/package/${ispOwnerId}`);
    // console.log(res.data.packages);
    dispatch(getpackageSuccess(res.data.packages));
    // dispatch(getpppoePackageSuccess(res.data.packages));
    setIsloading(false);
  } catch (error) {
    console.log(error.response?.data.message);
  }
};
export const addPackagewithoutmikrotik = async (
  data,
  dispatch,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/mikrotik/package`, data);
    dispatch(addPackageSuccess(res.data.newPackage));
    setShow(false);
    langMessage(
      "success",
      "প্যাকেজ সফলভাবে যুক্ত হয়েছে",
      "Package Added Successfully"
    );
  } catch (error) {
    langMessage("error", "প্যাকেজ অ্যাড ব্যর্থ হয়েছে", "Package Add Failed");
  }
  setIsLoading(false);
};

export const addQueuePackage = async (
  data,
  dispatch,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/mikrotik/queue/package`, data);
    dispatch(addPackageSuccess(res.data.newPackage));

    setShow(false);
    langMessage(
      "success",
      "প্যাকেজ সফলভাবে যুক্ত হয়েছে",
      "Package Added Successfully"
    );
  } catch (error) {
    langMessage("error", "প্যাকেজ অ্যাড ব্যর্থ হয়েছে", "Package Add Failed");
  }
  setIsLoading(false);
};

export const updateWithoutMikrotikPackage = async (
  data,
  dispatch,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/mikrotik/package/${data?.id}`, data);
    dispatch(editPackageSuccess(res.data.updatedPackage));
    setShow(false);
    langMessage(
      "success",
      "প্যাকেজ এডিট সফল হয়েছে",
      "Package Updated Successfully"
    );
  } catch (error) {
    langMessage("error", "প্যাকেজ এডিট ব্যার্থ হয়েছে", "Package Add Failed");
  }
  setIsLoading(false);
};

// DELETE pppoe Package
export const deleteStaticPackage = async (dispatch, packageId) => {
  await apiLink({
    method: "DELETE",
    url: `/mikrotik/package/${packageId}`,
  })
    .then((res) => {
      dispatch(deletePackageSuccess(packageId));
      langMessage(
        "success",
        "স্ট্যাটিক প্যাকেজ ডিলিট সফল হয়েছে",
        "Static Package Deleted Successfully"
      );
    })
    .catch((error) => {
      toast.error(error.message);
    });
};

// get ispOwner

export const getIspOwnerData = async (
  dispatch,
  ispOwnerId,
  setIsLoading = null
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(`/ispOwner/${ispOwnerId}`);
    dispatch(setBpsetting(res.data.bpSettings));
    dispatch(setIspOwnerData(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

// get ispOwner status from netfee
export const getIspOwnerStatus = async (dispatch, ispOwnerId) => {
  const res = await apiLink.get(`auth/status/check/${ispOwnerId}`);

  // ispOwner invoice check due date and redirect
  if (
    res?.data.invoice &&
    new Date(res.data.invoice?.dueDate).getTime() < new Date().getTime()
  ) {
    if (
      window.location.pathname !== "/payment" &&
      window.location.pathname !== "/acountSuspend"
    ) {
      window.location.href = "/payment";
    }
  }

  // ispOwner status check and redirect
  if (res?.data.status === "FORBIDDEN" || res?.data.ispOwner.status === "new") {
    if (window.location.pathname !== "/acountSuspend") {
      window.location.href = "/acountSuspend";
    }
  }
  dispatch(getUnpaidInvoiceSuccess(res?.data.invoice));
  // dispatch(getIspOwnerManagerSuccess(res.data));
  try {
  } catch (error) {
    console.log(error.response.data.message);
  }
};

//updated Users
export const getUpdatedUserData = async (dispatch, userRole, userId) => {
  try {
    const res = await apiLink.get(`/${userRole}/${userId}`);
    dispatch(updateUserData(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

export const getResellerBalance = async (
  resellerId,
  setRechargeBalance,
  setSmsBalance,
  setIsrefresh
) => {
  setIsrefresh(true);
  try {
    const res = await apiLink.get(`/reseller/recharge/balance/${resellerId}`);
    setSmsBalance(res.data.smsBalance);
    setRechargeBalance(res.data.rechargeBalance);
    setIsrefresh(false);
  } catch (error) {
    console.log(error);
    setIsrefresh(false);
  }
};

//expenditure
export const getAllExpenditure = async (dispatch, ispOwnerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/staff/expenditures/${ispOwnerId}`);
    dispatch(getExpenditureSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const addExpenditure = async (
  dispatch,
  data,
  setLoading,
  resetForm,
  setShow
) => {
  setLoading(true);
  try {
    const res = await apiLink.post(`/staff/expenditure`, data);
    dispatch(addExpenditureSuccess(res.data));
    setShow(false);

    langMessage("success", "সফল হয়েছে", "Expenditure Add Success");
    resetForm();
  } catch (error) {
    console.log(error.response?.data?.message);
    langMessage("error", "ব্যার্থ হয়েছে", "Faild");
    resetForm();
  }
  setLoading(false);
};

export const editExpenditure = async (
  dispatch,
  data,
  expenditureId,
  setLoading,
  resetForm,
  setShow
) => {
  setLoading(true);
  try {
    const res = await apiLink.patch(
      `/staff/expenditure/${expenditureId}`,
      data
    );
    dispatch(editExpenditureSuccess(res.data));
    setShow(false);

    langMessage(
      "success",
      "খরচ আপডেট সফল হয়েছে",
      "Expenditure Updated Successfully"
    );
    resetForm();
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setLoading(false);
};

export const deleteExpenditure = async (dispatch, expenditureId) => {
  try {
    const res = await apiLink.delete(`/staff/expenditure/${expenditureId}`);
    dispatch(deleteExpenditureSuccess(expenditureId));
    langMessage(
      "success",
      "খরচ ডিলিট সফল হয়েছে",
      "Expenditure Deleted Successfully"
    );
  } catch (error) {
    console.log(error.response);
    toast.error(error.response.message);
    // langMessage("error", "খরচ ডিলিট ব্যর্থ হয়েছে", "Expenditure Delete Failed");
  }
};

// expenditure pourpose
export const getExpenditureSectors = async (
  dispatch,
  ispOwnerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/staff/expenditurePurposes/${ispOwnerId}`);
    dispatch(getExpenditureSectorsSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const addExpenditurePourpose = async (
  dispatch,
  data,
  setIsloading,
  resetForm,
  setShow
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/staff/expenditurePurpose`, data);
    dispatch(addExpenditureSectorsSuccess(res.data));
    setShow(false);

    langMessage(
      "success",
      "খরচ যুক্ত সফল হয়েছে",
      "Expenditure Added Successfully"
    );
    resetForm();
  } catch (error) {
    langMessage("error", "খরচ যুক্ত ব্যার্থ হয়েছে", "Expenditure Add Failed");
  }
  setIsloading(false);
};
export const editExpenditurePourpose = async (
  dispatch,
  data,
  setIsloading,
  resetForm,
  setShow
) => {
  setIsloading(true);
  try {
    const res = await apiLink.patch(
      `/staff/expenditurePurpose/` + data.id,
      data
    );
    dispatch(editExpenditureSectorsSuccess(res.data));
    setShow(false);

    langMessage(
      "success",
      "খরচ খাত সফলভাবে আপডেট হয়েছে",
      "Expenditure Type Updated Successfully"
    );
    resetForm();
  } catch (error) {
    langMessage(
      "error",
      "খরচ খাত যুক্ত ব্যার্থ হয়েছে",
      "Expenditure Type Added Failed"
    );
  }
  setIsloading(false);
};

//add netFee support
export const addNetFeeSupport = async (dispatch, supportData, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(
      `/ispOwner/create/netFee-support`,
      supportData
    );
    dispatch(AddNetFeeSupport(res.data));
    document.querySelector("#addNetFeeSupport").click();
    langMessage(
      "success",
      "নেটফি সাপর্ট অ্যাড সফল হয়েছে",
      "NetFee Support Add Successfully"
    );
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

// get netFee support
export const getNetFeeSupportData = async (
  dispatch,
  ispOwner,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/ispOwner/netFee/support/${ispOwner}`);
    dispatch(getNetFeeSupport(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

// update netFee support
export const updateNetFeeSupportData = async (
  dispatch,
  setIsLoading,
  updateSupport
) => {
  console.log(updateSupport);

  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/netFee/support-edit/${updateSupport.id}`,
      updateSupport
    );
    dispatch(updateNetFeeSupport(res.data));
    document.querySelector("#supportEdit").click();
    langMessage(
      "success",
      "নেটফি সাপর্ট আপডেট সফল হয়েছে",
      "NetFee Support Update Successfully"
    );
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

// delete netFee support
export const deleteNetFeeSupportData = async (
  dispatch,
  setIsLoading,
  supportId
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.delete(
      `/ispOwner/netFee/support-delete/${supportId}`
    );
    dispatch(deleteNetFeeSupport(res.data));
    document.querySelector("#supportDelete").click();
    langMessage(
      "success",
      "নেটফি সাপর্ট ডিলিট সফল হয়েছে",
      "NetFee Support Delete Successfully"
    );
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};
//admin/invoice/create+ispId , data

// IspOwner invoice create
export const ispOwnerInvoiceCreate = async (
  dispatch,
  setIsLoading,
  invoiceData,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/admin/invoice/create`, invoiceData);

    setShow(false);
    langMessage("success", "Invoice create success");
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

//get reseller coustomer collection report data
export const resellerCustomerReport = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `bill/resellers/${ispOwnerId}?year=${year}&month=${month}`
    );
    dispatch(getResellerCollectionReport(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

//post fire wall id filter drop
export const fireWallIpFilterDrop = async (
  dispatch,
  setIsLoading,
  ispOwner,
  mikrotikId,
  dropIp,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(
      `mikrotik/dropFireWallFilterRule/${ispOwner}/${mikrotikId}`,
      { dropIp }
    );
    dispatch(postFireWllFilterIpDrop(res.data));
    setShow(false);
    langMessage("success", " সফলভাবে যুক্ত হয়েছে", "Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

//get sync fire wall filter drop
export const syncFireWallFilterDrop = async (
  dispatch,
  setSyncLoading,
  data
) => {
  setSyncLoading(true);
  try {
    const res = await apiLink.get(
      `mikrotik/sync/firewallFilterDrop/${data.ispOwner}/${data.mikrotikId}`
    );
    dispatch(getFireWllFilterIpDrop(res.data));
    langMessage("success", " সফলভাবে যুক্ত হয়েছে", "Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setSyncLoading(false);
};

//delete fire wall ip filter drop
export const deleteFireWallIpDrop = async (
  dispatch,
  setIsLoading,
  data,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.delete(
      `mikrotik/firewallFilterDrop/${data.ispOwner}/${data.id}?mikrotikCheck=${data.mikrotik}`
    );

    setShow(false);
    langMessage("success", " সফলভাবে যুক্ত হয়েছে", "Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

//get fire wall ip filter drop
export const getFireWallIpDrop = async (dispatch, setIpLoading, ispOwner) => {
  setIpLoading(true);
  try {
    const res = await apiLink.get(`mikrotik/firewall/filter/drop/${ispOwner}`);
    dispatch(getFireWllFilterIpDrop(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIpLoading(false);
};

// update fire wall ip drop
export const updateFireWallIpDrop = async (
  dispatch,
  setIsLoading,
  fireWallIp,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `mikrotik/firewallFilterDrop/${fireWallIp.ispOwner}/${fireWallIp.id}`,
      fireWallIp
    );
    dispatch(updateFireWallFilterIpDrop(res.data));
    setShow(false);
    langMessage("success", " সফলভাবে যুক্ত হয়েছে", "Added Successfully");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// remove fire wall ip drop from mikrotik
export const removeFireWallAllIpDrop = async (
  dispatch,
  setIpLoading,
  ispOwner,
  mikrotikId
) => {
  setIpLoading(true);
  try {
    const res = await apiLink.delete(
      `mikrotik/firewall/filter/bulk-delete-mikrotik/${ispOwner}/${mikrotikId}`
    );
    dispatch(getFireWllFilterIpDrop(res.data));
    langMessage(
      "success",
      "ফায়ারওয়াল ফিল্টার আইপি ড্রপ ডিলিট সফল হয়েছে",
      "Fire Wall Filter Ip Drop Delete Success"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIpLoading(false);
};

// update fire wall ip drop
export const resetFireWallAllIpDrop = async (
  dispatch,
  setIpLoading,
  ispOwner,
  mikrotikId
) => {
  setIpLoading(true);
  try {
    const res = await apiLink.post(
      `mikrotik/firewall/filter/bulk-add-mikrotik/${ispOwner}/${mikrotikId}`
    );
    dispatch(getFireWllFilterIpDrop(res.data));
    langMessage(
      "success",
      "ফায়ারওয়াল ফিল্টার আইপি ড্রপ সফলভাবে যুক্ত হয়েছে",
      "Added Fire Wall Filter Ip Drop Successfully"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIpLoading(false);
};

// ispOwner customer search
export const customerNumber = async (
  dispatch,
  setIsLoading,
  ispOwner,
  mobile
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/find-customer-by-mobile/${ispOwner}?mobile=${mobile}`
    );
    dispatch(getSearchCustomer(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// ispOwner customer number delete
export const customerNumberDelete = async (
  dispatch,
  setIsDelete,
  ispOwner,
  mobile
) => {
  setIsDelete(true);
  try {
    const res = await apiLink.delete(
      `ispOwner/delete-customer-by-mobile/${ispOwner}?mobile=${mobile}`
    );
    dispatch(editCustomerSuccess(res.data));
    langMessage(
      "success",
      "কাস্টমার মোবাইল নম্বর ডিলিট সফল হয়েছে",
      "Customer mobile number deletion is successful"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsDelete(false);
};

// ispOwner customer number update
export const customerNumberUpdate = async (
  dispatch,
  setIsDelete,
  setShow,
  setData,
  ispOwner,
  number,
  mobile
) => {
  setIsDelete(true);
  try {
    const res = await apiLink.patch(
      `ispOwner/update-customer-by-mobile/${ispOwner}?mobile=${number}`,
      { mobile }
    );
    dispatch(editCustomerSuccess(res.data));
    setData("");
    setShow(false);
    langMessage(
      "success",
      "কাস্টমার মোবাইল নম্বর ডিলিট সফল হয়েছে",
      "Customer mobile number deletion is successful"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsDelete(false);
};

// Multiple manager api call
export const getMultipleManager = async (dispatch, currentUser) => {
  try {
    const res = await apiLink.get(
      `collector/get-manager/${currentUser?.collector?.id}`
    );
    dispatch(getMultipleManagerSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// ispOwner number support
export const getIspOwnerSupportNumbers = async (
  dispatch,
  ispOwner,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`ispOwner/customer-support/${ispOwner}`);
    dispatch(getIspOwnerSupports(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// ispOwner Package Change
export const getPackageChangeApi = async (dispatch, ispOwner, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/customer/package/changes/data?ispOwnerId=${ispOwner}`
    );
    dispatch(getIspOwnerPackageChangeRequest(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

//package change api for accept and reject request
export const packageChangeAcceptReject = async (
  dispatch,
  status,
  data,
  setAccLoading
) => {
  setAccLoading(true);
  try {
    let res;
    if (status === "accepted") {
      res = await apiLink.patch(`ispOwner/accept/package/change`, data);
    } else if (status === "rejected") {
      res = await apiLink.patch(`ispOwner/reject/package/change`, data);
    }

    dispatch(updatePackageChangeRequest(res.data));
    if (res.data.status === "accepted") {
      langMessage(
        "success",
        "প্যাকেজ পরিবর্তন গ্রহণ সফল হয়েছে।",
        "Package Change Accepted Successfully"
      );
    } else if (res.data.status === "rejected") {
      langMessage(
        "success",
        "প্যাকেজ পরিবর্তন বাতিল সফল হয়েছে।",
        "Package Change Cancelled Successfully"
      );
    }
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setAccLoading(false);
};

// create ispOwner customr supporter
export const postIspOwnerSupporterNumber = async (
  dispatch,
  supporter,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`ispOwner/customer-support/post`, supporter);
    dispatch(postIspOwnerSupports(res.data));
    setShow(false);
    langMessage(
      "success",
      "সাপর্ট নম্বর অ্যাড সফল হয়েছে",
      "Support Number Add successful"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// create ispOwner customr supporter
export const updateIspOwnerSupporterNumber = async (
  dispatch,
  sendingData,
  ispOwnerId,
  supportId,
  setIsLoading,
  setEditShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `ispOwner/customer-support/update/${ispOwnerId}/${supportId}`,
      sendingData
    );

    dispatch(updateIspOwnerSupports(res.data));
    setEditShow(false);
    langMessage(
      "success",
      "সাপর্ট নম্বর আপডেট সফল হয়েছে",
      "Support Number Update successful"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// create ispOwner customr supporter
export const deleteIspOwnerSupporterNumber = async (
  dispatch,
  ispOwnerId,
  supportId
) => {
  try {
    const res = await apiLink.delete(
      `ispOwner/customer-support/delete/${ispOwnerId}/${supportId}`
    );
    dispatch(deleteIspOwnerSupports(res.data));
    langMessage(
      "success",
      "সাপর্ট নম্বর ডিলিট সফল হয়েছে",
      "Support Number Delete successful"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// get ispOwner customr invoice
export const getIspOwnerInvoice = async (
  dispatch,
  ispOwnerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`bill/customer/invoice/${ispOwnerId}`);
    dispatch(getCustomerInvoice(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// customer temp invoice  delete api
export const deleteIspOwnerCustomerInvoice = async (dispatch, invoiceId) => {
  try {
    const res = await apiLink.delete(`/bill/invoice/${invoiceId}`);
    dispatch(deleteCustomerInvoice(res.data));
    langMessage(
      "success",
      "ইনভয়েস ডিলিট সফল হয়েছে",
      "Invoice Delete successful"
    );
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

// dicount customer api call
export const getDiscountCustomer = async (
  dispatch,
  ispOwnerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  const res = await apiLink.get(
    `ispOwner/discount/customer/${ispOwnerId}?month=${month}&year=${year}`
  );
  dispatch(getDiscountCustomerSuccess(res.data));
  try {
  } catch (error) {
    console.log(error.response.data.message);
  }
  setIsLoading(false);
};

// ispOwner number support
export const getNetFeeSupportNumbers = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`admin/support/number`);
    dispatch(getSupportNumbers(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// ispOwner number support
export const getIspOwnerNetFeeSupport = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`ispOwner/support/number`);
    dispatch(getSupportCall(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// ispOwner number support
export const deleteNetFeeSupportNumbers = async (dispatch, supportId) => {
  try {
    const res = await apiLink.delete(`admin/support/number/${supportId}`);
    dispatch(deleteSupportNumbers(res.data));
    toast.success("Support Number Delete successfuly");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// create ispOwner customr supporter
export const postNetFeeSupportNumbers = async (
  dispatch,
  data,
  setIsLoading,
  setShow,
  resetForm
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`admin/support/number`, data);
    dispatch(postSupportNumbers(res.data));

    setShow(false);
    langMessage(
      "success",
      "সাপর্ট নম্বর অ্যাড সফল হয়েছে",
      "Support Number Add successful"
    );
    resetForm();
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// create ispOwner customr supporter
export const updateNetFeeSupportNumbers = async (dispatch, data, id) => {
  try {
    const res = await apiLink.patch(`admin/support/number/${id}`, data);
    dispatch(updateSupportNumbers(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// with out mirotik package delete api call
export const deleteWithOutMikrotikPackage = async (dispatch, packId) => {
  try {
    const res = await apiLink.delete(`mikrotik/package/${packId}`);
    dispatch(deletePackageSuccess(packId));
    langMessage(
      "success",
      "প্যাকেজ সফলভাবে মুছে ফেলা হয়েছে।",
      "The Package was Successfully Deleted."
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// get netFee bulletin api call
export const getBulletin = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`admin/bulletin`);
    dispatch(getBulletinSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// post netFee bulletin api call
export const postBulletin = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`admin/bulletin`, data);
    dispatch(postBulletinSuccess(res.data));
    setShow(false);
    toast.success("Bulletin Add successful");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// edit netFee bulletin api call
export const patchBulletin = async (
  dispatch,
  bulletinId,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`admin/bulletin/${bulletinId}`, data);
    dispatch(patchBulletinSuccess(res.data));
    setShow(false);
    toast.success("Bulletin Update successful");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

// delete netFee bulletin api call
export const deleteBulletin = async (dispatch, bulletinId) => {
  try {
    const res = await apiLink.delete(`admin/bulletin/${bulletinId}`);
    dispatch(deleteBulletinSuccess(bulletinId));
    toast.success("Bulletin successful Delete");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// post & update netFee bulletin parmission api call
export const patchBulletinPermission = async (dispatch, data) => {
  try {
    const res = await apiLink.patch(`admin/page/permission`, data);
    dispatch(updatePermissionSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// pppoe customer MAC-binding api call
export const pppoeMACBinding = async (customerId) => {
  try {
    await apiLink.patch(`mikrotik/mac/binding/${customerId}`);
    toast.success("Customer MAC-Binding Add Successful");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// pppoe customer remove MAC-binding api call
export const pppoeRemoveMACBinding = async (customerId) => {
  try {
    await apiLink.patch(`mikrotik/remove/mac/binding/${customerId}`);
    toast.success("Customer MAC-Binding Successful Remove");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// static customer MAC-binding api call
export const staticMACBinding = async (customerId) => {
  try {
    await apiLink.patch(`mikrotik/static/mac/binding/${customerId}`);
    toast.success("Customer MAC-Binding Add Successful");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// get pppoe customer all package list api
export const getPPPoEPackage = async (dispatch, ispOwner, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`mikrotik/pppoe/package/${ispOwner}`);
    dispatch(getPppoePackages(res.data.packages));
  } catch (error) {
    console.log(error.message);
  }
  setIsloading(false);
};

// get single cusomer bill report
export const getCustoemrReport = async (dispatch, customerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink(`/bill/customer/${customerId}`);
    dispatch(getCustomerBillReport(res.data));
  } catch (err) {
    toast.error("Error to get report: ", err);
  }
  setIsLoading(false);
};

//delete single cusomer bill report
export const deleteCustomerReport = async (dispatch, reportId) => {
  try {
    const res = await apiLink.delete(`/bill/monthlyBill/${reportId}`);

    dispatch(deleteCustomerBillReport(res.data));
    dispatch(editCustomerSuccess(res.data.customer));

    langMessage("success", "বিল ডিলিট সফল হয়েছে", "Bill Delete SuccessFully");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

//delete cusomer bill report delete api
export const deleteBillReport = async (dispatch, reportId) => {
  try {
    const res = await apiLink.delete(`/bill/delete/${reportId}`);

    dispatch(deleteBillReportSuccess(res.data));

    langMessage("success", "বিল ডিলিট সফল হয়েছে", "Bill Delete SuccessFully");
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

//  deposit update api
export const depositReportAmountUpdate = async (
  dispatch,
  depositId,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/deposit/update/${depositId}`, data);
    dispatch(updateDepositSuccess(res.data));

    langMessage(
      "success",
      "জমা করা পরিমাণ আপডেট সফল হয়েছে",
      "Deposit amount update successful"
    );
    setShow(false);
  } catch (error) {
    console.log(error?.response?.data.message);
  }
  setIsLoading(false);
};

// get all webhook message
export const getAllWebhookMessage = async (dispatch, dataGet, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `${config.shunno_pay_base_url}/webhooks/messages?netfeeId=${dataGet.netfeeId}&limit=${dataGet.limit}&startDate=${dataGet.startDate}&endDate=${dataGet.endDate}&sort=dsc`,
      {
        headers: {
          Authorization: "Bearer " + config.shunno_pay_token,
        },
      }
    );
    dispatch(getAllWebhookMessageSuccess(res?.data.data.data));
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

// webhook message reference id update api
export const messageReferenceIDUpdate = async (
  dispatch,
  data,
  messageId,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await axios.put(
      `${config.shunno_pay_base_url}/webhooks/messages/${messageId}`,
      data,
      {
        headers: {
          "X-API-KEY": "BJK-&!JK-NM@",
          Authorization: "Bearer " + config.shunno_pay_token,
        },
      }
    );
    dispatch(updateReferenceIDSuccess(res?.data.data));

    setShow(false);
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

// network device create
export const createNetworkDevice = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`network/createNetworkDevice`, data);
    dispatch(postNetworkDeviceSuccess(res.data?.savedProduct));

    setShow(false);
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

// network device update
export const updateNetworkDevice = async (
  dispatch,
  deviceId,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `network/updateNetworkDevice/${deviceId}`,
      data
    );
    dispatch(updateNetworkDeviceSuccess(res?.data));

    setShow(false);
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

// get ispowner network device
export const getNetworkDevice = async (dispatch, ispOwnerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`network/getNetworkDevice/${ispOwnerId}`);
    dispatch(getNetworkDeviceSuccess(res.data?.networkDevices));
    dispatch(getNetworkDeviceOutputSuccess(res.data?.networkDeviceOutputs));
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

// network diagram device
export const getNetworkDiagramDevice = async (
  dispatch,
  ispOwnerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`network/getNetworkTree/${ispOwnerId}`);

    dispatch(getNetworkDiagramDeviceSuccess(res?.data));
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

// network device assign
export const networkDeviceAssign = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`network/diagram-assing`, data);

    setShow(false);
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
  setIsLoading(false);
};

export const deleteNetworkDevice = async (dispatch, deviceId) => {
  try {
    const res = await apiLink.delete(`network/deleteNetworkDevice/${deviceId}`);
    dispatch(deleteNetworkDeviceSuccess(res.data));
    langMessage(
      "success",
      "নেটওয়ার্ক ডিভাইস ডিলিট সফল হয়েছে",
      "Network device delete successful"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};
