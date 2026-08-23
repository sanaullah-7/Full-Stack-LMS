import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Link as LinkIcon, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { taskService } from "../../services/task.service";
import toast from "react-hot-toast";

export const TaskSubmissionModal = ({ isOpen, onClose, task, onSuccess }) => {
  const [submissionUrl, setSubmissionUrl] = useState(task?.submissionUrl || "");
  const [notes, setNotes] = useState(task?.notes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!submissionUrl.trim()) {
      toast.error("Please enter a valid GitHub or live project URL.");
      return;
    }

    setLoading(true);
    try {
      await taskService.submitTask(task._id || task.id, {
        submissionUrl,
        notes,
      });
      toast.success("Task work submitted successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit task.");
    } finally {
      setLoading(false);
    }
  };

  const formId = "task-submission-form";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assignment Submission"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading} style={{ marginRight: 'auto', fontWeight: '500' }}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={loading} style={{ padding: '0.6rem 1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
            Submit Assignment <ArrowRight size={16} style={{ marginLeft: '6px' }} />
          </Button>
        </>
      }
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
          {task?.title || "Build REST API endpoints for attendance"}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <span style={{ 
            backgroundColor: 'var(--accent-lite)', color: 'var(--accent)', 
            padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', 
            fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' 
          }}>
            {task?.category || "Backend"}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <Clock size={14} /> Due: {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "8/19/2026"}
          </span>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(145deg, var(--bg), var(--surface))',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '1.25rem',
        marginBottom: '1.75rem',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem' }}>
          Instructions
        </h4>
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.6' }}>
          {task?.description || "Create robust API endpoints with Mongoose and Express. Ensure all error handling is in place and follow the repository guidelines."}
        </p>
      </div>

      <form id={formId} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
            Submission URL <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <LinkIcon size={18} />
            </div>
            <input
              type="url"
              placeholder="https://github.com/username/project-repo"
              required
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '14px',
                color: 'var(--text)',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-lite)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Provide the direct link to your repository or live project.
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
            Comments / Notes <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span>
          </label>
          <div style={{ position: 'relative' }}>
             <div style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }}>
              <MessageSquare size={18} />
            </div>
            <textarea
              rows={3}
              placeholder="Add any context or notes for the evaluator..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '14px',
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                minHeight: '100px',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-lite)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

      </form>
    </Modal>
  );
};
