import { useState, useEffect, useRef } from 'react';
import AttendanceToolbar from '../../components/attendanceComponents/AttendanceToolbar';
import AttendanceTable from '../../components/attendanceComponents/AttendanceTable';
import AttendanceTableSkeleton from '../../components/attendanceComponents/AttendanceTableSkeleton';
import AttendancePagination from '../../components/attendanceComponents/AttendancePagination';
import TakeAttendanceModal from '../../components/attendanceComponents/TakeAttendanceModal';
import StudentRecordModal from '../../components/attendanceComponents/StudentRecordModal';
import PageShell, { PagePanel } from '../../components/ui/PageShell';

import toast from 'react-hot-toast';

import { getStudents } from '../../api/student.api';
import { getAttendanceByDate, markAttendance } from '../../Services/attendance.services.js';
import {
  getLocalToday,
  parseLocalYmd,
  toYmd,
} from '../../utils/localDate';

const getDatesForView = (viewMode, selectedDate) => {
  const ymd = toYmd(selectedDate);
  const base = parseLocalYmd(ymd);

  if (viewMode === 'Daily') {
    return [ymd];
  }

  if (viewMode === 'Weekly') {
    const day = base.day(); // 0 = Sunday
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = base.add(mondayOffset, 'day');

    const dates = [];
    for (let i = 0; i < 7; i += 1) {
      dates.push(monday.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
  }

  // Monthly — all days in selected month (local)
  const daysInMonth = base.daysInMonth();
  const dates = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    dates.push(base.date(day).format('YYYY-MM-DD'));
  }
  return dates;
};

const formatRangeLabel = (dates) => {
  if (!dates.length) return '';
  if (dates.length === 1) return dates[0];
  return `${dates[0]} → ${dates[dates.length - 1]}`;
};

const AttendanceList = () => {
  const [data, setData] = useState([]);
  const [takeAttendanceStudents, setTakeAttendanceStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => getLocalToday());
  const [viewMode, setViewMode] = useState('Daily');
  const [rangeLabel, setRangeLabel] = useState(() => getLocalToday());
  const [currentPage, setCurrentPage] = useState(1);
  const [isTakeAttendanceModalOpen, setIsTakeAttendanceModalOpen] = useState(false);
  const [selectedStudentForRecord, setSelectedStudentForRecord] = useState(null);
  const itemsPerPage = 10;
  const trackedTodayRef = useRef(getLocalToday());
  const loadSeqRef = useRef(0);

  const buildDailyRows = (students, attendanceRes, dateStr) => {
    const attendanceMap = new Map();
    (attendanceRes?.attendance || []).forEach((record) => {
      const studentId = record.student_id?._id || record.student_id;
      // Orphans / deleted students: skip — never show "Unknown Student"
      if (studentId && record.student_id?.name) {
        attendanceMap.set(String(studentId), record);
      }
    });

    return students.map((student) => {
      const att = attendanceMap.get(String(student._id));
      return {
        id: student._id,
        studentId: student._id,
        rollNo: student.rollNumber,
        name: student.name,
        date: dateStr,
        status: att?.status || 'Not marked',
        note: att?.note || null,
        checkInTime: att?.checkInTime || null,
        checkOutTime: att?.checkOutTime || null,
      };
    });
  };

  const loadAttendanceData = async (dateStr, mode = viewMode) => {
    const requestId = ++loadSeqRef.current;
    const normalizedDate = toYmd(dateStr);
    setIsLoading(true);
    setData([]);

    try {
      const dates = getDatesForView(mode, normalizedDate);
      setRangeLabel(formatRangeLabel(dates));

      const studentsRes = await getStudents();
      const students = studentsRes.students || [];

      // Always prepare Take Attendance list for the selected single date
      const selectedDayAttendance = await getAttendanceByDate(normalizedDate).catch(() => ({
        attendance: [],
      }));

      if (requestId !== loadSeqRef.current) return;

      setTakeAttendanceStudents(
        buildDailyRows(students, selectedDayAttendance, normalizedDate),
      );

      if (mode === 'Daily') {
        setData(buildDailyRows(students, selectedDayAttendance, normalizedDate));
        return;
      }

      // Weekly / Monthly: history for days in range (selected date as reference)
      const attendanceResults = await Promise.all(
        dates.map((d) =>
          getAttendanceByDate(d).catch(() => ({ attendance: [] })),
        ),
      );

      if (requestId !== loadSeqRef.current) return;

      const rows = [];
      attendanceResults.forEach((res, index) => {
        const date = dates[index];
        (res?.attendance || []).forEach((record) => {
          if (!record?.student_id?.name) return;
          const studentId = record.student_id._id || record.student_id;
          rows.push({
            id: `${String(studentId)}-${date}`,
            studentId,
            rollNo: record.student_id.rollNumber,
            name: record.student_id.name,
            date,
            status: record.status || 'Not marked',
            note: record.note || null,
            checkInTime: record.checkInTime || null,
            checkOutTime: record.checkOutTime || null,
          });
        });
      });

      rows.sort((a, b) => {
        if (a.date === b.date) return String(a.name).localeCompare(String(b.name));
        return a.date < b.date ? 1 : -1;
      });

      setData(rows);
    } catch (error) {
      if (requestId !== loadSeqRef.current) return;
      console.error("Error loading attendance data:", error);
      toast.error("Failed to load attendance records");
    } finally {
      if (requestId === loadSeqRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAttendanceData(selectedDate, viewMode);
    // intentional: run when filter deps change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, viewMode]);

  // Midnight / focus: if local day rolled forward and user was on previous "today", advance
  useEffect(() => {
    const syncLocalDay = () => {
      const today = getLocalToday();
      const previousToday = trackedTodayRef.current;
      if (today === previousToday) return;

      trackedTodayRef.current = today;
      setSelectedDate((sel) => (sel === previousToday ? today : sel));
    };

    const intervalId = setInterval(syncLocalDay, 30000);
    window.addEventListener('focus', syncLocalDay);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', syncLocalDay);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDate, viewMode]);

  useEffect(() => {
    const handleOpenModal = () => setIsTakeAttendanceModalOpen(true);
    window.addEventListener('openTakeAttendance', handleOpenModal);
    return () => window.removeEventListener('openTakeAttendance', handleOpenModal);
  }, []);

  const handleDateChange = (nextDate) => {
    setSelectedDate(toYmd(nextDate));
  };

  const handleStatusChange = async (record, newStatus) => {
    const studentId = String(record.studentId || record.id || "");
    if (!studentId) {
      toast.error("Student id missing — cannot update attendance");
      return;
    }

    const date = toYmd(record.date || selectedDate);
    const time =
      newStatus === "Present"
        ? new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null;

    setData((prev) =>
      prev.map((student) =>
        student.id === record.id
          ? {
              ...student,
              status: newStatus,
              checkInTime:
                newStatus === "Present" ? time : student.checkInTime,
            }
          : student,
      ),
    );

    try {
      await markAttendance({
        date,
        students: [
          {
            student_id: studentId,
            status: newStatus,
            checkInTime:
              newStatus === "Present"
                ? time || record.checkInTime || ""
                : record.checkInTime || "",
            checkOutTime: record.checkOutTime || "",
            note: record.note || "",
          },
        ],
      });
      toast.success("Attendance updated");
      loadAttendanceData(selectedDate, viewMode);
    } catch (error) {
      console.error("Failed to update attendance on server:", error);
      toast.error(
        error.response?.data?.message || "Failed to persist attendance change",
      );
      loadAttendanceData(selectedDate, viewMode);
    }
  };

  const handleBulkSave = async (updates) => {
    try {
      const payloadStudents = updates.map((u) => ({
        student_id: u.id,
        status: u.status || 'Not marked',
        checkInTime: u.checkInTime || '',
        checkOutTime: u.checkOutTime || '',
        note: u.note || '',
      }));

      await markAttendance({
        date: toYmd(selectedDate),
        students: payloadStudents,
      });

      toast.success("Attendance saved successfully");
      loadAttendanceData(selectedDate, viewMode);
    } catch (error) {
      console.error("Failed to save bulk attendance:", error);
      toast.error(error.response?.data?.message || "Failed to save attendance");
    }
  };

  const filteredData = data.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(student.rollNo).includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

    const rows = filteredData.map(r => [
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
    link.setAttribute("download", `attendance_${viewMode.toLowerCase()}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageShell>
      <PagePanel className="flex flex-col gap-3">
        <AttendanceToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onDownloadCsv={handleDownloadCsv}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          rangeLabel={rangeLabel}
        />

        <div className="min-h-[300px] overflow-visible rounded-[var(--radius-lg)] border border-[var(--color-surface-highest)] bg-[var(--color-surface-low)]/30">
          {isLoading ? (
            <AttendanceTableSkeleton />
          ) : (
            <>
              <AttendanceTable
                attendanceData={paginatedData}
                onStatusChange={handleStatusChange}
                onStudentClick={(student) => setSelectedStudentForRecord(student)}
              />

              {filteredData.length > 0 && (
                <AttendancePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredData.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </PagePanel>

      {isTakeAttendanceModalOpen && (
        <TakeAttendanceModal
          students={takeAttendanceStudents}
          selectedDate={selectedDate}
          onClose={() => setIsTakeAttendanceModalOpen(false)}
          onSave={handleBulkSave}
        />
      )}

      {selectedStudentForRecord && (
        <StudentRecordModal
          student={selectedStudentForRecord}
          onClose={() => setSelectedStudentForRecord(null)}
        />
      )}
    </PageShell>
  );
};

export default AttendanceList;
