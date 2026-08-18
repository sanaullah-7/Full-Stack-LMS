import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentProfileHeader = ({ student, onEdit }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {/* Breadcrumbs */}
      <div className="text-[var(--color-text-muted)] text-sm font-medium flex items-center gap-1">
        <Link to="/students" className="hover:text-[var(--color-text)] transition-colors">Students</Link>
        <span>&gt;</span>
        <span className="text-[var(--color-text)] font-semibold">{student?.name || 'Loading...'}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-low)] text-[var(--color-text)] text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

    </div>
  );
};

export default StudentProfileHeader;
