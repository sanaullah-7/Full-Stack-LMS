import { Search, Download } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const AttendanceToolbar = ({
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  onDownloadCsv,
  viewMode = 'Daily',
  onViewModeChange,
  rangeLabel = '',
}) => {
  return (
    <div className="flex flex-col gap-1.5 pb-2 pt-1 w-full -mt-1">
      
      {/* Top Row: Heading */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <h2 className="text-xl font-bold tracking-tight leading-none text-[var(--color-text)] sm:text-2xl">Attendance Records</h2>
        {rangeLabel ? (
          <p className="text-xs font-medium text-[var(--color-text-muted)]">
            {viewMode}: {rangeLabel}
          </p>
        ) : null}
      </div>

      {/* Bottom Row: Date, Search, and Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 w-full mt-1">
        
        {/* Date Filter */}
        <div className="shrink-0 w-full lg:w-auto">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full lg:w-auto text-sm bg-[var(--color-surface-low)]/50 border border-[var(--color-border)] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-[var(--color-text)] shadow-sm transition-all"
          />
        </div>

        {/* Center: Search Bar */}
        <div className="relative w-full lg:flex-1 mx-0 lg:mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or roll number..."
            className="block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-low)]/50 py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] shadow-sm transition-all placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
      
      {/* Right side: Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto shrink-0 justify-end">
        
        {/* Daily / Weekly / Monthly */}
        <CustomSelect 
          label="View period"
          value={viewMode}
          onChange={onViewModeChange}
          options={['Daily', 'Weekly', 'Monthly']}
        />

        {/* Download CSV Button */}
        <button 
          onClick={onDownloadCsv}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-on-primary)] shadow-sm transition-all hover:opacity-90 hover:shadow-md sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>

      </div>

      </div>
    </div>
  );
};

export default AttendanceToolbar;
