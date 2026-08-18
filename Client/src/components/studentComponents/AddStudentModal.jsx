import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CustomSelect from "../CustomSelect";
import { createStudent } from "../../api/student.api";
import { fetchTeams } from "../../Data/teams";
import toast from "react-hot-toast";

const UNASSIGNED = "Unassigned";

const AddStudentModal = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    phone: "",
    course: "",
    batch: "",
    teamName: UNASSIGNED,
  });

  useEffect(() => {
    let mounted = true;
    fetchTeams()
      .then((data) => {
        if (mounted) setTeams(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Failed to fetch teams:", error);
        toast.error("Failed to load teams");
      });
    return () => {
      mounted = false;
    };
  }, []);

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
      await createStudent({
        rollNumber: formData.rollNumber.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.course.trim(),
        batch: formData.batch.trim(),
        team_id: selectedTeamId || null,
      });

      toast.success("Student added successfully!");
      if (onSuccess) onSuccess();
      else onClose();
    } catch (error) {
      console.error("Failed to create student:", error);
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamOptions = teams.map((team) => team.name).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-xl border border-[var(--color-border)] w-1/2 sm:w-3/4 md:w-1/2 max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Add Student</h2>
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
                placeholder="e.g. 100234"
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
                placeholder="e.g. Ali Raza"
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
                placeholder="e.g. ali@gmail.com"
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
                placeholder="e.g. 03001234567"
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
                placeholder="e.g. Web & App Dev"
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
                placeholder="e.g. Batch-10"
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
              {teamOptions.length === 0 ? (
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  No teams found. Create a team first, or leave Unassigned.
                </p>
              ) : null}
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
            className="px-5 py-2 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-on-primary)] text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
