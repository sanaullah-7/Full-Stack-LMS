import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  List,
  LayoutGrid,
  Link as LinkIcon,
  Loader2,
  Clock,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { tasksService } from "../../services/tasks.service";
import { storage } from "../../utils/storage";
import { Modal } from "../../components/common/Modal";
import toast from "react-hot-toast";

export const Tasks = () => {
  const { setPageTitle } = useOutletContext();
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");

  // Instant SWR Cache Hydration
  const [tasks, setTasks] = useState(() => storage.getCache("tasks") || []);
  const [loading, setLoading] = useState(() => !storage.getCache("tasks"));

  // Submission Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitForm, setSubmitForm] = useState({ link: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageTitle("Tasks");
    loadTasks();
  }, [setPageTitle]);

  const loadTasks = async () => {
    try {
      if (!storage.getCache("tasks")) {
        setLoading(true);
      }
      const data = await tasksService.getTasks();
      const taskList = Array.isArray(data) ? data : [];
      setTasks(taskList);
      storage.setCache("tasks", taskList);
    } catch (err) {
      console.warn("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setSubmitForm({
      link: task.submissionLink || "",
      description: task.submissionDescription || "",
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!submitForm.link.trim()) {
      toast.error("Please provide a submission URL");
      return;
    }
    setIsSubmitting(true);

    try {
      await tasksService.updateTaskStatus(selectedTask._id, "Completed");
      const updated = tasks.map((t) =>
        t._id === selectedTask._id
          ? {
              ...t,
              status: "Completed",
              submissionLink: submitForm.link,
              submissionDescription: submitForm.description,
            }
          : t
      );
      setTasks(updated);
      storage.setCache("tasks", updated);
      toast.success("Task submitted and marked Completed!");
      setSelectedTask(null);
    } catch (err) {
      toast.error(err.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompleted = (t) => (t?.status || "").toLowerCase() === "completed";

  // Filtering logic
  const pendingTasks = tasks.filter((t) => !isCompleted(t));
  const completedTasks = tasks.filter((t) => isCompleted(t));

  const filteredTasks =
    filter === "pending"
      ? pendingTasks
      : filter === "completed"
      ? completedTasks
      : tasks;

  // Grouping for list view
  const todayTasks = filteredTasks.filter(
    (t) =>
      !isCompleted(t) &&
      t.dueDate &&
      new Date(t.dueDate) <= new Date(Date.now() + 86400000 * 2)
  );
  const upcomingTasks = filteredTasks.filter(
    (t) =>
      !isCompleted(t) &&
      (!t.dueDate || new Date(t.dueDate) > new Date(Date.now() + 86400000 * 2))
  );
  const doneInView = filteredTasks.filter((t) => isCompleted(t));

  return (
    <div className="inner-page active fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">Tasks</h1>
          <p className="page-sub">Your assignments from instructors</p>
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            className={`view-btn ${view === "board" ? "active" : ""}`}
            onClick={() => setView("board")}
            aria-label="Board view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Functional Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({tasks.length})
        </button>
        <button
          className={`tab-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingTasks.length})
        </button>
        <button
          className={`tab-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed ({completedTasks.length})
        </button>
      </div>

      {loading && tasks.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      ) : view === "list" ? (
        <div id="tasks-list-view">
          {/* Due Soon / Action Required */}
          {todayTasks.length > 0 && (
            <>
              <div className="task-group-label">Action Required</div>
              <div className="card task-list-card">
                {todayTasks.map((task) => (
                  <div
                    className="task-list-row"
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="task-list-label">
                      <span className="tl-title">{task.title}</span>
                      <div className="tl-meta">
                        <span className="tag tag-amber">{task.status || "Pending"}</span>
                        <span className="priority-dot high" title="Due soon"></span>
                        <span className="tl-due" style={{ color: "var(--danger)" }}>
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Upcoming */}
          {upcomingTasks.length > 0 && (
            <>
              <div className="task-group-label" style={{ marginTop: "1.5rem" }}>
                Upcoming Assignments
              </div>
              <div className="card task-list-card">
                {upcomingTasks.map((task) => (
                  <div
                    className="task-list-row"
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="task-list-label">
                      <span className="tl-title">{task.title}</span>
                      <div className="tl-meta">
                        <span className="tag tag-clay">{task.status || "In Progress"}</span>
                        <span className="tl-due">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Completed */}
          {doneInView.length > 0 && (
            <>
              <div className="task-group-label" style={{ marginTop: "1.5rem" }}>
                Completed
              </div>
              <div className="card task-list-card">
                {doneInView.map((task) => (
                  <div
                    className="task-list-row"
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="task-list-label completed">
                      <span className="tl-title">{task.title}</span>
                      <div className="tl-meta">
                        <span className="tag tag-green">Completed</span>
                        <span className="tl-due">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Done"}
                        </span>
                      </div>
                    </div>
                    {task.submissionLink && (
                      <a
                        href={task.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline"
                        style={{ fontSize: "12px", padding: ".35rem .7rem" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkIcon
                          style={{
                            width: "12px",
                            height: "12px",
                            display: "inline",
                            marginRight: "4px",
                            verticalAlign: "middle",
                          }}
                        />
                        View Work
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {filteredTasks.length === 0 && (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                color: "var(--text-muted)",
                marginTop: "1rem",
              }}
            >
              <Clock
                className="w-10 h-10"
                style={{ margin: "0 auto 0.75rem", opacity: 0.35, color: "var(--accent)" }}
              />
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: "0.25rem",
                }}
              >
                No assignments found
              </h4>
              <p style={{ fontSize: "13px" }}>You are all caught up for this view.</p>
            </div>
          )}
        </div>
      ) : (
        /* Board View */
        <div id="tasks-board-view">
          <div className="kanban-board">
            <div className="kanban-col">
              <div className="kanban-col-header">
                <span>Pending</span>
                <span className="kanban-count">{pendingTasks.length}</span>
              </div>
              {pendingTasks.map((task) => (
                <div
                  className="kanban-card card"
                  key={task._id}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="kc-top">
                    <span className="tag tag-amber">{task.status || "Pending"}</span>
                  </div>
                  <p className="kc-title">{task.title}</p>
                  <div className="kc-bottom">
                    <span className="kc-due">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "--"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="kanban-col">
              <div className="kanban-col-header">
                <span>Done</span>
                <span className="kanban-count">{completedTasks.length}</span>
              </div>
              {completedTasks.map((task) => (
                <div
                  className="kanban-card card"
                  key={task._id}
                  onClick={() => handleTaskClick(task)}
                  style={{ opacity: 0.85 }}
                >
                  <div className="kc-top">
                    <span className="tag tag-green">Completed</span>
                  </div>
                  <p
                    className="kc-title"
                    style={{ textDecoration: "line-through", color: "var(--text-muted)" }}
                  >
                    {task.title}
                  </p>
                  <div className="kc-bottom">
                    <span className="kc-due" style={{ color: "var(--accent)" }}>
                      Done
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => !isSubmitting && setSelectedTask(null)}
        title="Assignment Details"
        size="lg"
        footer={
          isCompleted(selectedTask) ? (
            <button
              type="button"
              className="btn-outline"
              onClick={() => setSelectedTask(null)}
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setSelectedTask(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="submit-assignment-form"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1.25rem",
                  fontWeight: "600",
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </>
          )
        }
      >
        {selectedTask && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header Block */}
            <div>
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: "700",
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                  lineHeight: "1.3",
                }}
              >
                {selectedTask.title}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    backgroundColor: isCompleted(selectedTask)
                      ? "rgba(16, 185, 129, 0.12)"
                      : "var(--accent-lite)",
                    color: isCompleted(selectedTask) ? "var(--success)" : "var(--accent)",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {selectedTask.status || "Pending"}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  <Clock size={14} /> Due:{" "}
                  {selectedTask.dueDate
                    ? new Date(selectedTask.dueDate).toLocaleDateString()
                    : "No due date"}
                </span>
              </div>
            </div>

            {/* Instructions Box */}
            <div
              style={{
                background: "linear-gradient(to bottom right, var(--surface), var(--bg))",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1.35rem",
              }}
            >
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11.5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  color: "var(--accent)",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                }}
              >
                <BookOpen size={14} /> Assignment Instructions
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text)",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                {selectedTask.description ||
                  "Complete the specified tasks according to curriculum standards and submit your repository link."}
              </p>
            </div>

            {/* Readable Submission Details or Form */}
            {isCompleted(selectedTask) ? (
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  borderRadius: "12px",
                  padding: "1.35rem",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "var(--success)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    <h4
                      style={{
                        fontSize: "14.5px",
                        fontWeight: "700",
                        color: "var(--text)",
                        margin: 0,
                      }}
                    >
                      Your Submitted Work
                    </h4>
                  </div>
                  <span className="tag tag-green">Completed</span>
                </div>

                {/* Repository URL */}
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11.5px",
                      color: "var(--text-muted)",
                      fontWeight: "700",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Submission Repository / Link
                  </span>
                  {selectedTask.submissionLink ? (
                    <a
                      href={selectedTask.submissionLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--accent)",
                        fontSize: "13.5px",
                        fontWeight: "500",
                        background: "var(--accent-lite)",
                        padding: "0.5rem 0.85rem",
                        borderRadius: "8px",
                        textDecoration: "none",
                        wordBreak: "break-all",
                      }}
                    >
                      <LinkIcon size={14} /> {selectedTask.submissionLink}
                      <ExternalLink size={13} style={{ opacity: 0.7 }} />
                    </a>
                  ) : (
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "var(--text)",
                        margin: 0,
                        fontStyle: "italic",
                      }}
                    >
                      Repository submitted via LMS submission portal.
                    </p>
                  )}
                </div>

                {/* Submission Notes / Description */}
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11.5px",
                      color: "var(--text-muted)",
                      fontWeight: "700",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Submission Notes
                  </span>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color: "var(--text)",
                      background: "var(--bg)",
                      padding: "0.85rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      lineHeight: "1.6",
                    }}
                  >
                    {selectedTask.submissionDescription ||
                      "Task completed successfully and approved by instructor."}
                  </div>
                </div>
              </div>
            ) : (
              <form
                id="submit-assignment-form"
                onSubmit={handleTaskSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Submission URL <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <LinkIcon size={18} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project-repo"
                      required
                      value={submitForm.link}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, link: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem 0.85rem 2.75rem",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        fontSize: "14px",
                        color: "var(--text)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Comments / Notes{" "}
                    <span style={{ color: "var(--text-muted)", fontWeight: "400" }}>
                      (Optional)
                    </span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "15px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <MessageSquare size={18} />
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Add any context or notes for the evaluator..."
                      value={submitForm.description}
                      onChange={(e) =>
                        setSubmitForm({ ...submitForm, description: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem 0.85rem 2.75rem",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        fontSize: "14px",
                        color: "var(--text)",
                        outline: "none",
                        resize: "vertical",
                        minHeight: "100px",
                      }}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
