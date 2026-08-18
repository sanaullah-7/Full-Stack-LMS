import { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { formatLongLocalDate, getLocalToday } from '../../utils/localDate';

const TakeAttendanceModal = ({ students, onClose, onSave, selectedDate }) => {
  // Initialize attendance draft state with any existing statuses
  const [draft, setDraft] = useState(() => {
    const initialState = {};
    students.forEach((s) => {
      if (s.status === 'Present') initialState[s.id] = 'P';
      else if (s.status === 'Absent') initialState[s.id] = 'A';
      else if (s.status === 'Leave') initialState[s.id] = 'L';
    });
    return initialState;
  });

  const [checkInTimes, setCheckInTimes] = useState({});

  // Backend field is still `note`; UI label is "Reason"
  const [reasons, setReasons] = useState(() => {
    const initial = {};
    students.forEach((s) => {
      if (s.note) initial[s.id] = s.note;
    });
    return initial;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lockedSessionIds, setLockedSessionIds] = useState(new Set());
  const tableContainerRef = useRef(null);
  const rowRefs = useRef({});

  const isStudentLocked = useCallback((id) => {
    const s = students.find((x) => x.id === id);
    return (s && s.status !== 'Not marked') || lockedSessionIds.has(id);
  }, [students, lockedSessionIds]);

  const handleMoveToRow = useCallback((newIndex) => {
    const currentStudentId = students[activeIndex]?.id;
    if (currentStudentId) {
      setLockedSessionIds(prev => {
        const newSet = new Set(prev);
        newSet.add(currentStudentId);
        return newSet;
      });
    }
    setActiveIndex(newIndex);
  }, [students, activeIndex]);

  // Auto-mark the focused student as 'P' if they don't have a status yet and are not locked
  useEffect(() => {
    const currentStudentId = students[activeIndex]?.id;
    if (currentStudentId && !isStudentLocked(currentStudentId)) {
      setDraft(prev => {
        if (!prev[currentStudentId]) {
          // Record the time automatically
          const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          setCheckInTimes(times => ({ ...times, [currentStudentId]: time }));
          return { ...prev, [currentStudentId]: 'P' };
        }
        return prev;
      });
    }
  }, [activeIndex, students, lockedSessionIds, isStudentLocked]);

  const currentDate = formatLongLocalDate(selectedDate || getLocalToday());

  // Handle keyboard events globally when modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const currentStudentId = students[activeIndex]?.id;
      if (!currentStudentId) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isStudentLocked(currentStudentId)) {
          setDraft((prev) => {
            const currentStatus = prev[currentStudentId] || 'P';
            const nextStatus = currentStatus === 'P' ? 'A' : currentStatus === 'A' ? 'L' : 'P';
            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            setCheckInTimes(times => ({ ...times, [currentStudentId]: time }));
            return { ...prev, [currentStudentId]: nextStatus };
          });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (!isStudentLocked(currentStudentId)) {
          setDraft((prev) => {
            const currentStatus = prev[currentStudentId] || 'P';
            const nextStatus = currentStatus === 'P' ? 'L' : currentStatus === 'A' ? 'P' : 'A';
            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            setCheckInTimes(times => ({ ...times, [currentStudentId]: time }));
            return { ...prev, [currentStudentId]: nextStatus };
          });
        }
      } else if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeIndex < students.length - 1) {
          handleMoveToRow(activeIndex + 1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeIndex > 0) {
          handleMoveToRow(activeIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, students, lockedSessionIds, handleMoveToRow, isStudentLocked]);

  // Auto-scroll to active row
  useEffect(() => {
    const activeRow = rowRefs.current[activeIndex];
    if (activeRow && tableContainerRef.current) {
      activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex]);

  const isAllPresent = students.length > 0 && students.every(s => draft[s.id] === 'P');

  const handleToggleAll = () => {
    if (isAllPresent) {
      // Unmark only unlocked students
      setDraft((prev) => {
        const newState = { ...prev };
        students.forEach((s) => {
          if (!isStudentLocked(s.id)) {
            delete newState[s.id];
          }
        });
        return newState;
      });
      setCheckInTimes({});
    } else {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setDraft((prev) => {
        const newState = { ...prev };
        students.forEach((s) => {
          if (!isStudentLocked(s.id)) {
            newState[s.id] = 'P';
            setCheckInTimes(times => ({ ...times, [s.id]: time }));
          }
        });
        return newState;
      });
    }
  };

  const handleSave = () => {
    // Convert draft (P, A, L) back to actual status (Present, Absent, Leave)
    const statusMap = { P: 'Present', A: 'Absent', L: 'Leave' };
    const updates = students.map(s => {
      const draftStatus = draft[s.id];
      const time = checkInTimes[s.id] || s.checkInTime || null;
      return {
        id: s.id,
        status: statusMap[draftStatus] || 'Not marked',
        checkInTime: draftStatus === 'P' ? time : null,
        note: (reasons[s.id] ?? s.note ?? '').trim(),
      };
    });
    
    onSave(updates);
    onClose();
  };

  const Bubble = ({ letter, active, onClick, colorClass, disabled }) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border transition-colors ${
        disabled && active 
          ? `opacity-60 cursor-not-allowed ${colorClass}` 
          : disabled 
            ? 'opacity-30 cursor-not-allowed border-[var(--color-border)] text-[var(--color-text-muted)]' 
            : active 
              ? colorClass 
              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] cursor-pointer'
      }`}
    >
      {letter}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-2xl border border-[var(--color-border)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-surface-highest)] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">Daily Attendance</h2>
            <p className="text-sm font-medium text-[var(--color-text-muted)] mt-1">{currentDate}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-high)] text-[var(--color-text)] text-sm font-medium rounded-lg transition-colors border border-[var(--color-border)] min-w-[140px] justify-center"
            >
              {isAllPresent ? (
                <>
                  <X className="h-4 w-4 text-[var(--color-text-muted)]" />
                  Unmark all present
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                  Mark all present
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-low)] rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="bg-[var(--color-primary-container)]/10 px-6 py-3 shrink-0 flex items-center justify-center border-b border-[var(--color-surface-highest)]">
          <p className="text-xs font-medium text-[var(--color-primary)]">
            <strong className="mr-2">Keyboard Shortcuts:</strong> 
            Use <kbd className="px-1.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded mx-1">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded mx-1">→</kbd> 
            arrows to switch between P, A, and L. 
            Press <kbd className="px-1.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded mx-1">Enter</kbd> to move to next student.
          </p>
        </div>

        {/* Table Body */}
        <div ref={tableContainerRef} className="flex-1 overflow-y-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="sticky top-0 bg-[var(--color-surface)] z-10 shadow-sm">
              <tr className="border-b border-[var(--color-surface-highest)]">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-highest)] text-sm">
              {students.map((student, index) => {
                const isActive = activeIndex === index;
                const status = draft[student.id];
                const isLocked = isStudentLocked(student.id);

                return (
                  <tr 
                    key={student.id} 
                    ref={(el) => (rowRefs.current[index] = el)}
                    onClick={() => handleMoveToRow(index)}
                    className={`transition-colors cursor-pointer ${
                      isActive ? 'bg-[var(--color-primary-container)]/10' : 'hover:bg-[var(--color-surface-low)]'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-[var(--color-text-muted)] text-[13px]">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0284c7]">
                      {student.name}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Bubble 
                          letter="P" 
                          active={status === 'P'} 
                          onClick={() => {
                            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            setCheckInTimes(times => ({ ...times, [student.id]: time }));
                            setDraft({ ...draft, [student.id]: 'P' });
                          }}
                          colorClass="bg-[#dcfce7] border-[#16a34a] text-[#16a34a]"
                          disabled={isLocked}
                        />
                        <Bubble 
                          letter="A" 
                          active={status === 'A'} 
                          onClick={() => {
                            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            setCheckInTimes(times => ({ ...times, [student.id]: time }));
                            setDraft({ ...draft, [student.id]: 'A' });
                          }}
                          colorClass="bg-[#fee2e2] border-[#ef4444] text-[#ef4444]" 
                          disabled={isLocked}
                        />
                        <Bubble 
                          letter="L" 
                          active={status === 'L'} 
                          onClick={() => {
                            const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            setCheckInTimes(times => ({ ...times, [student.id]: time }));
                            setDraft({ ...draft, [student.id]: 'L' });
                          }}
                          colorClass="bg-[#ffedd5] border-[#ea580c] text-[#ea580c]" 
                          disabled={isLocked}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="text" 
                        value={reasons[student.id] || ''}
                        onChange={(e) =>
                          setReasons((prev) => ({
                            ...prev,
                            [student.id]: e.target.value,
                          }))
                        }
                        placeholder="Add reason..."
                        className={`w-full bg-transparent border-none focus:ring-0 text-xs font-medium text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none ${
                          isActive ? 'opacity-100' : 'opacity-50'
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end p-6 border-t border-[var(--color-surface-highest)] shrink-0 bg-[var(--color-surface)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-[var(--color-on-primary)] text-sm font-semibold rounded-lg transition-colors shadow-md"
          >
            Save Attendance
          </button>
        </div>

      </div>
    </div>
  );
};

export default TakeAttendanceModal;
