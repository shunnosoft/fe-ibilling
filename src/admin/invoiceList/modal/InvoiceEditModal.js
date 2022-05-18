import React from "react";
import { useDispatch, useSelector } from "react-redux";

const InvoiceEditModal = ({ invoiceId }) => {
  console.log(invoiceId);

  const invoiceList = useSelector((state) => state.ownerInvoice.ownerInvoice);

  // get editable owner
  const ispOwnerInvoice = invoiceList.find((item) => item.id === invoiceId);

  //   let initialValues;
  //   if (ispOwnerInvoice) {
  //     initialValues = {
  //       amount: ispOwnerInvoice?.amount,
  //       status: ispOwnerInvoice?.status,
  //       dueDate: ispOwnerInvoice?.dueDate,
  //     };
  //   }

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="InvoiceEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Profile
                {/* <span className="text-success"> {ispOwner?.name}</span> */}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <p>hello</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditModal;
