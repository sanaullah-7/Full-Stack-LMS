import { useState } from "react";

/**
 * CreateTeamModal
 * ---------------------------------------------------------------
 * Team create karne ka form, modal ke andar.
 *
 * Props:
 *  - isOpen: boolean               → modal dikhana hai ya nahi
 *  - onClose: () => void           → modal band karne ke liye
 *  - onCreate: (team) => void      → naya team object parent ko deta hai
 *
 * `onCreate` ko jo object milta hai woh exactly TeamCard.jsx wali
 * shape follow karta hai, isliye TeamGrid me bina kisi mapping ke
 * turant dikh jayega.
 */

const EMPTY_FORM = {
  name: "",
};

export default function CreateTeamModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleClose() {
    setFormData(EMPTY_FORM);
    setError(null);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Team name is required.");
      return;
    }

    const newTeam = {
      name: formData.name.trim(),
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate(newTeam);
      handleClose();
    } catch (err) {
      setError(err.message ?? "Failed to create team. Please try again.");
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
          Create Team
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div>
            <label className="text-sm font-weight-medium text-text mb-xs block">
              Team Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Team Epsilon"
              className="w-full bg-surface border border-border rounded-lg px-md py-sm text-sm text-text focus:outline-none focus:border-primary transition-colors duration-fast"
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end gap-sm mt-md">
            <button
              type="button"
              onClick={handleClose}
              className="px-lg py-sm rounded-lg text-sm font-weight-medium text-text-muted bg-surface-container hover:bg-yellow-500 hover:text-white transition-colors duration-fast"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-lg py-sm rounded-lg text-sm font-weight-medium text-on-primary bg-primary hover:opacity-90 disabled:opacity-60 transition-opacity duration-fast"
            >
              {isSubmitting ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}