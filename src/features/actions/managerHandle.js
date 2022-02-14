// import apiLink from "../../api/apiLink";
// import { toast } from "react-toastify";
 



export const hideModal = () => {
  // const alertData = document.getElementById("successAlert");
  const button = document.querySelector(".marginLeft");
  button.style.display = "initial";
  // close modal
  document.querySelector("#closeAddManagerBtn").click();
  // alertData.classList.add("alertShow");

  // setTimeout(() => {
  //   alertData.classList.remove("alertShow");
  // }, 5000);
};
 
 