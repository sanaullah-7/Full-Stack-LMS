

const Pagination = ({
  currentPage = 1,
  totalPages = 5,
  onPageChange = () => {},
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <nav className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`inline-flex h-9 min-w-[2rem] items-center justify-center rounded-md border px-3 text-sm transition ${
              page === currentPage
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
