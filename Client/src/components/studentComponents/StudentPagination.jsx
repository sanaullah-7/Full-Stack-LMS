import { ChevronLeft, ChevronRight } from 'lucide-react';

const StudentPagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between py-4 w-full border-t border-[var(--color-surface-highest)]">
      <div className="text-[11px] font-medium text-[var(--color-text-muted)]">
        Showing {totalItems === 0 ? 0 : startItem}-{endItem} of {totalItems} students
      </div>
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center h-6 w-6 rounded-md transition-colors ${
            currentPage === 1 
              ? 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed' 
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)]'
          }`}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        
        {/* Simple Page Indicator */}
        <span className="text-[11px] font-semibold text-[var(--color-text)] px-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`flex items-center justify-center h-6 w-6 rounded-md transition-colors ${
            currentPage === totalPages || totalPages === 0
              ? 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed' 
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)]'
          }`}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default StudentPagination;
