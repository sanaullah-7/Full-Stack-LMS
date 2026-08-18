import { Search } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const StudentToolbar = ({ 
  searchQuery, 
  onSearchChange,
  selectedCourse,
  onCourseChange,
  courseOptions = [],
  selectedBatch,
  onBatchChange,
  batchOptions = [],
  selectedTeam,
  onTeamChange,
  teamOptions = []
}) => {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 py-4 w-full">

      {/* Left side: Search Bar */}
      <div className="relative w-full xl:flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by roll number, name"
          className="block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-low)]/50 py-3 pl-10 pr-3 text-sm text-[var(--color-text)] shadow-sm transition-all placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>

      {/* Middle side: Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto shrink-0">
        <CustomSelect
          label="Course"
          defaultOption="All courses"
          options={courseOptions.length ? courseOptions : ['Web & App Dev', 'Data Science', 'UI/UX Design']}
          value={selectedCourse}
          onChange={onCourseChange}
        />
        <CustomSelect
          label="Batch"
          defaultOption="All batches"
          options={batchOptions.length ? batchOptions : ['Batch-07', 'Batch-08', 'Batch-09']}
          value={selectedBatch}
          onChange={onBatchChange}
        />
        <CustomSelect
          label="Team"
          defaultOption="All teams"
          options={teamOptions.length ? teamOptions : ['Team Alpha', 'Team Beta', 'Team Gamma', 'Unassigned']}
          value={selectedTeam}
          onChange={onTeamChange}
        />
      </div>

    </div>
  );
};

export default StudentToolbar;