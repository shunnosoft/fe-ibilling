// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import { getCustomerInfo, getIspOwner } from "../../features/qrCodeApi";

// const QRCodePay = () => {
//   const [ispInfo, setIspInfo] = useState();
//   const [customerInfo, setCustomerInfo] = useState();
//   const [searchType, setSearchType] = useState("mobile");
//   const [input, setInput] = useState("");

//   // const { ispId } = useParams();
//   const ispId = "1095";
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     getIspOwner(ispId, setIsLoading, setIspInfo);
//   }, [ispId]);

//   const getCustomerHandler = () => {
//     getCustomerInfo(
//       ispInfo.id,
//       setIsLoading,
//       setCustomerInfo,
//       searchType,
//       input
//     );
//   };

//   return (
//     <>
//       <div className="ispOwner">
//         <div className="container offset-1">
//           <div className="row">
//             <div className="jumbotron">
//               <h4 className="customer p-3">ispOwner Information</h4>
//               <div className="mb-5">
//                 <table className="client_info">
//                   <tr>
//                     <td>ID</td>
//                     <td>{ispInfo.id}</td>
//                   </tr>
//                   <tr>
//                     <td>Company</td>
//                     <td>{ispInfo.company}</td>
//                   </tr>
//                   <tr>
//                     <td>Name</td>
//                     <td>{ispInfo.name}</td>
//                   </tr>
//                   <tr>
//                     <td>Mobile</td>
//                     <td>{ispInfo.mobile}</td>
//                   </tr>
//                   <tr>
//                     <td>Email</td>
//                     <td>{ispInfo.email}</td>
//                   </tr>
//                   <tr>
//                     <td>Address</td>
//                     <td>{ispInfo.address}</td>
//                   </tr>
//                 </table>
//               </div>
//             </div>

//             <div className="customerInfo mt-5">
//               <div className="support-message-form">
//                 <select
//                   class="form-select selectInfo shadow-none m-0"
//                   onChange={(e) => setSearchType(e.target.value)}
//                 >
//                   <option value="customerId">Customer Id</option>
//                   <option value="mobile" selected>
//                     Mobile
//                   </option>
//                 </select>

//                 <input
//                   className="form-control shadow-none ms-2"
//                   type="text"
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder={
//                     searchType === "mobile"
//                       ? "Input your mobile number"
//                       : "Input your customer Id"
//                   }
//                 />

//                 <button
//                   onClick={getCustomerHandler}
//                   className="btn btn-sm btn-success ms-2 shadow-none"
//                 >
//                   {isLoading ? "Loading" : "Search"}
//                 </button>
//               </div>
//             </div>
//             {customerInfo && (
//               <div className="customerInfo">
//                 <h5 className="customer-title">Customer Profile</h5>
//                 <div className="mb-5">
//                   <table className="customer-info table table-condensed">
//                     <tr>
//                       <td>ID</td>
//                       <td>ID</td>
//                     </tr>
//                     <tr>
//                       <td>Company</td>
//                       <td>Company</td>
//                     </tr>
//                     <tr>
//                       <td>Name</td>
//                       <td>Name</td>
//                     </tr>
//                     <tr>
//                       <td>Mobail</td>
//                       <td>Mobail</td>
//                     </tr>
//                     <tr>
//                       <td>Email</td>
//                       <td>Email</td>
//                     </tr>
//                     <tr>
//                       <td>Address</td>
//                       <td>Address</td>
//                     </tr>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default QRCodePay;
