import { UsersRound } from "lucide-react";
import TeamCard from "./TeamsCard";
import TeamCardSkeleton from "./TeamsCardSkeleton";
import EmptyState from "../ui/EmptyState";

const GRID_CLASS =
  "grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

export default function TeamGrid({ teams, isLoading, error, onViewTeam }) {
  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {[...Array(6)].map((_, index) => (
          <TeamCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-error">Teams load nahi ho paayi: {error}</p>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <EmptyState
        icon={UsersRound}
        title="No teams yet"
        description="Create a team to assign students and projects."
      />
    );
  }

  return (
    <div className={GRID_CLASS}>
      {teams.map((team) => (
        <TeamCard
          key={team._id || team.id}
          team={team}
          onViewTeam={onViewTeam}
        />
      ))}
    </div>
  );
}
