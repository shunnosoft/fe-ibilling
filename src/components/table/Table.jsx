// import React from "react";
import React, { useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import TdLoader from "../common/TdLoader";
import GlobalFilter from "./GlobalFilter";
import { useTranslation } from "react-i18next";

const Table = (props) => {
  const { t } = useTranslation();
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
    pageOptions,
    state,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    { columns, data, autoResetGlobalFilter: false },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  const { globalFilter, pageIndex, pageSize } = state;

  useEffect(() => {
    setPageSize(100);
  }, []);

  useEffect(() => {
    if (props.bulkState) {
      props?.bulkState.setBulkCustomer(selectedFlatRows);
    }
  }, [selectedFlatRows]);
  return (
    <>
      <GlobalFilter
        filter={globalFilter}
        data={data}
        setFilter={setGlobalFilter}
        customComponent={customComponent}
      />

      <div className="table-responsive-lg">
        <table
          className="table table-striped table-borderless"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    {...column.getHeaderProps({
                      style: { width: column.width, cursor: "pointer" },
                    })}
                  >
                    {column.render("Header")}

                    {column.id === "option" ||
                    column.id === "option1" ||
                    column.id === "selection" ? (
                      ""
                    ) : (
                      <>
                        <ArrowDown
                          className={`arrowDown sorting-data text-primary ${
                            column.isSorted &&
                            (column.isSortedDesc ? "" : "text-danger")
                          } `}
                        />
                        <ArrowUp
                          className={`arrowUp sorting-data text-primary ${
                            column.isSorted &&
                            (column.isSortedDesc ? "text-danger" : "")
                          } `}
                        />
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isLoading ? (
            <TdLoader colspan={columns.length} />
          ) : data.length > 0 ? (
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          {...cell.getCellProps({
                            style: {
                              width: cell.column.width,
                            },
                          })}
                          key={i}
                          className="align-middle"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <h5 className="text-center"> {t("noDataFound")} </h5>
              </td>
            </tr>
          )}
        </table>
      </div>
      {data?.length > 100 && (
        <div className="d-flex justify-content-between">
          <div className="col-md-2">
            <select
              className="form-select"
              aria-label="Default select example"
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              {[100, 200, 500, 1000, 5000].map((pageSize) => (
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
            <Pagination.Item>of</Pagination.Item>
            <Pagination.Item>{pageOptions.length}</Pagination.Item>
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!canNextPage}
            ></Pagination.Next>
            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            ></Pagination.Last>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default Table;
