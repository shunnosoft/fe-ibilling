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
} from "./customerSlice";
import {
  addMikrotikSuccess,
  deleteMikrotikSuccess,
  deletepppoePackageSuccess,
  editMikrotikSuccess,
  editpppoePackageSuccess,
  fetchMikrotikSyncUserSuccess,
  getMikrotikSuccess,
  getpppoeActiveUserSuccess,
  getpppoePackageSuccess,
  getpppoeUserSuccess,
} from "./mikrotikSlice";
import {
  addResellerSuccess,
  deleteResellerSuccess,
  editResellerforRecharge,
  editResellerSuccess,
  getResellerrSuccess,
} from "./resellerSlice";
import { updateProfile } from "./authSlice";
import {
  getAllBillsSuccess,
  getDepositSuccess,
  getmyDepositSucces,
  getTotalBalanceSuccess,
  updateDepositSuccess,
} from "./paymentSlice";
import { getChartSuccess } from "./chartsSlice";
import { getAllRechargeHistory } from "./rechargeSlice";
import { getInvoiceListSuccess, getUnpaidInvoiceSuccess } from "./invoiceSlice";
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

export const getCharts = async (dispatch, ispOwnerId, Year, Month, User) => {
  try {
    let link = `/dashboard/${ispOwnerId}?year=${Year}&month=${Month}`;
    if (User)
      link = `/dashboard/${ispOwnerId}?year=${Year}&month=${Month}&user=${User}`;
    const res = await apiLink(link);
    dispatch(getChartSuccess(res.data));
  } catch (err) {
    console.log("Charts error: ", err);
  }
};

