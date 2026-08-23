import CustomSelect from '../CustomSelect';

const statusBadgeStyles = {
  Present: 'bg-[#dcfce7] text-[#16a34a]',
  Leave: 'bg-[#ffedd5] text-[#ea580c]',
  Absent: 'bg-[#fee2e2] text-[#ef4444]',
  'Not marked': 'bg-[var(--color-surface-high)] text-[var(--color-text-muted)]',
};

const cellPad = 'px-3 py-4 align-middle';
const headPad =
  ' py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider align-middle';

const StatusBadge = ({ status }) => {
  const badgeStyle =
    statusBadgeStyles[status] ||
    'bg-[var(--color-surface-high)] text-[var(--color-text-muted)]';

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeStyle}`}>
      {status}
    </span>
  );
};

const AttendanceTable = ({ attendanceData, onStatusChange, onStudentClick }) => {
  return (
    <div className="w-full max-sm:overflow-x-auto">
      <table className="w-full table-fixed text-left max-sm:min-w-[780px]">
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[16%]" />
          <col className="w-[12%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-surface-highest)] bg-[var(--color-surface-low)]/80">
            <th className={`${headPad} px-3`}>Roll No</th>
            <th className={headPad}>Student</th>
            <th className={headPad}>Date</th>
            <th className={headPad}>Check In</th>
            <th className={headPad}>Check Out</th>
            <th className={`${headPad} px-4`}>Status</th>
            <th className={headPad}>Reason</th>
            <th className={`${headPad} text-right px-7`}>Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-surface-highest)] text-sm">
          {attendanceData.map((record) => (
            <tr key={record.id} className="hover:bg-[var(--color-surface-low)] transition-colors group">
              <td className={`${cellPad} font-semibold text-[var(--color-text-muted)] text-[13px]`}>
                {record.rollNo}
              </td>

              <td className={`${cellPad} min-w-0`}>
                <span
                  onClick={() => onStudentClick && onStudentClick(record)}
                  className="font-semibold text-[#0284c7] cursor-pointer hover:underline break-words line-clamp-2"
                >
                  {record.name}
                </span>
              </td>

              <td className={`${cellPad} text-xs font-medium text-[var(--color-text-muted)]`}>
                <span className="break-words">{record.date || '—'}</span>
              </td>

              <td className={`${cellPad} text-xs font-medium text-[var(--color-text-muted)]`}>
                {record.checkInTime || '—'}
              </td>

              <td className={`${cellPad} text-xs font-medium text-[var(--color-text-muted)]`}>
                {record.checkOutTime || '—'}
              </td>

              <td className={cellPad}>
                <StatusBadge status={record.status} />
              </td>

              <td className={`${cellPad} text-xs font-medium text-[var(--color-text-muted)] min-w-0`}>
                <span className="line-clamp-2 break-words" title={record.note || ''}>
                  {record.note || '—'}
                </span>
              </td>

              <td className={`${cellPad} text-right`}>
                <div className="inline-flex justify-end">
                  <CustomSelect
                    label="Status"
                    value={record.status === 'Not marked' ? 'Set' : record.status}
                    options={['Present', 'Leave', 'Absent']}
                    onChange={(val) => onStatusChange(record, val)}
                    size="sm"
                  />
                </div>
              </td>
            </tr>
          ))}

          {attendanceData.length === 0 && (
            <tr>
              <td colSpan="8" className="px-3 py-12 text-center text-[var(--color-text-muted)]">
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
