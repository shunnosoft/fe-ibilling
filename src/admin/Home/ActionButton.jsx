// import React from "react";
// import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";

// export default function ActionButton({
//   getSpecificArea,
//   deleteSingleArea,
//   data,
// }) {
//   return (
//     <>
//       <ThreeDots
//         className="dropdown-toggle ActionDots"
//         id="areaDropdown"
//         type="button"
//         data-bs-toggle="dropdown"
//         aria-expanded="false"
//       />
//       <ul className="dropdown-menu" aria-labelledby="areaDropdown">
//         <li
//           data-bs-toggle="modal"
//           data-bs-target="#clientEditModal"
//           onClick={() => {
//             editModal(original.id);
//           }}
//         >
//           <div className="dropdown-item">
//             <div className="customerAction">
//               <PenFill />
//               <p className="actionP">এডিট</p>
//             </div>
//           </div>
//         </li>

//         <li
//         // onClick={() => {
//         //   deleteSingleArea(data.id, data.ispOwner);
//         // }}
//         >
//           <div className="dropdown-item actionManager">
//             <div className="customerAction">
//               <ArchiveFill />
//               <p className="actionP">ডিলিট</p>
//             </div>
//           </div>
//         </li>
//       </ul>
//     </>
//   );
// }
