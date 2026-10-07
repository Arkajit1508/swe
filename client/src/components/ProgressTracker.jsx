import React from 'react';

const steps = [
  { key: 'DRAFT', label: 'Form Draft' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'UNDER_REVIEW', label: 'Review' },
  { key: 'DOCUMENT_VERIFICATION', label: 'Doc Check' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'COUNSELLING', label: 'Counselling' },
  { key: 'ALLOCATED', label: 'Allocated' }
];

const ProgressTracker = ({ currentStatus }) => {
  const getStepIndex = (status) => {
    switch (status) {
      case 'DRAFT': return 0;
      case 'SUBMITTED': return 1;
      case 'UNDER_REVIEW': return 2;
      case 'DOCUMENT_VERIFICATION': return 3;
      case 'APPROVED': return 4;
      case 'COUNSELLING': return 5;
      case 'ALLOCATED': return 6;
      case 'REJECTED': return 3; // highlights up to check point
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div style={{ margin: '1.5rem 0 2rem 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Progress Line */}
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '4%',
            right: '4%',
            height: '4px',
            backgroundColor: 'var(--border-color)',
            zIndex: 1
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: isRejected ? 'var(--danger)' : 'var(--primary)',
              width: `${(activeIndex / (steps.length - 1)) * 100}%`,
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          let nodeBg = 'var(--bg-card)';
          let nodeBorder = 'var(--border-color)';
          let nodeColor = 'var(--text-muted)';

          if (isCompleted) {
            nodeBg = 'var(--primary)';
            nodeBorder = 'var(--primary)';
            nodeColor = '#ffffff';
          } else if (isCurrent) {
            nodeBg = isRejected ? 'var(--danger)' : 'var(--primary-light)';
            nodeBorder = isRejected ? 'var(--danger)' : 'var(--primary)';
            nodeColor = isRejected ? '#ffffff' : 'var(--primary)';
          }

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                flex: 1
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: nodeBg,
                  border: `2px solid ${nodeBorder}`,
                  color: nodeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  boxShadow: isCurrent ? '0 0 0 4px var(--primary-border)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? '700' : '500',
                  color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)',
                  textAlign: 'center'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
