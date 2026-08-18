import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CircleDashed,
  Loader,
  Eye,
  CheckCircle2,
} from "lucide-react";
import FilterToolbar from "../../components/team/FilterTollbar";
import TeamGrid from "../../components/team/TeamGrid";
import CreateTeamModal from "../../components/team/CreateTeamModel";
import TeamDetails from "./TeamDetail";
import PageShell from "../../components/ui/PageShell";
import { fetchTeams, createTeam } from "../../Data/teams";
import {
  deriveTeamStatusFromProjects,
  getTeamProjects,
  normalizeProjectStatusKey,
} from "../../components/team/deriveTeamStatus";

/** Status keys match project-derived team status (see deriveTeamStatus). */
const TEAM_FILTERS = [
  {
    key: "all",
    label: "All Teams",
    icon: Users,
    tone: "text-[var(--color-primary)]",
  },
  {
    key: "not_started",
    label: "Not Started",
    icon: CircleDashed,
    tone: "text-[var(--color-text-muted)]",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Loader,
    tone: "text-[var(--color-warning)]",
  },
  {
    key: "under_review",
    label: "Under Review",
    icon: Eye,
    tone: "text-[var(--color-secondary)]",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    tone: "text-[var(--color-success)]",
  },
];

/**
 * TeamsPage
 * ---------------------------------------------------------------
 * Page ke kaam:
 *  1. data/teams.js se teams fetch karna
 *  2. loading / error state manage karna
 *  3. status filter + search apply karna (client-side)
 *  4. FilterToolbar + TeamGrid ko render karna
 */

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  async function reloadTeams() {
    try {
      const data = await fetchTeams();
      setTeams(data);
    } catch (err) {
      setError(err.message ?? "Unknown error");
    }
  }

  useEffect(() => {
    const handleOpenCreateTeamModal = () => {
      setIsCreateModalOpen(true);
    };

    window.addEventListener("openCreateTeamModal", handleOpenCreateTeamModal);

    return () => {
      window.removeEventListener("openCreateTeamModal", handleOpenCreateTeamModal);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTeams();
        if (isMounted) setTeams(data);
      } catch (err) {
        if (isMounted) setError(err.message ?? "Unknown error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTeams();
    return () => {
      isMounted = false;
    };
  }, []);

  // Counts / filters use status derived from assigned projects (not Team.status default).
  const counts = useMemo(() => {
    const keys = teams.map((t) =>
      normalizeProjectStatusKey(
        deriveTeamStatusFromProjects(getTeamProjects(t)),
      ),
    );
    return {
      all: teams.length,
      not_started: keys.filter((k) => k === "not_started").length,
      in_progress: keys.filter((k) => k === "in_progress").length,
      completed: keys.filter((k) => k === "completed").length,
      under_review: keys.filter((k) => k === "under_review").length,
    };
  }, [teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const derivedKey = normalizeProjectStatusKey(
        deriveTeamStatusFromProjects(getTeamProjects(team)),
      );
      const matchesFilter =
        activeFilter === "all" || derivedKey === activeFilter;

      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [teams, activeFilter, searchQuery]);

  function handleViewTeam(teamId) {
    setSelectedTeamId(teamId);
  }

  async function handleCreateTeam(newTeam) {
    // createTeam abhi mock hai (data/teams.js) — backend ready hone par
    // wahi ek file update karni hai, yahan kuch change nahi karna.
    const savedTeam = await createTeam(newTeam);
    setTeams((prev) => [savedTeam, ...prev]);
  }

  return (
    <PageShell>
      <FilterToolbar
        filters={TEAM_FILTERS}
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search teams..."
        isLoading={isLoading}
      />

      <TeamGrid
        teams={filteredTeams}
        isLoading={isLoading}
        error={error}
        onViewTeam={handleViewTeam}
      />

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTeam}
      />

      {selectedTeamId && (
        <TeamDetails
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          onTeamUpdated={reloadTeams}
        />
      )}
    </PageShell>
  );
}
