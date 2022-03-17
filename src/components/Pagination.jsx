import ReactPaginate from "react-paginate";

export default function Pagination({
  customerPerPage,
  totalCustomers,
  paginate,
}) {
  const totalPage = Math.ceil(totalCustomers / customerPerPage);

  return (
    <>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={totalPage}
        marginPagesDisplayed={2}
        onPageChange={(e) => paginate(e.selected + 1)}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </>
  );
}
