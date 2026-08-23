const fs = require('fs');

const path = 'src/pages/tasks/Tasks.jsx';
let content = fs.readFileSync(path, 'utf8');

// Update imports
content = content.replace(
  /import \{ List, LayoutGrid, Link as LinkIcon, Loader2 \} from "lucide-react";/,
  'import { List, LayoutGrid, Link as LinkIcon, Loader2, Clock, MessageSquare, ArrowRight } from "lucide-react";'
);

// Extract the Modal part to replace
const modalStartStr = '{/* Assignment Details Modal */}';
const modalStartIndex = content.indexOf(modalStartStr);
if (modalStartIndex === -1) {
  console.error("Could not find start of Modal");
  process.exit(1);
}

const afterModalIndex = content.lastIndexOf('</div>'); // The end of Tasks component div
if (afterModalIndex === -1) {
  console.error("Could not find end of file div");
  process.exit(1);
}

// We will replace everything from modalStartStr up to the very last '</div>\n  );\n};'
const newModalContent = `{/* Assignment Details Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => !isSubmitting && setSelectedTask(null)}
        title="Assignment Details"
        size="lg"
        footer={
          selectedTask?.status === "completed" ? (
            <button type="button" className="btn-outline" onClick={() => setSelectedTask(null)}>Close</button>
          ) : (
            <>
              <button type="button" className="btn-outline" onClick={() => setSelectedTask(null)} disabled={isSubmitting}>Cancel</button>
              <button
                type="submit"
                form="submit-assignment-form"
                className="btn-primary"
                disabled={isSubmitting}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontWeight: '600' }}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight size={16} />}
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </>
          )
        }
      >
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Header Block */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                {selectedTask.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ 
                  backgroundColor: 'var(--accent-lite)', color: 'var(--accent)', 
                  padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', 
                  fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' 
                }}>
                  {selectedTask.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <Clock size={14} /> Due: {new Date(selectedTask.dueDate).toLocaleDateString()}
                </span>
                {selectedTask.status === 'completed' && <span className="tag tag-done">Completed</span>}
              </div>
            </div>

            {/* Premium Instructions Box */}
            <div style={{
              background: 'linear-gradient(to bottom right, var(--surface), var(--bg))',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', fontWeight: '700', marginBottom: '0.75rem' }}>
                Instructions
              </h4>
              <p style={{ fontSize: '14.5px', color: 'var(--text)', lineHeight: '1.6' }}>
                {selectedTask.description || "No specific instructions provided by the instructor."}
              </p>
            </div>

            {/* Submission Form / Status */}
            {selectedTask.status === "completed" ? (
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--success)',
                borderRadius: '12px',
                padding: '1.5rem',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>Your Submitted Work</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Repository URL</span>
                  <a href={selectedTask.submissionLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '14px', fontWeight: '500', background: 'var(--accent-lite)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
                    <LinkIcon size={14} /> {selectedTask.submissionLink}
                  </a>
                </div>
                {selectedTask.submissionDescription && (
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Submission Notes</span>
                    <p style={{ fontSize: '14px', color: 'var(--text)', background: 'var(--bg)', padding: '0.75rem', borderRadius: '6px' }}>{selectedTask.submissionDescription}</p>
                  </div>
                )}
              </div>
            ) : (
              <form id="submit-assignment-form" onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
                    Submission URL <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <LinkIcon size={18} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project-repo"
                      required
                      value={submitForm.link}
                      onChange={(e) => setSubmitForm({ ...submitForm, link: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem 0.85rem 2.75rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        fontSize: '14px',
                        color: 'var(--text)',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-lite)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
                    Comments / Notes <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(Optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-muted)' }}>
                      <MessageSquare size={18} />
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Add any context or notes for the evaluator..."
                      value={submitForm.description}
                      onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem 0.85rem 2.75rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        fontSize: '14px',
                        color: 'var(--text)',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '100px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-lite)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
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
`;

const finalContent = content.substring(0, modalStartIndex) + newModalContent;
fs.writeFileSync(path, finalContent);
console.log('Done!');