export const addManager = async (dispatch, managerData) => {
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";

  await apiLink({
    url: "/ispOwner/manager",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: managerData,
  })
    .then((res) => {
      dispatch(managerAddSuccess(res.data));
      button.style.display = "initial";
      toast.success("ম্যানেজার সংযুক্ত সফল হয়েছে");
      document.querySelector("#writeModal").click();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        toast.error("ম্যানেজার সংযুক্ত সফল হয়নি");
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
    toast.success("ম্যানেজার আপডেট সফল হয়েছে");
  } catch (error) {
    setIsLoading(false);

    button.style.display = "initial";
    toast.error("ম্যানেজার আপডেট সফল হয়নি");
  }
};

//Areas

export const getArea = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/area/${ispOwnerId}`);
    dispatch(FetchAreaSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
};

export const addArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("/ispOwner/area", data);

    dispatch(AddAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#areaModal").click();
    toast.success("এরিয়া সংযুক্ত সফল হয়েছে ");
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
    toast.success("এরিয়া এডিট সফল হয়েছে");
  } catch (error) {
    setIsLoading(false);
    toast.error("এরিয়া এডিট সফল হয়নি");
  }
};

export const deleteArea = async (dispatch, data, setIsLoading) => {
  try {
    await apiLink.delete(`/ispOwner/area/${data.ispOwner}/${data.id}`);
    dispatch(DeleteAreaSuccess(data.id));
    setIsLoading(false);
    toast.success("এরিয়া ডিলিট সফল হয়েছে");
  } catch (error) {
    setIsLoading(false);
    toast.error("এরিয়া ডিলিট সফল হয়নি");
  }
};

//subarea

export const addSubArea = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("/ispOwner/subArea", data);

    dispatch(AddSubAreaSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#subAreaModal").click();
    toast.success("সাব-এরিয়া সংযুক্ত সফল হয়েছে");

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
      toast.success("সাব-এরিয়া আপডেট সফল হয়েছে");
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
        toast.success("সাব-এরিয়া ডিলিট সফল হয়েছে");
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

export const getCollector = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/collector/${ispOwnerId}`);
    dispatch(getCollectorSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

export const addCollector = async (dispatch, data, setIsLoading) => {
  try {
    const res = await apiLink.post("ispOwner/collector", data);
    dispatch(addCollectorSuccess(res.data));
    setIsLoading(false);
    toast.success("কালেক্টর সংযুক্ত সফল হয়েছে! ");
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
  try {
    const res = await apiLink.patch(
      `ispOwner/collector/${ispOwnerId}/${collectorId}`,
      rest
    );
    dispatch(editCollectorSuccess(res.data));
    setIsLoading(false);
    toast.success("কালেক্টর এডিট সফল হয়েছে! ");
    document.querySelector("#collectorEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteCollector = async (dispatch, ids, setIsDeleting) => {
  setIsDeleting(true);
  try {
    await apiLink.delete(
      `ispOwner/collector/${ids.ispOwnerId}/${ids.collectorId}`
    );
    dispatch(deleteCollectorSuccess(ids.collectorId));
    setIsDeleting(false);
    toast.success("কালেক্টর ডিলিট সফল হয়েছে");
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
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

export const addCustomer = async (dispatch, data, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.post("/ispOwner/customer", data);
    dispatch(addCustomerSuccess(res.data));
    setIsloading(false);
    toast.success("কাস্টমার সংযুক্ত সফল হয়েছে! ");
    document.querySelector("#customerModal").click();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editCustomer = async (dispatch, data, setIsloading) => {
  console.log("Edit Data: ", data);
  const { singleCustomerID, ispOwner, ...sendingData } = data;
  try {
    const res = await apiLink.patch(
      `/ispOwner/customer/${ispOwner}/${singleCustomerID}`,
      sendingData
    );
    dispatch(editCustomerSuccess(res.data));
    setIsloading(false);
    toast.success("কাস্টমার এডিট সফল হয়েছে!");
    document.querySelector("#customerEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteACustomer = async (dispatch, IDs) => {
  try {
    await apiLink.delete(`/ispOwner/customer/${IDs.ispID}/${IDs.customerID}`);
    dispatch(deleteCustomerSuccess(IDs.customerID));

    toast.success("কাস্টমার ডিলিট সফল হয়েছে! ");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
};

//Mikrotik

// get Mikrotik Sync user
export const fetchMikrotikSyncUser = async (dispatch, IDs, setIsLoadingCus) => {
  setIsLoadingCus(true);
  await apiLink({
    method: "GET",
    url: `/mikrotik/customer/${IDs.ispOwner}/${IDs.mikrotikId}`,
  })
    .then((res) => {
      dispatch(fetchMikrotikSyncUserSuccess(res.data));
      setIsLoadingCus(false);
      toast.success("মাইক্রোটিক থেকে PPPoE গ্রাহক সিঙ্ক সফল হয়েছে");
    })
    .catch((error) => {
      setIsLoadingCus(false);
      toast.error(error.response?.data.message);
    });
};

// GET mikrotik
export const fetchMikrotik = async (dispatch, ispOwnerId) => {
  try {
    const response = await apiLink({
      method: "GET",
      url: `/mikrotik/${ispOwnerId}`,
    });
    dispatch(getMikrotikSuccess(response.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
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
      toast.success("মাইক্রোটিক সংযুক্ত সফল হয়েছে ");
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
      toast.success("মাইক্রোটিক এডিট সফল হয়েছে ");
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
    toast.error("Single mikrotik not found!");
  }
};

// DELETE single mikrotik
export const deleteSingleMikrotik = async (
  dispatch,
  IDs,
  setIsloading,
  navigate
) => {
  setIsloading(true);
  await apiLink({
    method: "DELETE",
    url: `/mikrotik/${IDs.ispOwner}/${IDs.id}`,
  })
    .then((res) => {
      dispatch(deleteMikrotikSuccess(IDs.id));
      setIsloading(false);
      toast.success("মাইক্রোটিক ডিলিট সফল হয়েছে");
      navigate("/mikrotik");
    })
    .catch((error) => {
      setIsloading(false);
      toast.error(error.response?.data.message);
    });
};

//  test
export const mikrotikTesting = async (IDs) => {
  await apiLink({
    method: "GET",
    url: `/mikrotik/testConnection/${IDs.ispOwner}/${IDs.id}`,
  })
    .then(() => {
      toast.success("মাইক্রোটিক কানেকশন ঠিক আছে");
    })
    .catch((err) => {
      toast.error("দুঃখিত, মাইক্রোটিক কানেকশন নাই!");
    });
};

// get PPPoE user
export const fetchpppoeUser = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPsecretUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    dispatch(getpppoeUserSuccess(res.data));
  } catch (error) {
    toast.error("PPPoE গ্রাহক পাওয়া যায়নি!");
  }
};

// get PPPoE Active user
export const fetchActivepppoeUser = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPactiveUsers/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    dispatch(getpppoeActiveUserSuccess(res.data));
  } catch (error) {
    toast.error("এক্টিভ গ্রাহক পাওয়া যায়নি!");
  }
};

// get pppoe Package
export const fetchpppoePackage = async (dispatch, IDs) => {
  try {
    const res = await apiLink({
      method: "GET",
      url: `/mikrotik/PPPpackages/${IDs.ispOwner}/${IDs.mikrotikId}`,
    });
    dispatch(getpppoePackageSuccess(res.data));
    toast.success("PPPoE প্যাকেজ fetch success");
  } catch (error) {
    toast.error("PPPoE প্যাকেজ পাওয়া যায়নি!");
  }
};

// Edit pppoe Package
export const editPPPoEpackageRate = async (dispatch, data) => {
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
      toast.success("PPPoE প্যাকেজ রেট এডিট সফল হয়েছে!");
    })
    .catch((err) => {
      if (err.response) {
        toast.error("Error! ", err.response.message);
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
      document.querySelector("#pppoePackageEditModal").click();
      toast.success("PPPoE প্যাকেজ ডিলিট সফল হয়েছে!");
    })
    .catch((err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    });
};

// Reseller

// GET reseller
export const fetchReseller = async (dispatch, ispOwner) => {
  try {
    const res = await apiLink.get(`/ispOwner/reseller/${ispOwner}`);
    dispatch(getResellerrSuccess(res.data));
  } catch (error) {
    console.log(error.message);
  }
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
      resetForm();
      toast.success("রিসেলার এড সফল হয়েছে !");
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
      toast.success("রিসেলার আপডেট সফল হয়েছে !");
    })
    .catch((err) => {
      if (err.response) {
        setIsLoading(false);
        toast.error(err.response.data.message);
      }
    });
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
      toast.success("রিসেলার ডিলিট সফল হয়েছে");
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
export const passwordUpdate = async (data, setIsLoadingpass) => {
  setIsLoadingpass(true);

  try {
    await apiLink.post(`/auth/update-password`, data);
    setIsLoadingpass(false);
    toast.success("পাসওয়ার্ড আপডেট সফল হয়েছে");
  } catch (error) {
    console.log(error.message);
    setIsLoadingpass(false);
    toast.error(error.response?.data.message);
  }
};

export const profileUpdate = async (dispatch, data, id, setIsLoading) => {
  setIsLoading(true);

  try {
    const res = await apiLink.patch(`/ispOwner/${id}`, data);
    console.log(res.data);
    dispatch(updateProfile(res.data));
    setIsLoading(false);
    toast.success("প্রোফাইল আপডেট সফল হয়েছে");
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
};

//Bill

export const billCollect = async (dispatch, billData, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/bill/monthlyBill", billData);
    dispatch(updateBalance(res.data));
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();

    toast.success("বিল গ্রহণ সফল হয়েছে।");
  } catch (error) {
    setLoading(false);
    document.querySelector("#collectCustomerBillModal").click();

    toast.error(error.response?.data.message);
  }
};

export const addDeposit = async (dispatch, data, setLoading) => {
  setLoading(true);
  // console.log(data, "from api calls");

  try {
    await apiLink.post(`/deposit`, data);

    // dispatch(addDepositSuccess(res.data));
    setLoading(false);
    toast.success("ডিপোজিট প্রদান সফল হয়েছে");
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data.message);
    // if (error.response.status === 400) {
    //   toast.success("ডিপোজিট অলরেডি পেন্ডিং এ আছে");
    // } else {

    // }
  }
};

//balance

export const getTotalbal = async (dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.get(`bill/monthlyBill/balance`);
    console.log(res.data);
    dispatch(getTotalBalanceSuccess(res.data));
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data.message);
  }
};

export const getDeposit = async (dispatch, data) => {
  try {
    const res = await apiLink.get(
      `/deposit/${data.depositerRole}/${data.ispOwnerID}`
    );

    dispatch(getDepositSuccess(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

export const depositAcceptReject = async (
  dispatch,
  status,
  id,
  setAccLoading
) => {
  console.log(status, id);
  setAccLoading(true);
  try {
    const res = await apiLink.patch(`/deposit/${id}`, { status: status });
    dispatch(updateDepositSuccess(res.data));
    setAccLoading(false);
    toast.success("ডিপোজিট গ্রহণ সফল হয়েছে।");
  } catch (error) {
    setAccLoading(false);

    toast.error(error.response?.data.message);
  }
};

export const getAllBills = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/bill/${ispOwnerId}`);
    dispatch(getAllBillsSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

//my deposit

export const getMyDeposit = async (dispatch) => {
  try {
    const res = await apiLink.get("/deposit");
    dispatch(getmyDepositSucces(res.data));
  } catch (error) {
    console.log(error?.response?.data.message);
  }
};

//Collector Bills

export const getCollectorBill = async (dispatch) => {
  try {
    const res = await apiLink.get("/bill/monthlyBill");

    dispatch(getCollectorBills(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

//recharge
//isp Owner end
export const recharge = async (data, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/reseller/recharge", data);

    dispatch(editResellerforRecharge(res.data));
    setIsLoading(false);
    toast.success("রিচার্জ সফল হয়েছে");
  } catch (error) {
    setIsLoading(false);
    toast.error(error.response?.data.message);
  }
};

export const rechargeHistoryfunc = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/recharge/${ispOwnerId}`);
    dispatch(getAllRechargeHistory(res.data));
  } catch (error) {
    console.log(error.response?.data.message);
  }
};

export const getInvoices = async (dispatch, ispOwnerId, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink(`/ispOwner/invoice/${ispOwnerId}`);

    dispatch(getInvoiceListSuccess(res.data));
    setIsloading(false);
  } catch (err) {
    setIsloading(false);
    console.log("Invoice error: ", err);
  }
};

export const initiatePayment = async (invoice) => {
  try {
    const res = await apiLink.post(`/payment/generate-payment-url`, invoice);

    window.location.href = res.data.paymentUrl;
  } catch (err) {
    console.log("Invoice error: ", err);
  }
};

export const purchaseSms = async (data, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/sms`, data);

    setIsloading(false);
    toast.success(
      "এসএমএস ইনভয়েস তৈরি সফল হয়েছে। কনফার্ম করতে হলে পেমেন্ট করুন।"
    );
    setTimeout(() => {
      window.location.href = "/invoice";
    }, 5000);
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
      let con = window.confirm(
        `নেটফি রেজিস্ট্রেশন ফি ${invoice.amount} Tk পরিশোধের শেষ সময় ${moment(
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

        window.location.href = res.data.paymentUrl;
      }
    }

    dispatch(getUnpaidInvoiceSuccess(invoice));
  } catch (err) {
    console.log("unpaid invoice error: ", err);
  }
};
