import { useState, useEffect, useMemo } from 'react';
import { X, Download, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getStudentAttendanceHistory } from '../../Services/attendance.services.js';
import { formatLongLocalDate, toYmd } from '../../utils/localDate';

/** Recover business YYYY-MM-DD from stored UTC-midnight attendance date */
function attendanceRecordYmd(rawDate) {
  if (!rawDate) return '';
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
    return rawDate.slice(0, 10);
  }
  const d = new Date(rawDate);
  if (Number.isNaN(d.getTime())) return '';
  // Stored as UTC midnight for that calendar day
  return d.toISOString().slice(0, 10);
}

const StatusBadge = ({ status }) => {
  let badgeStyle = 'bg-[var(--color-surface-high)] text-[var(--color-text-muted)]';
  switch (status) {
    case 'Present':
      badgeStyle = 'bg-[#dcfce7] text-[#16a34a]';
      break;
    case 'Leave':
      badgeStyle = 'bg-[#ffedd5] text-[#ea580c]';
      break;
    case 'Absent':
      badgeStyle = 'bg-[#fee2e2] text-[#ef4444]';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
      {status}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-[var(--color-surface)] border border-[var(--color-surface-highest)] rounded-xl p-4 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold mt-1 text-[var(--color-text)]">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

const StudentRecordModal = ({ student, onClose }) => {
  const [history, setHistory] = useState([]);
  const [, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const studentId = student?.studentId || student?.id || student?._id;
      if (!studentId) return;
      setIsLoading(true);
      try {
        const response = await getStudentAttendanceHistory(studentId);
        const records = (response?.attendance || []).map((r) => {
          const ymd = attendanceRecordYmd(r.date);
          return {
            id: r._id,
            rollNo: student?.rollNo || student?.rollNumber,
            name: student?.name,
            date: ymd ? formatLongLocalDate(ymd) : '',
            rawDate: ymd,
            status: r.status || 'Not marked',
            checkInTime: r.checkInTime || null,
            checkOutTime: r.checkOutTime || null,
            note: r.note || null,
          };
        });
        setHistory(records);
      } catch (error) {
        console.error("Error fetching student attendance history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [student]);

  // Filter history
  const filteredHistory = useMemo(() => {
    if (!filterDate) return history;
    const ymd = toYmd(filterDate);
    return history.filter((record) => record.rawDate === ymd);
  }, [filterDate, history]);

  // Calculate Statistics
  const totalClasses = history.length;
  const presentCount = history.filter(r => r.status === 'Present').length;
  const absentCount = history.filter(r => r.status === 'Absent').length;
  const leaveCount = history.filter(r => r.status === 'Leave').length;
  const presentPercentage = totalClasses === 0 ? 0 : Math.round((presentCount / totalClasses) * 100);

  const handleDownloadCsv = () => {
    const headers = ['Roll No', 'Student Name', 'Date', 'Status', 'Check In', 'Check Out', 'Reason'];
    
    const escapeCsvValue = (val) => {
      if (val == null) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = filteredHistory.map(r => [
      escapeCsvValue(r.rollNo),
      escapeCsvValue(r.name),
      escapeCsvValue(r.date),
      escapeCsvValue(r.status),
      escapeCsvValue(r.checkInTime || ''),
      escapeCsvValue(r.checkOutTime || ''),
      escapeCsvValue(r.note || '')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${(student?.name || 'student').replace(/\s+/g, '_')}_Attendance_Record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--color-border)] w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-surface-highest)] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">{student.name}'s Attendance Record</h2>
            <p className="text-sm font-medium text-[var(--color-text-muted)] mt-1">Roll No: {student.rollNo}</p>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Classes" value={totalClasses} icon={Calendar} colorClass="bg-blue-100 text-blue-600" />
            <StatCard title="Present" value={presentCount} icon={CheckCircle2} colorClass="bg-green-100 text-green-600" />
            <StatCard title="Absent" value={absentCount} icon={XCircle} colorClass="bg-red-100 text-red-600" />
            <StatCard title="Leave" value={leaveCount} icon={Clock} colorClass="bg-orange-100 text-orange-600" />
          </div>

          {/* Attendance Overview Bar */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-surface-highest)] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Attendance Overview</h3>
              <span className="text-lg font-bold text-[var(--color-primary)]">{presentPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-[var(--color-surface-highest)] rounded-full overflow-hidden flex">
              {totalClasses > 0 && (
                <>
                  <div style={{ width: `${(presentCount / totalClasses) * 100}%` }} className="h-full bg-[#16a34a]" title="Present"></div>
                  <div style={{ width: `${(leaveCount / totalClasses) * 100}%` }} className="h-full bg-[#ea580c]" title="Leave"></div>
                  <div style={{ width: `${(absentCount / totalClasses) * 100}%` }} className="h-full bg-[#ef4444]" title="Absent"></div>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs font-medium text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#16a34a]"></div> Present</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ea580c]"></div> Leave</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Absent</div>
            </div>
          </div>

          {/* Toolbar: Filter & Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors appearance-none"
              />
            </div>
            
            <button 
              onClick={handleDownloadCsv}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-on-primary)] text-sm font-medium rounded-lg transition-colors shadow-sm w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {/* History Table */}
          <div className="border border-[var(--color-surface-highest)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[var(--color-surface-low)]">
                  <tr className="border-b border-[var(--color-surface-highest)]">
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Check In</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Check Out</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-surface-highest)] text-sm">
                  {filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-[var(--color-surface-low)] transition-colors">
                      <td className="px-6 py-4 font-medium text-[var(--color-text-muted)]">{record.date}</td>
                      <td className="px-6 py-4 text-xs font-medium text-[var(--color-text-muted)]">{record.checkInTime || '—'}</td>
                      <td className="px-6 py-4 text-xs font-medium text-[var(--color-text-muted)]">{record.checkOutTime || '—'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[var(--color-text-muted)]">
                        {record.note || '—'}
                      </td>
                    </tr>
                  ))}
                  
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                        No attendance records found for the selected date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentRecordModal;
