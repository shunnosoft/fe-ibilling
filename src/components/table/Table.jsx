// import React from "react";
import React, { useEffect, useRef, useState } from "react";
import { Pagination } from "react-bootstrap";
import { ArrowDown, ArrowUp, GearFill } from "react-bootstrap-icons";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import TdLoader from "../common/TdLoader";
import GlobalFilter from "./GlobalFilter";
import "./style/style.css";
import { useTranslation } from "react-i18next";

const Table = (props) => {
  const { t } = useTranslation();
  const { columns, data, isLoading, customComponent, bulkLength } = props;
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
    allColumns,
    getToggleHideAllColumnsProps,
    rows,
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
  const [isActive, setIsActive] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const toggleColumnRef = useRef();

  const handleToggleColumn = () => {
    setIsActive(!isActive);
  };

  const paginationHandler = () => {
    setIsPagination(!isPagination);
  };

  return (
    <>
      <GlobalFilter
        filter={globalFilter}
        data={rows}
        setFilter={setGlobalFilter}
        customComponent={customComponent}
        bulkLength={bulkLength}
        toggleColumnButton={
          <div ref={toggleColumnRef} className="toggle-column-header w-100">
            <div
              className="d-flex justify-content-center align-items-center ms-1"
              style={{ marginTop: "-5px" }}
            >
              <div className="toggle-setting">
                <div className="text-white me-2" onClick={handleToggleColumn}>
                  <GearFill />
                </div>

                <div className={`toggle-column-modal ${isActive && "active"}`}>
                  <div class="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      {...getToggleHideAllColumnsProps()}
                    />
                    <label class="form-check-label">Show All</label>
                  </div>

                  {allColumns.map((item) => (
                    <div class="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        {...item.getToggleHiddenProps()}
                      />
                      <label class="form-check-label">{item.Header}</label>
                    </div>
                  ))}
                </div>
              </div>

              {data?.length > 100 && (
                <div className="toggle-pagination">
                  <div
                    className="text-white me-2"
                    onClick={paginationHandler}
                    title={t("totalPages")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-database-fill-gear"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1Z" />
                      <path d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12.31 12.31 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7Zm6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.552 4.552 0 0 1 .23-2.002Zm-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.507 4.507 0 0 1-1.3-1.905Zm3.631-4.538c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                    </svg>
                  </div>

                  <div
                    className={`toggle-column-modal-pagination ${
                      isPagination && "active"
                    }`}
                  >
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={pageSize}
                      onChange={(event) =>
                        setPageSize(Number(event.target.value))
                      }
                    >
                      {[100, 200, 500, 1000, 5000, data.length].map(
                        (pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize === data.length ? "All" : pageSize}
                          </option>
                        )
                      )}
                    </select>

                    <div className="w-100s">
                      <Pagination
                        aria-label="Page navigation example"
                        className="pagination"
                      >
                        <Pagination.First
                          disabled={!canPreviousPage}
                          onClick={() => gotoPage(0)}
                        ></Pagination.First>
                        <Pagination.Prev
                          onClick={() => previousPage()}
                          disabled={!canPreviousPage}
                        ></Pagination.Prev>

                        <Pagination.Item active>
                          {pageIndex + 1}
                        </Pagination.Item>

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
                  </div>
                </div>
              )}
            </div>
          </div>
        }
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
              {[100, 200, 500, 1000, 5000, data.length].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize === data.length ? "All" : pageSize}
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

export default React.memo(Table);
