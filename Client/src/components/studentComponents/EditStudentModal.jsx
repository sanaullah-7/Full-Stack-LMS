import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CustomSelect from "../CustomSelect";
import { updateStudent } from "../../api/student.api";
import { fetchTeams } from "../../Data/teams";
import toast from "react-hot-toast";

const UNASSIGNED = "Unassigned";

const toFormTeamName = (teamLabel) => {
  if (!teamLabel || teamLabel === "—" || teamLabel === "Not Assigned") {
    return UNASSIGNED;
  }
  return teamLabel;
};

const EditStudentModal = ({ student, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(student?.teamId || "");
  const [formData, setFormData] = useState({
    rollNumber: student?.rollNo || "",
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    course: student?.course || "",
    batch: student?.batch || "",
    teamName: toFormTeamName(student?.team),
  });

  useEffect(() => {
    let mounted = true;
    fetchTeams()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setTeams(list);

        // Prefer stored teamId; fall back to name match once teams load
        if (student?.teamId) {
          const byId = list.find(
            (t) => String(t._id || t.id) === String(student?.teamId),
          );
          if (byId) {
            setSelectedTeamId(String(byId._id || byId.id));
            setFormData((prev) => ({ ...prev, teamName: byId.name }));
            return;
          }
        }

        const byName = list.find((t) => t.name === student?.team);
        if (byName) {
          setSelectedTeamId(String(byName._id || byName.id));
          setFormData((prev) => ({ ...prev, teamName: byName.name }));
        }
      })
      .catch((error) => {
        console.error("Failed to fetch teams:", error);
        toast.error("Failed to load teams");
      });
    return () => {
      mounted = false;
    };
  }, [student]);

  useEffect(() => {
    setSelectedTeamId(student?.teamId || "");
    setFormData({
      rollNumber: student?.rollNo || "",
      name: student?.name || "",
      email: student?.email || "",
      phone: student?.phone || "",
      course: student?.course || "",
      batch: student?.batch || "",
      teamName: toFormTeamName(student?.team),
    });
  }, [student]);

  if (!student) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamChange = (teamName) => {
    if (!teamName || teamName === UNASSIGNED) {
      setSelectedTeamId("");
      setFormData((prev) => ({ ...prev, teamName: UNASSIGNED }));
      return;
    }
    const matchedTeam = teams.find((t) => t.name === teamName);
    setSelectedTeamId(matchedTeam?._id || matchedTeam?.id || "");
    setFormData((prev) => ({ ...prev, teamName }));
  };

  const handleSave = async () => {
    if (
      !formData.rollNumber ||
      !formData.name ||
      !formData.email ||
      !formData.course ||
      !formData.batch
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.teamName !== UNASSIGNED && !selectedTeamId) {
      toast.error("Selected team is invalid");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStudent(student.id, {
        rollNumber: formData.rollNumber.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.course.trim(),
        batch: formData.batch.trim(),
        team_id: selectedTeamId || null,
      });

      toast.success("Student updated successfully!");
      if (onSuccess) onSuccess();
      else onClose();
    } catch (error) {
      console.error("Failed to update student:", error);
      toast.error(error.response?.data?.message || "Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamOptions = teams.map((team) => team.name).filter(Boolean);

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-xl border border-[var(--color-border)] w-full  max-h-[95vh] flex flex-col overflow-hidden sm:w-3/4 md:w-1/2">
        <div className="flex items-center justify-between p-6 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Edit Student</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 pt-2 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Course *
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Batch *
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                Assign Team
              </label>
              <CustomSelect
                label="Team"
                defaultOption={UNASSIGNED}
                options={teamOptions}
                value={formData.teamName}
                onChange={handleTeamChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[var(--color-surface-highest)]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-low)] text-[var(--color-text)] text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-on-primary)] text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default EditStudentModal;
