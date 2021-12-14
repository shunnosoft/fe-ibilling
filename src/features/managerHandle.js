import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

const hideModal = () => {
  const alertData = document.getElementById("successAlert");
  const button = document.querySelector(".marginLeft");

  button.style.display = "initial";

  // close modal
  document.querySelector(".btn-close").click();
  alertData.classList.add("alertShow");

  setTimeout(() => {
    alertData.classList.remove("alertShow");
  }, 5000);
};

export const addNewManager = async (managerData) => {
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
      console.log(res.data);
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
