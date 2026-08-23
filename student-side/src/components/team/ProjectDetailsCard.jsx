import React, { useState } from "react";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { FolderGit2, Globe, CheckCircle2 } from "lucide-react";
import { teamService } from "../../services/team.service";
import toast from "react-hot-toast";

export const ProjectDetailsCard = ({ project, initialRepoUrl = "" }) => {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [loading, setLoading] = useState(false);

  const handleUpdateRepo = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      toast.error("Please enter repository URL.");
      return;
    }

    setLoading(true);
    try {
      await teamService.submitRepoUrl({ repoUrl });
      toast.success("Team repository URL updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update project repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={project?.title || "Assigned Capstone Project"}
      subtitle="Final module deliverables and tracking"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-wider">
            Project Overview
          </h4>
          <p className="text-sm text-[var(--color-text)] mt-1 leading-relaxed">
            {project?.description ||
              "Your capstone project requirements and evaluation rubrics will appear here once finalized by your trainer."}
          </p>
        </div>

        {project?.guidelines && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-wider">
              Submission Guidelines
            </h4>
            <ul className="mt-1 text-xs text-[var(--color-text-muted)] space-y-1 list-disc list-inside">
              <li>Must contain a detailed README.md</li>
              <li>Commit messages should follow standard git conventions</li>
              <li>Live deployment link must be functional</li>
            </ul>
          </div>
        )}

        <form onSubmit={handleUpdateRepo} className="pt-4 border-t border-[var(--color-border-subtle)] space-y-3">
          <Input
            label="Team Repository Link"
            placeholder="https://github.com/team-name/lms-capstone"
            icon={FolderGit2}
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              icon={CheckCircle2}
            >
              Save Repository
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
