import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import Loader from "../components/common/Loader";
import { useSelector } from "react-redux";

function PasswordReset() {
  // get own data
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );
  console.log(userData);

  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return alert("Please fill out all field");
    }
    const data = {
      oldPassword,
      newPassword,
    };

    setLoading(true);
    try {
      await apiLink.post("/auth/update-password/", data);
      toast.success("Password reset successful");
    } catch (error) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="password_reset_form">
      <main className="restForm-wraper">
        <form onSubmit={submitForm} className="text-white">
          <h1 className="h3 mb-3 fw-normal">Reset Your Password</h1>

          <div className="mb-2">
            <label className="form-label" for="oldPassword">
              Old password
            </label>
            <input
              type="text"
              className="form-control"
              id="oldPassword"
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label" for="newPassword">
              New password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              placeholder="new password"
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label" for="ConfirmNewPassword">
              Confirm new password
            </label>
            <input
              type="password"
              className="form-control"
              id="ConfirmNewPassword"
              placeholder="new password"
            />
          </div>

          <button
            className="w-100 btn  btn-success"
            type="submit"
            disabled={userData?.ispOwner.id === "624f41a4291af1f48c7d75c7"}
          >
            {loading ? <Loader /> : "Reset Password"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default PasswordReset;
