import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import moment from "moment";

import {
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
  AddSubAreaSuccess,
  DeleteAreaSuccess,
  DeleteSubAreaSuccess,
  EditAreaSuccess,
  EditSubAreaSuccess,
  FetchAreaSuccess,
} from "./areaSlice";
import {
  addCollectorSuccess,
  deleteCollectorSuccess,
  editCollectorSuccess,
  getCollectorBills,
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
} from "./mikrotikSlice";
import {
  addResellerSuccess,
  deleteResellerSuccess,
  editResellerforRecharge,
  editResellerSuccess,
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
} from "./paymentSlice";
import { getChartSuccess, getCardDataSuccess } from "./chartsSlice";
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
  deleteNetFeeSupport,
  getNetFeeSupport,
  updateNetFeeSupport,
} from "./netFeeSupportSlice";

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
    const res = await apiLink.get(`/ispOwner/manager/${ispWonerId}`);
    dispatch(managerFetchSuccess(res.data));
  } catch (error) {
    dispatch(managerFetchFailure());
  }
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

export const getChartsReseller = async (
  dispatch,
  resellerId,
  year,
  month,
  user
) => {
  try {
    let link = `/dashboard/reseller/${resellerId}?year=${year}&month=${month}`;
    if (user)
      link = `/dashboard/reseller/${resellerId}?year=${year}&month=${month}&user=${user}`;
    const res = await apiLink(link);
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
  }
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

export const addManager = async (dispatch, addStaffStatus, managerData) => {
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";

  await apiLink({
    url: `/ispOwner/manager?addStaff=${addStaffStatus}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: managerData,
  })
    .then((res) => {
      dispatch(managerAddSuccess(res.data));
      button.style.display = "initial";

      langMessage(
        "success",
        "ম্যানেজার সংযুক্ত সফল হয়েছে",
        "Manager Create Successfully"
      );

      document.querySelector("#managerAddModal").click();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        langMessage("error", err.response?.data?.message);
      }
    });
};

export const deleteManager = async (dispatch, ispOwnerId) => {
  await apiLink({
    url: `/ispOwner/manager/${ispOwnerId}`,
    method: "DELETE",
  })
    .then((res) => {
      dispatch(managerDeleteSuccess(res.data));
      // window.location.reload();
    })
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    });
};

export const editManager = async (dispatch, managerData, setIsLoading) => {
  setIsLoading(true);
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";
  try {
    const res = await apiLink.patch(
      `/ispOwner/manager/${managerData.ispOwner}`,
      managerData
    );

    dispatch(managerEditSuccess(res.data));
    setIsLoading(false);
    button.style.display = "initial";
    hideModal();
    langMessage(
      "success",
      "ম্যানেজার আপডেট সফল হয়েছে",
      "Manager Updated Successfully"
    );
  } catch (error) {
    setIsLoading(false);

    button.style.display = "initial";
    toast.error(error?.response?.data?.message);
  }
};

//Areas

export const getArea = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(`/ispOwner/area/${ispOwnerId}`);
    dispatch(FetchAreaSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
  setIsLoading(false);
};

export const addArea = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/ispOwner/area", data);

    dispatch(AddAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#areaModal").click();
    langMessage("success", "এরিয়া সংযুক্ত সফল হয়েছে", "Area Add Successfully");
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
};
export const editArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.patch(
      `/ispOwner/area/${data.ispOwner}/${data.id}`,
      data
    );
    dispatch(EditAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#areaEditModal").click();
    langMessage("success", "এরিয়া এডিট সফল হয়েছে", "Area Updated Successfully");
  } catch (error) {
    setIsLoading(false);
    langMessage("error", "এরিয়া এডিট সফল হয়নি", "Area Update Failed");
  }
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
    langMessage("error", "এরিয়া ডিলিট সফল হয়নি", "Area Delete Failed");
  }
};

//subarea

export const addSubArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("/ispOwner/subArea", data);

    dispatch(AddSubAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#subAreaModal").click();
    langMessage(
      "success",
      "সাব-এরিয়া সংযুক্ত সফল হয়েছে",
      "Sub-Area Added Successfully"
    );

    // hideModal();
  } catch (error) {
    setIsLoading(false);
    document.querySelector("#subAreaModal").click();
    toast.error(error.response?.data.message);
  }
};

// PATCH sub area
export const editSubArea = async (dispatch, data, setIsLoading) => {
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
      setIsLoading(false);
      document.querySelector("#subAreaEditModal").click();
      langMessage(
        "success",
        "সাব-এরিয়া আপডেট সফল হয়েছে",
        "Sub-Area Updated Successfully"
      );
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// DELETE sub area
export const deleteSubArea = async (dispatch, data, setIsLoading) => {
  const { ispOwnerId, subAreaId, areaId } = data;

  await apiLink({
    url: `/ispOwner/subArea/${ispOwnerId}/${subAreaId}`,
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        dispatch(DeleteSubAreaSuccess({ areaId, subAreaId }));
        setIsLoading(false);
        document.querySelector("#subAreaModal").click();
        langMessage(
          "success",
          "সাব-এরিয়া ডিলিট সফল হয়েছে",
          "Sub-Area Deleted Successfully"
        );
        // getArea(dispatch, ispOwnerId);
      }
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// Collector

export const getCollector = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(`/ispOwner/collector/${ispOwnerId}`);
    dispatch(getCollectorSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const addCollector = async (
  dispatch,
  data,
  setIsLoading,
  addStaffStatus
) => {
  console.log(addStaffStatus);
  try {
    const res = await apiLink.post(
      `ispOwner/collector?addStaff=${addStaffStatus}`,
      data
    );
    dispatch(addCollectorSuccess(res.data));
    setIsLoading(false);
    langMessage(
      "success",
      "কালেক্টর সংযুক্ত সফল হয়েছে",
      "Collector Added Successfully"
    );
    document.querySelector("#collectorModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editCollector = async (dispatch, data, setIsLoading) => {
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
    document.querySelector("#collectorEditModal").click();
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
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
    setIsDeleting(false);
    langMessage(
      "success",
      "কালেক্টর ডিলিট সফল হয়েছে",
      "Collector Deleted Successfully"
    );
  } catch (err) {
    if (err.response) {
      setIsDeleting(false);
      toast.error(err.response.data.message);
    }
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

export const addCustomerNote = async (dispatch, setIsLoading, data) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/ispOwner/addNote`, data);
    dispatch(createNote(res.data));
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
  setIsloading,
  customerType
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(
      `/customer/due/${ispOwner}?month=${month}&year=${year}&userType=${customerType}`
    );
    if (customerType === "pppoe") {
      dispatch(getDueCustomerSuccess(res.data.customers));
    }
    if (customerType === "static") {
      dispatch(getStaticDueCustomerSuccess(res.data.customers));
    }
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
    setIsloading(false);
  } catch (error) {
    console.log(error.response.data.message);
    setIsloading(false);
  }
};

export const addCustomer = async (dispatch, data, setIsloading, resetForm) => {
  setIsloading(true);
  try {
    const res = await apiLink.post("/ispOwner/customer", data);
    dispatch(addCustomerSuccess(res.data));
    setIsloading(false);
    langMessage(
      "success",
      "কাস্টমার সংযুক্ত সফল হয়েছে",
      "Customer Added Successfully"
    );
    document.querySelector("#customerModal").click();
    resetForm();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
      // resetForm()
    }
  }
};

