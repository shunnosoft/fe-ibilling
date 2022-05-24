// import React from "react";
import React, { useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { ArrowDownUp } from "react-bootstrap-icons";
// import { Pagination, Pagination.Item, PaginationLink } from "reactstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import TdLoader from "../common/TdLoader";
import { badge } from "../common/Utils";
import GlobalFilter from "./GlobalFilter";
const Table = (props) => {
  const { columns, data, isLoading, customComponent } = props;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,

    gotoPage,
    pageCount,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  useEffect(() => {
    setPageSize(100);
  }, []);

  const { globalFilter, pageIndex, pageSize } = state;
  console.log(columns);

  return (
    <>
      <GlobalFilter
        filter={globalFilter}
        setFilter={setGlobalFilter}
        data={data}
        customComponent={customComponent}
      />
      <div className="table-responsive-lg mt-4">
        <table
          className="table table-striped table-borderless"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}

                    {column.id === "option" || column.id === "option1" ? (
                      ""
                    ) : (
                      <ArrowDownUp key={column.id} className="arrowDownUp" />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isLoading ? (
            <TdLoader colspan={columns.length} />
          ) : (
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td key={i} className="align-middle">
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      <div className="d-flex justify-content-between">
        <div className="col-md-2">
          <select
            className="form-select"
            aria-label="Default select example"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            {[100, 200, 500, 1000].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <Pagination aria-label="Page navigation example">
          <Pagination.First
            disabled={!canPreviousPage}
            onClick={() => gotoPage(0)}
          ></Pagination.First>
          <Pagination.Prev
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          ></Pagination.Prev>

          <Pagination.Item active>{pageIndex + 1}</Pagination.Item>
          <Pagination.Ellipsis />
          {/* <Pagination.Item>{pageOptions.length}</Pagination.Item> */}
          <Pagination.Next onClick={() => nextPage()}></Pagination.Next>
          <Pagination.Last
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          ></Pagination.Last>
        </Pagination>
      </div>
    </>
  );
};

export default Table;
