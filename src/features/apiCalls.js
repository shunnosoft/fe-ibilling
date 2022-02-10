import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import {
  managerAddSuccess,
  managerDeleteSuccess,
  managerEditSuccess,
  managerFetchFailure,
  managerFetchStart,
  managerFetchSuccess,
} from "./managerSlice";
import { hideModal } from "./actions/managerHandle";

//manager
export const getManger = async (dispatch, ispWonerId) => {
  dispatch(managerFetchStart());
  try {
    const res = await apiLink.get(`/v1/ispOwner/manager/${ispWonerId}`);
    dispatch(managerFetchSuccess(res.data));
  } catch (error) {
    dispatch(managerFetchFailure());
    toast("Manager load bertho hoyeche");
  }
};

export const addManager = async (dispatch, managerData) => {
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";

  await apiLink({
    url: "/v1/ispOwner/manager",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: managerData,
  })
    .then((res) => {
      dispatch(managerAddSuccess());
      button.style.display = "initial";
      hideModal();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        toast(err.response.data.message);
      }
    });
};

export const deleteManager = async (dispatch, ispOwnerId) => {
  await apiLink({
    url: `/v1/ispOwner/manager/${ispOwnerId}`,
    method: "DELETE",
  })
    .then((res) => {
      dispatch(managerDeleteSuccess(res.data));
      window.location.reload();
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

export const editManager = async (dispatch, managerData) => {
  const button = document.querySelector(".marginLeft");
  button.style.display = "none";
  try {
    const res = await apiLink.patch(
      `/v1/ispOwner/manager/${managerData.ispOwner}`,
      managerData
    );

    dispatch(managerEditSuccess(res.data));
    button.style.display = "initial";
    hideModal();
    toast("Manager edit successfull");
  } catch (error) {
    button.style.display = "initial";
    toast("Manager edit Failed");
  }
};
