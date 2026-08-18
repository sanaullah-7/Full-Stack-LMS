import { useState, useEffect } from 'react';
import StudentToolbar from '../../components/studentComponents/StudentToolbar';
import StudentTable from '../../components/studentComponents/StudentTable';
import StudentTableSkeleton from '../../components/studentComponents/StudentTableSkeleton';
import StudentPagination from '../../components/studentComponents/StudentPagination';
import AddStudentModal from '../../components/studentComponents/AddStudentModal';
import PageShell, { PagePanel } from '../../components/ui/PageShell';
import { getStudents } from '../../api/student.api';
import { getOverallAttendanceStats } from '../../Services/attendance.services';
import toast from 'react-hot-toast';

const generateAvatarProps = (name) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  const colors = [
    { bg: 'bg-[#e0f2fe]', text: 'text-[#0284c7]' },
    { bg: 'bg-[#dcfce7]', text: 'text-[#16a34a]' },
    { bg: 'bg-[#fef3c7]', text: 'text-[#d97706]' },
    { bg: 'bg-[#fee2e2]', text: 'text-[#ef4444]' },
    { bg: 'bg-[#f3e8ff]', text: 'text-[#9333ea]' },
  ];
  const charCode = initials.charCodeAt(0) || 0;
  return { initials, ...colors[charCode % colors.length] };
};

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCourse, setSelectedCourse] = useState('All courses');
  const [selectedBatch, setSelectedBatch] = useState('All batches');
  const [selectedTeam, setSelectedTeam] = useState('All teams');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStudentsData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, statsRes] = await Promise.all([
        getStudents(searchQuery),
        getOverallAttendanceStats().catch(() => ({ stats: [] })),
      ]);

      const statsByStudentId = new Map();
      (statsRes?.stats || []).forEach((row) => {
        const id = String(row?.student?.id || row?.student?._id || '');
        if (id) statsByStudentId.set(id, row);
      });

      const formattedData = (studentsRes?.students || []).map((student) => {
        const { initials, bg, text } = generateAvatarProps(student.name);
        const teamName = student.team_id?.name || '—';
        const teamId =
          student.team_id?._id ||
          (typeof student.team_id === 'string' ? student.team_id : null);
        const stats = statsByStudentId.get(String(student._id));
        const attendance =
          typeof stats?.percentage === 'number' && !Number.isNaN(stats.percentage)
            ? stats.percentage
            : 0;
        // Status comes from backend overall stats (Active/Inactive) — do not invent here
        const status = stats?.status === 'Active' || stats?.status === 'Inactive'
          ? stats.status
          : 'Inactive';

        return {
          id: student._id,
          rollNo: student.rollNumber,
          name: student.name,
          email: student.email || '',
          phone: student.phone || '',
          initials,
          avatarBg: bg,
          avatarText: text,
          course: student.course,
          batch: student.batch,
          team: teamName,
          teamId: teamId ? String(teamId) : '',
          teamBg: teamName !== '—' ? 'bg-[#e0f2fe]' : 'bg-[var(--color-surface-high)]',
          teamText: teamName !== '—' ? 'text-[#0284c7]' : 'text-[var(--color-text-muted)]',
          attendance,
          status,
        };
      });

      setStudents(formattedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsData();
    // intentional: run when filter deps change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCourse, selectedBatch, selectedTeam]);

  useEffect(() => {
    const handleOpenModal = () => setIsAddStudentModalOpen(true);
    window.addEventListener('openAddStudent', handleOpenModal);
    return () => window.removeEventListener('openAddStudent', handleOpenModal);
  }, []);

  const courseOptions = [...new Set(students.map((s) => s.course))].filter(Boolean);
  const batchOptions = [...new Set(students.map((s) => s.batch))].filter(Boolean);
  const teamOptions = [...new Set(students.map((s) => s.team))].filter(Boolean);

  const filteredStudents = students.filter((student) => {
    const matchCourse = selectedCourse === 'All courses' || student.course === selectedCourse;
    const matchBatch = selectedBatch === 'All batches' || student.batch === selectedBatch;
    const matchTeam = selectedTeam === 'All teams' || student.team === selectedTeam;
    return matchCourse && matchBatch && matchTeam;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <PageShell>
      <PagePanel className="flex flex-col gap-4">
        <StudentToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          courseOptions={courseOptions}
          selectedBatch={selectedBatch}
          onBatchChange={setSelectedBatch}
          batchOptions={batchOptions}
          selectedTeam={selectedTeam}
          onTeamChange={setSelectedTeam}
          teamOptions={teamOptions}
        />

        {isLoading ? (
          <StudentTableSkeleton />
        ) : (
          <StudentTable students={paginatedData} onRefresh={fetchStudentsData} />
        )}

        {!isLoading && filteredStudents.length > 0 && (
          <StudentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </PagePanel>

      {isAddStudentModalOpen && (
        <AddStudentModal
          onClose={() => setIsAddStudentModalOpen(false)}
          onSuccess={() => {
            setIsAddStudentModalOpen(false);
            fetchStudentsData();
          }}
        />
      )}
    </PageShell>
  );
};

export default StudentsList;
