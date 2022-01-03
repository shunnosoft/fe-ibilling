import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";

// getIspOwner
const ispOwner = JSON.parse(localStorage.getItem("ispWoner"));

const hideModal = () => {
  const alertData = document.getElementById("successAlert");
  const button = document.querySelector(".marginLeft");

  button.style.display = "initial";

  // close modal
  document.querySelector("#closeAddManagerBtn").click();
  alertData.classList.add("alertShow");

  setTimeout(() => {
    alertData.classList.remove("alertShow");
  }, 5000);
};

export const addNewManager = async (managerData) => {
  const button = document.querySelector(".marginLeft");

  button.style.display = "none";

  const mainData = { ...managerData, ispOwner: ispOwner.id };

  await apiLink({
    url: "/v1/ispOwner/manager",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: mainData,
  })
    .then((res) => {
      console.log(res.data);
      button.style.display = "initial";
      hideModal();
      window.location.reload();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        toast(err.response.data.message);
      }
    });
};

export const editManager = async (managerData) => {
  const button = document.querySelector(".marginLeft");

  button.style.display = "none";

  const mainData = { ...managerData, ispOwner: ispOwner.id };

  await apiLink({
    url: `/v1/ispOwner/manager/${ispOwner.id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: mainData,
  })
    .then((res) => {
      console.log(res.data);
      button.style.display = "initial";
      hideModal();
      window.location.reload();
    })
    .catch((err) => {
      if (err.response) {
        button.style.display = "initial";
        toast(err.response.data.message);
      }
    });
};

export const deleteManager = async () => {
  await apiLink({
    url: `/v1/ispOwner/manager/${ispOwner.id}`,
    method: "DELETE",
  })
    .then((res) => {
      window.location.reload();
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};