export const editCustomer = async (dispatch, data, setIsloading) => {
  const { singleCustomerID, ispOwner, ...sendingData } = data;

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
    setIsloading(false);
    document.getElementById("filterBtn").click();
    langMessage(
      "success",
      "কাস্টমার এডিট সফল হয়েছে",
      "Customer Updated Successfully"
    );
    document.querySelector("#customerEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteACustomer = async (
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
    dispatch(deleteCustomerSuccess(data.customerID));
    isResellerCustomer && dispatch(deleteReCustomer(data.customerID));
    document.querySelector("#customerDelete").click();
    setIsLoading(false);
    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#customerDelete").click();
      toast.error(err.response.data.message);
    }
  }
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
  } catch (err) {
    toast.error(err.response.data.message);
  }
  setIsLoading(false);
};

//Mikrotik

// get Mikrotik Sync user
export const fetchMikrotikSyncUser = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/customer/${data.ispOwner}/${data.mikrotikId}?inActiveCustomer=${data.inActiveCustomer}`,
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncUserSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#SyncCustomer").click();
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
  setInActiveCustomer
) => {
  setIsLoading(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/sync/static/customer/${data.ispOwner}/${data.mikrotikId}?inActiveCustomer=${data.inActiveCustomer}`,
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncSimpleQueueUserSuccess(res.data));
      console.log(res.data);
      setIsLoading(false);
      document.querySelector("#staticCustomerSync").click();
      langMessage(
        "success",
        "মাইক্রোটিক থেকে স্ট্যাটিক গ্রাহক সিঙ্ক সফল হয়েছে",
        "Static Customer Sync form Mikrotik is Successful"
      );
      setInActiveCustomer(false);
    })
    .catch((error) => {
      setIsLoading(false);
      toast.error(error.response?.data.message);
    });
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
export const postMikrotik = async (dispatch, data, setIsLoading) => {
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
      setIsLoading(false);
      document.querySelector("#MikrotikModal").click();
      langMessage(
        "success",
        "মাইক্রোটিক সংযুক্ত সফল হয়েছে",
        "Mikrotik Connected Successfully"
      );
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// PATCH mikrotik
export const editSingleMikrotik = async (dispatch, data) => {
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
      document.querySelector("#configMikrotikModal").click();
      langMessage(
        "success",
        "মাইক্রোটিক এডিট সফল হয়েছে",
        "Mikrotik Edited Successfully"
      );
    })
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
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
export const deleteSingleMikrotik = async (dispatch, IDs, setIsloading) => {
  setIsloading(true);
  await apiLink({
    method: "DELETE",
    url: `/mikrotik/${IDs.ispOwner}/${IDs.id}`,
  })
    .then((res) => {
      dispatch(deleteMikrotikSuccess(IDs.id));

      setIsloading(false);
      document.querySelector("#deleteMikrotikModal").click();
      langMessage(
        "success",
        "মাইক্রোটিক ডিলিট সফল হয়েছে",
        "Mikorik Deleted Successfully"
      );
    })
    .catch((error) => {
      setIsloading(false);
      toast.error(error.response?.data.message);
      document.querySelector("#deleteMikrotikModal").click();
    });
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

// get PPPoE user
export const fetchpppoeUser = async (
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
      url: `/mikrotik/PPPsecretUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });

    let customers = res.data?.customers;
    const pppsecretUsers = res.data?.pppsecretUsers;
    let interfaaceList = res.data?.interfaceList;
    let activepppSecretUsers = res.data?.activepppSecretUsers;

    customers = customers.map((customerItem) => {
      const lastLogout = pppsecretUsers.find(
        (j) => j?.name === customerItem.pppoe?.name
      );
      if (lastLogout) {
        customerItem = {
          ...customerItem,
          lastLogoutTime: lastLogout.lastLoggedOut,
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
  setIsLoading
) => {
  setIsLoading(true);
  dispatch(resetpppoeUser());
  dispatch(mtkIsLoading(true));
  try {
    const res = await apiLink({
      method: "GET",
      url: `/reseller/PPPsecretUsers/${IDs.resellerId}/${IDs.mikrotikId}`,
    });

    const pppsecretUsers = res.data?.secretCustomers;
    const interfaaceList = res.data?.interfaceList;
    const temp = [];

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
    dispatch(getpppoeUserSuccess(temp));
    dispatch(mtkIsLoading(false));
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
  resetForm
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
      document.querySelector("#pppoePackageEditModal").click();
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
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
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
export const postReseller = async (dispatch, data, setIsLoading, resetForm) => {
  setIsLoading(true);
  await apiLink({
    url: "/ispOwner/reseller",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  })
    .then((res) => {
      dispatch(addResellerSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#resellerModal").click();
      langMessage(
        "success",
        "রিসেলার এড সফল হয়েছে !",
        "Reseller Added Successfully"
      );
      resetForm();
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

// Edit reseller
export const editReseller = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  const { ispId, resellerId, ...rest } = data;
  await apiLink({
    url: `/ispOwner/reseller/${ispId}/${resellerId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: rest,
  })
    .then((res) => {
      dispatch(editResellerSuccess(res.data));
      setIsLoading(false);
      document.querySelector("#resellerModalEdit").click();
      langMessage(
        "success",
        "রিসেলার আপডেট সফল হয়েছে ",
        "Reseller Updated Successfully"
      );
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

//update reseller balance

export const updateResellerBalance = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  const { ispId, resellerId, ...rest } = data;
  try {
    setIsLoading(true);
    const res = await apiLink.patch(
      `/ispOwner/reseller/${ispId}/${resellerId}`,
      rest
    );
    dispatch(editResellerSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#resellerBalanceEditModal").click();
    langMessage(
      "success",
      "রিসেলার ব্যালেন্স আপডেট সফল হয়েছে ",
      "Reseller Balance Updated Successfully"
    );
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    }
  }
  setIsLoading(false);
};

// Delete reseller
export const deleteReseller = async (dispatch, IDs, setIsLoading) => {
  setIsLoading(true);
  const { ispId, resellerId } = IDs;
  await apiLink({
    url: `/ispOwner/reseller/${ispId}/${resellerId}`,
    method: "DELETE",
  })
    .then(() => {
      dispatch(deleteResellerSuccess(resellerId));
      setIsLoading(false);
      document.querySelector("#resellerModal").click();
      langMessage(
        "success",
        "রিসেলার ডিলিট সফল হয়েছে",
        "Reseller Deleted Successfully"
      );
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
};

//profile Update

// const profileUpdate =async(dispatch,data)=>{
//   try {
//     const res = await apiLink.post()

//   } catch (error) {
//     toast.success("Profile Update failed")

//   }

// }

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
  setLoading,
  resetForm = null
) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/bill/monthlyBill", billData);
    if (billData.userType === "pppoe") {
      dispatch(updateBalance(res.data));
    } else {
      dispatch(updateBalanceStaticCustomer(res.data));
    }
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();
    langMessage(
      "success",
      `${res.data.billType} বিল গ্রহণ সফল হয়েছে।`,
      `${res.data.billType} Acceptance is Successful.`
    );
    resetForm();
  } catch (error) {
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();
    toast.error(error.response?.data.message);
  }
};

export const addDeposit = async (dispatch, data, setLoading) => {
  setLoading(true);

  try {
    const res = await apiLink.post(`/deposit`, data);
    dispatch(addDepositSucces(res.data));
    console.log(res.data);
    setLoading(false);
    langMessage(
      "success",
      "এডমিন একসেপ্ট এর জন্য অপেক্ষা করেন",
      "Wait for Admin Accept"
    );
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data.message);
  }
};

