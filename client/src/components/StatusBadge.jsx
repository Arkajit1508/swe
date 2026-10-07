import React from 'react';

const statusLabels = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  DOCUMENT_VERIFICATION: 'Doc Verification',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COUNSELLING: 'In Counselling',
  ALLOCATED: 'Seat Allocated'
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status || 'DRAFT';
  const label = statusLabels[normalizedStatus] || normalizedStatus;

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      <span style={{ fontSize: '0.65rem' }}>●</span> {label}
    </span>
  );
};

export default StatusBadge;
