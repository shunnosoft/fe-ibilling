import React, { useState } from "react";
import Loader from "../../../components/common/Loader";
import { uploadCsvFile } from "../../../features/apiCallAdmin";

const FileUpload = ({ ownerID }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("ispOwner", ownerID);

    uploadCsvFile(formData, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="fileUploadModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title" id="exampleModalLabel">
              <div className="d-flex">
                <h5>
                  {/* Id: <span className="text-success"> {ispOwner?.id} </span> */}
                </h5>
                <h5 className="ms-5">
                  Mobile:
                  {/* <span className="text-success"> {ispOwner?.mobile}</span> */}
                </h5>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* model body here */}
            <label>CSV File</label>
            <form>
              <input
                type={"file"}
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleChange}
              />
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? <Loader /> : "Submit"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