//balance

export const getTotalbal = async (dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.get(`bill/monthlyBill/balance`);
    dispatch(getTotalBalanceSuccess(res.data));
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data.message);
  }
};

export const getDeposit = async (
  dispatch,
  data,
  userRole = null,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await apiLink.get(
      `/deposit/${data.depositerRole}/${data.ispOwnerID}`
    );
    if (userRole === "ispOwner") {
      if (data.depositerRole === "collector") {
        dispatch(getCollectorDeposite(res.data));
      } else {
        dispatch(getDepositSuccess(res.data));
      }
    } else {
      dispatch(getDepositSuccess(res.data));
    }
  } catch (error) {
    console.log(error);
    console.log(error.response?.data.message);
  }
  setLoading(false);
};

export const depositAcceptReject = async (
  dispatch,
  status,
  id,
  setAccLoading
) => {
  setAccLoading(true);
  try {
    const res = await apiLink.patch(`/deposit/${id}`, { status: status });
    dispatch(updateDepositSuccess(res.data));
    setAccLoading(false);
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
    setAccLoading(false);

    toast.error(error.response?.data.message);
  }
};

export const getAllBills = async (dispatch, ispOwnerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/bill/${ispOwnerId}`);
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
  data
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/bill/monthlyBill/${reportId}`, data);
    dispatch(editBillReportSuccess(res.data));
    document.getElementById("reportEditModal").click();
    langMessage("success", "নোট এডিট সফল হয়েছে", "Note Edited Successfully");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//my deposit

