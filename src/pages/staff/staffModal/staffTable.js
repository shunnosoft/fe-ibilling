import React from "react";
import { useTable } from "react-table";

const StaffTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="table-responsive-lg">
      <table className="table table-striped " {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    //     <div className="table-responsive-lg">
    //     <table className="table table-striped ">
    //       <thead>
    //         <tr>
    //           <th scope="col">Serial</th>
    //           <th scope="col">নাম</th>
    //           <th scope="col">এড্রেস</th>
    //           <th scope="col">মোবাইল</th>
    //           <th scope="col">ইমেইল</th>
    //           <th scope="col">রিচার্জ ব্যালান্স</th>
    //           <th scope="col" style={{ textAlign: "center" }}>
    //             অ্যাকশন
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {staff.length === undefined ? (
    //           <tr>
    //             <TdLoader colspan={6} />
    //           </tr>
    //         ) : (
    //           [].map((val, key) => (
    //             <tr key={key}>
    //               <td>{++serial}</td>
    //               <td>{val.name}</td>
    //               <td>{val.address}</td>
    //               <td>{val.mobile}</td>
    //               <td>{val.email}</td>
    //               <td>{val.rechargeBalance}</td>
    //               <td style={{ textAlign: "center" }}>
    //                 {/* dropdown */}

    //                 <ThreeDots
    //                   className="dropdown-toggle ActionDots"
    //                   id="resellerDropdown"
    //                   type="button"
    //                   data-bs-toggle="dropdown"
    //                   aria-expanded="false"
    //                 />

    //                 {/* modal */}
    //                 <ul className="dropdown-menu" aria-labelledby="resellerDropdown">
    //                   <li
    //                     data-bs-toggle="modal"
    //                     href="#resellerRechargeModal"
    //                     role="button"
    //                     onClick={() => {
    //                       getSpecificReseller(val.id);
    //                     }}
    //                   >
    //                     <div className="dropdown-item">
    //                       <div className="customerAction">
    //                         <Wallet />
    //                         <p className="actionP">রিচার্জ</p>
    //                       </div>
    //                     </div>
    //                   </li>
    //                   <li
    //                     data-bs-toggle="modal"
    //                     data-bs-target="#resellerDetailsModal"
    //                     onClick={() => {
    //                       getSpecificReseller(val.id);
    //                     }}
    //                   >
    //                     <div className="dropdown-item">
    //                       <div className="customerAction">
    //                         <PersonFill />
    //                         <p className="actionP">প্রোফাইল</p>
    //                       </div>
    //                     </div>
    //                   </li>
    //                   <li
    //                     data-bs-toggle="modal"
    //                     data-bs-target="#resellerModalEdit"
    //                     onClick={() => {
    //                       getSpecificReseller(val.id);
    //                     }}
    //                   >
    //                     <div className="dropdown-item">
    //                       <div className="customerAction">
    //                         <PenFill />
    //                         <p className="actionP">এডিট</p>
    //                       </div>
    //                     </div>
    //                   </li>

    //                   <li
    //                     onClick={() => {
    //                       deleteSingleReseller(val.ispOwner, val.id);
    //                     }}
    //                   >
    //                     <div className="dropdown-item actionManager">
    //                       <div className="customerAction">
    //                         <ArchiveFill />
    //                         <p className="actionP">ডিলিট</p>
    //                       </div>
    //                     </div>
    //                   </li>
    //                 </ul>
    //                 {/* dropdown */}
    //               </td>
    //             </tr>
    //           ))
    //         )}
    //       </tbody>
    //     </table>
    //   </div>;
  );
};

export default StaffTable;
