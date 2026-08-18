import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import TaskStats from "../../components/taskComponents/TaskStats";
import TaskTable from "../../components/taskComponents/TaskTable";
import EditTaskModal from "../../components/taskComponents/EditTaskModal";
import DeleteConfirmModal from "../../components/taskComponents/DeleteConfirmModal";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../Services/task.services";
import { getStudents } from "../../api/student.api";
import { getLocalToday, toYmd } from "../../utils/localDate";
import {
  normalizeTaskStatus,
  taskStatusKey,
} from "../../utils/taskStatus";
import PageShell, { PagePanel } from "../../components/ui/PageShell";
import dayjs from "dayjs";

function formatTaskDueDate(dueDate) {
  if (!dueDate) return { label: "No Date", ymd: "" };
  const d = dayjs(dueDate);
  if (!d.isValid()) return { label: "No Date", ymd: "" };
  return {
    ymd: d.format("YYYY-MM-DD"),
    label: d.format("D MMM YYYY"),
  };
}

function mapApiTask(task) {
  const status = normalizeTaskStatus(task.status);
  const due = formatTaskDueDate(task.dueDate);
  const student = task.studentId && typeof task.studentId === "object"
    ? task.studentId
    : null;
  const teamName = student?.team_id?.name || "—";
  const studentName = student?.name || "Unassigned";

  return {
    id: task._id,
    title: task.title,
    subtitle: task.description || "",
    status,
    updateStatus: status,
    dueDate: due.label,
    dueDateYmd: due.ymd,
    teamName,
    assignedTo: {
      id: student?._id || null,
      name: studentName,
      avatarText: studentName.substring(0, 2).toUpperCase(),
      avatarBg: "bg-gray-100 text-gray-700",
      teamName,
    },
  };
}

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [res, stdRes] = await Promise.all([getTasks(), getStudents()]);

      if (res?.success) {
        setTasks((res.data || []).map(mapApiTask));
      } else {
        setTasks([]);
      }

      setStudents(stdRes?.students || []);
    } catch (error) {
      console.error("Error fetching tasks or students:", error);
      toast.error(error.response?.data?.message || "Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const handleOpen = () => {
      setEditingTask(null);
      setCreateModalOpen(true);
    };
    window.addEventListener("openCreateTask", handleOpen);
    return () => window.removeEventListener("openCreateTask", handleOpen);
  }, []);

  const counts = useMemo(() => {
    const keys = tasks.map((t) => taskStatusKey(t.status));
    return {
      all: tasks.length,
      pending: keys.filter((k) => k === "pending").length,
      in_progress: keys.filter((k) => k === "in_progress").length,
      completed: keys.filter((k) => k === "completed").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    return tasks.filter((t) => taskStatusKey(t.status) === activeFilter);
  }, [tasks, activeFilter]);

  const closeModal = () => {
    setCreateModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (taskData) => {
    const studentId = taskData.assignedTo?.id;
    if (!studentId) {
      toast.error("Please assign the task to a student");
      throw new Error("Student required");
    }

    const taskPayload = {
      title: taskData.title.trim(),
      description: (taskData.subtitle || "").trim(),
      status: normalizeTaskStatus(taskData.status),
      dueDate: taskData.dueDate || getLocalToday(),
      studentId,
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskPayload);
        toast.success("Task updated successfully");
      } else {
        await createTask(taskPayload);
        toast.success("Task created successfully");
      }
      await fetchTasks();
      closeModal();
    } catch (error) {
      console.error("Error saving task", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save task",
      );
      throw error;
    }
  };

  const handleEditTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDateYmd || toYmd(task.dueDate) || getLocalToday(),
    });
    setCreateModalOpen(true);
  };

  const handleDeleteTasks = (taskIds) => {
    return new Promise((resolve, reject) => {
      setDeleteConfirmState({ ids: taskIds, resolve, reject });
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmState || isDeleting) return;
    const { ids, resolve, reject } = deleteConfirmState;
    setIsDeleting(true);
    try {
      await Promise.all(ids.map((id) => deleteTask(id)));
      toast.success(
        ids.length > 1
          ? "Tasks deleted successfully"
          : "Task deleted successfully",
      );
      setDeleteConfirmState(null);
      resolve();
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting tasks", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
      reject(error);
      setDeleteConfirmState(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    if (deleteConfirmState) {
      deleteConfirmState.reject(new Error("cancelled"));
      setDeleteConfirmState(null);
    }
  };

  const assigneeOptions = students.map((s) => ({
    id: s._id,
    name: s.name,
    avatarText: (s.name || "ST").substring(0, 2).toUpperCase(),
    avatarBg: "bg-gray-100 text-gray-700",
  }));

  return (
    <PageShell>
      <TaskStats
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        isLoading={loading}
      />

      <PagePanel className="p-3 sm:p-4">
        <TaskTable
          externalTasks={filteredTasks}
          loading={loading}
          onEditTask={handleEditTask}
          onDeleteTasks={handleDeleteTasks}
        />
      </PagePanel>

      {createModalOpen && (
        <EditTaskModal
          task={editingTask}
          mode={editingTask ? "edit" : "create"}
          onClose={closeModal}
          onSave={handleSaveTask}
          dynamicAssignees={assigneeOptions}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteConfirmState}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        count={deleteConfirmState?.ids?.length || 0}
        isDeleting={isDeleting}
      />
    </PageShell>
  );
};

export default Task;
