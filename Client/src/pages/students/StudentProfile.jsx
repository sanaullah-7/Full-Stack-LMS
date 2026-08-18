import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, AlertTriangle } from "lucide-react";
import StudentProfileHeader from "../../components/studentComponents/StudentProfileHeader";
import StudentProfileInfoCard, {
  StudentProfileInfoCardSkeleton,
} from "../../components/studentComponents/StudentProfileInfoCard";
import StudentRecentPerformance from "../../components/studentComponents/StudentRecentPerformance";
import StudentTeamsProjects from "../../components/studentComponents/StudentTeamsProjects";
import EditStudentModal from "../../components/studentComponents/EditStudentModal";
import { getStudentProfile, deleteStudent } from "../../api/student.api";
import toast from "react-hot-toast";
import Skeleton from "../../components/ui/Skeleton";
import PageShell from "../../components/ui/PageShell";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await getStudentProfile(id);
      if (!res?.data?.student) {
        throw new Error("Invalid profile response");
      }
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to load student profile",
      );
      navigate("/students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // intentional: run when filter deps change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStudent(id);
      toast.success("Student deleted successfully");
      navigate("/students");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.response?.data?.message || "Failed to delete student");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <Skeleton className="h-8 w-56 mb-2" />
        <StudentProfileInfoCardSkeleton />
        <div className="flex flex-col lg:flex-row gap-6">
          <Skeleton className="h-64 flex-1 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-64 w-full lg:w-[400px] rounded-[var(--radius-xl)]" />
        </div>
      </PageShell>
    );
  }

  if (!profile?.student) return null;

  const student = profile.student;
  const formattedStudentForEdit = {
    id: student.id,
    rollNo: student.rollNumber,
    name: student.name,
    email: student.email || "",
    phone: student.phone || "",
    course: student.course,
    batch: student.batch,
    team: student.team_id?.name || "—",
    teamId: student.team_id?._id ? String(student.team_id._id) : "",
  };

  return (
    <PageShell className="flex flex-col">
      <StudentProfileHeader
        student={student}
        onEdit={() => setIsEditModalOpen(true)}
      />

      <div className="flex flex-1 flex-col">
        <StudentProfileInfoCard profile={profile} />

        <div className="mb-8 flex flex-col items-stretch gap-6 lg:flex-row">
          <StudentRecentPerformance
            tasks={profile.tasks?.items || profile.recentPerformance || []}
          />
          <StudentTeamsProjects
            team={profile.team}
            projects={profile.projects || []}
          />
        </div>

        <div className="mt-auto flex justify-center border-t border-[var(--color-surface-highest)] pt-6 sm:justify-end">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete Student
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[var(--color-text)]">
              Delete Student
            </h3>
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {student.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-low)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-high)] disabled:opacity-50"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <EditStudentModal
          student={formattedStudentForEdit}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchProfile();
          }}
        />
      )}
    </PageShell>
  );
};

export default StudentProfile;