export const getMyDeposit = async (dispatch, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get("/deposit");
    dispatch(getmyDepositSucces(res.data));
  } catch (error) {
    console.log(error?.response?.data.message);
  }
  setIsLoading(false);
};

//Collector Bills

export const getCollectorBill = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get("/bill/monthlyBill");

    dispatch(getCollectorBills(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
  setIsLoading(false);
};

//recharge
//isp Owner end
export const recharge = async (
  data,
  setIsLoading,
  dispatch,
  inputForm = null
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/reseller/recharge", data);

    dispatch(editResellerforRecharge(res.data));
    setIsLoading(false);
    langMessage("success", "রিচার্জ সফল হয়েছে", "Recharge is Successful");
    document.getElementById("resellerRechargeModal").click();
    inputForm.current.value = "";
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
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

export const purchaseSms = async (data, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/sms`, data);

    setIsloading(false);
    langMessage(
      "success",
      "এসএমএস ইনভয়েস তৈরি সফল হয়েছে। কনফার্ম করতে হলে পেমেন্ট করুন।",
      "SMS Invoice Generation is Successful. Make Payment to Confirm"
    );
    window.location.href = "/invoice";
  } catch (err) {
    setIsloading(false);
    console.log("SMS purchase error: ", err);
  }
};

export const getUnpaidInvoice = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/dashboard/invoice/unpaid/${ispOwnerId}`);

    const invoice = res.data;
    if (
      invoice &&
      new Date(invoice?.dueDate).getTime() < new Date().getTime()
    ) {
      let invoiceType = "";
      if (invoice.type === "registration") invoiceType = "রেজিস্ট্রেশন ফি";
      else if (invoice.type === "monthlyServiceCharge")
        invoiceType = "মাসিক সার্ভিস চার্জ";

      let con = window.confirm(
        `নেটফি ${invoiceType} ${invoice.amount} Tk পরিশোধের শেষ সময় ${moment(
          invoice.dueDate
        ).format(
          "DD-MM-YYYY hh:mm:ss A"
        )} অতিবাহিত হয়েছে। অনুগ্রহ করে পেমেন্ট করুন।`
      );

      if (con || !con) {
        const res = await apiLink.post(
          `/payment/generate-payment-url`,
          invoice
        );

        dispatch(showModal(res.data));
        // window.location.href = res.data.paymentUrl;
      }
    }

    dispatch(getUnpaidInvoiceSuccess(invoice));
  } catch (err) {
    console.log("unpaid invoice error: ", err);
  }
};

