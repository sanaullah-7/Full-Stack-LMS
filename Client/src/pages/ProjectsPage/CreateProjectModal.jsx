import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchTeams } from "../../Data/teams";

const EMPTY_FORM = {
  title: "",
  description: "",
  dueDate: "",
  teamId: "", // Empty means unassigned
};

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch real teams for the dropdown
      fetchTeams()
        .then((data) => setTeams(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Failed to load teams", err);
          toast.error(err.message || "Failed to load teams");
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleClose() {
    if (isSubmitting) return;
    setFormData(EMPTY_FORM);
    setError(null);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.title.trim()) {
      setError("Project title is required.");
      return;
    }

    // Matches backend Project model / createProjectController body
    const newProject = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (formData.dueDate) newProject.dueDate = formData.dueDate;
    if (formData.teamId) newProject.teamId = formData.teamId;

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate(newProject);
      toast.success("Project created successfully");
      setFormData(EMPTY_FORM);
      setError(null);
      onClose();
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to create project. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-surface rounded-xl shadow-md w-full max-w-[480px] p-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-weight-semibold text-text mb-lg">
          Create Project
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="text-sm font-weight-medium text-text mb-xs block">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. E-Commerce Platform"
              className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast"
            />
          </div>

          <div>
            <label className="text-sm font-weight-medium text-text mb-xs block">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description..."
              className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-weight-medium text-text mb-xs block">
              Assign Team (Optional)
            </label>
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast"
            >
              <option value="">-- Unassigned --</option>
              {teams.map((team) => (
                <option key={team._id || team.id} value={team._id || team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-weight-medium text-text mb-xs block">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast"
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end gap-sm mt-md">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-lg py-sm rounded-lg text-sm font-weight-medium text-text-muted bg-surface-container hover:bg-surface-high transition-colors duration-fast disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-lg py-sm rounded-lg text-sm font-weight-medium text-on-primary bg-primary hover:opacity-90 disabled:opacity-60 transition-opacity duration-fast"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
