import { useState } from 'react';
import { Pencil, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditStudentModal from './EditStudentModal';

const ProgressBar = ({ percentage, colorClass }) => {
  const width = Math.max(0, Math.min(100, Number(percentage) || 0));
  return (
    <div className="w-full bg-[var(--color-surface-high)] rounded-full h-1.5 mt-1 overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-[width] ${colorClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
        isActive
          ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
          : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
          isActive ? 'bg-[var(--color-success)]' : 'bg-[var(--color-error)]'
        }`}
        aria-hidden
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

const StudentTable = ({ students = [], onRefresh }) => {
  const [editingStudent, setEditingStudent] = useState(null);

  return (
    <div className="relative w-full max-sm:overflow-x-auto">
      <table className="w-full table-fixed text-left max-sm:min-w-[720px]">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
          <col className="w-[11%]" />
          <col className="w-[12%]" />
          <col className="w-[16%]" />
          <col className="w-[11%]" />
          <col className="w-[8%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-low)]/80">
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Roll No</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Name</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Course</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Batch</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Team</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Attendance</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
            <th className="px-3 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-surface-highest)] text-sm">
          {students.map((student) => {
            const attendancePct =
              typeof student.attendance === 'number' && !Number.isNaN(student.attendance)
                ? student.attendance
                : 0;

            return (
              <tr key={student.id} className="hover:bg-[var(--color-surface-low)] transition-colors group">
                <td className="px-3 py-4 font-semibold text-[var(--color-text-muted)] text-[13px] align-middle">
                  {student.rollNo}
                </td>
                <td className="px-3 py-4 align-middle min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${student.avatarBg} ${student.avatarText}`}
                    >
                      {student.initials}
                    </div>
                    <Link
                      to={`/students/${student.id}`}
                      className="font-semibold text-[#0284c7] cursor-pointer hover:underline line-clamp-2 break-words leading-tight min-w-0"
                    >
                      {student.name}
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-4 text-xs font-medium text-[var(--color-text-muted)] align-middle min-w-0">
                  <span className="line-clamp-2 break-words">{student.course}</span>
                </td>
                <td className="px-3 py-4 text-xs font-medium text-[var(--color-text-muted)] align-middle min-w-0">
                  <span className="line-clamp-2 break-words">{student.batch}</span>
                </td>
                <td className="px-3 py-4 align-middle min-w-0">
                  <span
                    className={`inline-flex max-w-full items-center px-2 py-0.5 rounded-full text-[10px] font-semibold truncate ${student.teamBg} ${student.teamText}`}
                  >
                    {student.team}
                  </span>
                </td>

                <td className="px-3 py-4 align-middle min-w-0">
                  <div className="w-full min-w-0">
                    <span className="text-[var(--color-text)] font-bold text-xs tabular-nums">
                      {attendancePct}%
                    </span>
                    <ProgressBar
                      percentage={attendancePct}
                      colorClass={
                        student.status === 'Active'
                          ? 'bg-[var(--color-success)]'
                          : attendancePct > 0
                            ? 'bg-[var(--color-primary)]'
                            : 'bg-[var(--color-surface-high)]'
                      }
                    />
                  </div>
                </td>

                <td className="px-3 py-4 align-middle min-w-0">
                  <StatusBadge status={student.status} />
                </td>

                <td className="px-3 py-4 text-right align-middle">
                  <div className="flex items-center justify-end gap-3 text-[var(--color-text-muted)]">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(student)}
                      className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors text-xs font-medium cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to={`/students/${student.id}`}
                      className="hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
          {students.length === 0 && (
            <tr>
              <td colSpan="8" className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSuccess={() => {
            setEditingStudent(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default StudentTable;