//get ispwoner with
export const getIspownerwitSMS = async (ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/${ispOwnerId}`);
    // console.log(res.data);
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

//mikrotik packages without mikrotik access

export const getPackagewithoutmikrotik = async (
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
    dispatch(getpppoePackageSuccess(res.data.packages));
    setIsloading(false);
  } catch (error) {
    console.log(error.response?.data.message);
  }
};
export const addPackagewithoutmikrotik = async (
  data,
  dispatch,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/mikrotik/package`, data);
    // console.log(res.data.newPackage);
    dispatch(addPackageSuccess(res.data.newPackage));
    setIsLoading(false);
    document.querySelector("#createPackage").click();
    langMessage(
      "success",
      "প্যাকেজ সফলভাবে যুক্ত হয়েছে",
      "Package Added Successfully"
    );
  } catch (error) {
    console.log(error.response?.data.message);
    setIsLoading(false);
    langMessage("error", "প্যাকেজ অ্যাড ব্যর্থ হয়েছে", "Package Add Failed");
  }
};

export const addQueuePackage = async (data, dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`/mikrotik/queue/package`, data);
    // console.log(res.data.newPackage);
    dispatch(addPackageSuccess(res.data.newPackage));
    setIsLoading(false);
    document.querySelector("#createPackage").click();
    langMessage(
      "success",
      "প্যাকেজ সফলভাবে যুক্ত হয়েছে",
      "Package Added Successfully"
    );
  } catch (error) {
    console.log(error.response?.data.message);
    setIsLoading(false);
    langMessage("error", "প্যাকেজ অ্যাড ব্যর্থ হয়েছে", "Package Add Failed");
  }
};

