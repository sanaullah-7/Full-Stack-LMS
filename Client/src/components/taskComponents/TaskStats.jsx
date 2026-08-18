import StatusFilterCards from "../team/StatusFilterCards";
import { TASK_FILTERS } from "../../utils/taskStatus";

/**
 * Task filter cards — same visual language as Teams/Projects status cards.
 * Status keys match Task model: Pending | In Progress | Completed
 */
export default function TaskStats({
  counts = {},
  activeFilter = "all",
  onFilterChange,
  isLoading = false,
}) {
  return (
    <StatusFilterCards
      filters={TASK_FILTERS}
      counts={counts}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
      isLoading={isLoading}
    />
  );
}