export const editPackagewithoutmikrotik = async (
  data,
  dispatch,
  setIsLoading,
  packageId
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/mikrotik/package/${data?.id}`, data);
    // console.log(res.data.updatedPackage);
    dispatch(editPackageSuccess(res.data.updatedPackage));
    setIsLoading(false);
    document.querySelector("#editPackage").click();
    langMessage(
      "success",
      "প্যাকেজ এডিট সফল হয়েছে",
      "Package Updated Successfully"
    );
  } catch (error) {
    console.log(error.response?.data.message);
    setIsLoading(false);
    langMessage("success", "প্যাকেজ এডিট ব্যার্থ হয়েছে", "Package Add Failed");
  }
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
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
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

export const addExpenditure = async (dispatch, data, setLoading, resetForm) => {
  setLoading(true);
  try {
    const res = await apiLink.post(`/staff/expenditure`, data);
    dispatch(addExpenditureSuccess(res.data));

    langMessage("success", "সফল হয়েছে", "Expenditure Add Success");

    resetForm();
    setLoading(false);

    document.querySelector("#createExpenditure").click();
  } catch (error) {
    console.log(error.response?.data?.message);
    langMessage("error", "ব্যার্থ হয়েছে", "Faild");
    document.querySelector("#createExpenditure").click();
    resetForm();
    setLoading(false);
  }
};

export const editExpenditure = async (
  dispatch,
  data,
  expenditureId,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await apiLink.patch(
      `/staff/expenditure/${expenditureId}`,
      data
    );
    console.log(res.data);
    dispatch(editExpenditureSuccess(res.data));
    langMessage(
      "success",
      "খরচ আপডেট সফল হয়েছে",
      "Expenditure Updated Successfully"
    );
    document.querySelector("#editExpenditure").click();
    setLoading(false);
  } catch (error) {
    toast.error(error.response?.data?.message);
    // langMessage("error", "খরচ আপডেট ব্যর্থ হয়েছে", "Expenditure Update Failed");
    setLoading(false);
  }
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
  resetForm
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/staff/expenditurePurpose`, data);
    dispatch(addExpenditureSectorsSuccess(res.data));
    // console.log(res.data);
    setIsloading(false);
    document.querySelector("#createPourpose").click();
    langMessage(
      "success",
      "খরচ যুক্ত সফল হয়েছে",
      "Expenditure Added Successfully"
    );
    resetForm();
  } catch (error) {
    setIsloading(false);
    langMessage("error", "খরচ যুক্ত ব্যার্থ হয়েছে", "Expenditure Add Failed");
    resetForm();
  }
};
export const editExpenditurePourpose = async (dispatch, data, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.patch(
      `/staff/expenditurePurpose/` + data.id,
      data
    );
    dispatch(editExpenditureSectorsSuccess(res.data));
    setIsloading(false);
    document.querySelector("#editPurpose").click();
    langMessage(
      "success",
      "খরচ খাত সফলভাবে আপডেট হয়েছে",
      "Expenditure Type Updated Successfully"
    );
  } catch (error) {
    setIsloading(false);
    langMessage(
      "error",
      "খরচ খাত যুক্ত ব্যার্থ হয়েছে",
      "Expenditure Type Added Failed"
    );
  }
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
