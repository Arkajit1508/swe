
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

const documentCategories = [
  { type: '10th_Marksheet', label: 'Secondary / Class 10 Marksheet', required: true },
  { type: '12th_Marksheet', label: 'Higher Secondary / Class 12 Marksheet', required: true },
  { type: 'ID_Proof', label: 'Government ID Proof (Aadhaar / Voter ID / Passport)', required: true },
  { type: 'Photograph', label: 'Passport Size Photograph', required: true },
  { type: 'Signature', label: 'Applicant Signature Specimen', required: false },
  { type: 'Entrance_Rank_Card', label: 'IEMJEE / WBJEE / JEE Rank Card', required: false }
];

const DocumentUpload = () => {
  const [applicationId, setApplicationId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedType, setSelectedType] = useState('10th_Marksheet');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewDoc, setPreviewDoc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDocuments = async () => {
    try {
      const appRes = await api.get('/applications/me');

      if (appRes.success && appRes.application) {
        setApplicationId(appRes.application._id);

        const docsRes = await api.get(
          `/documents/application/${appRes.application._id}`
        );

        if (docsRes.success) {
          setDocuments(docsRes.documents || []);
        }
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload or replace a document
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      return setMessage({
        type: 'danger',
        text: 'Please choose a file to upload'
      });
    }

    if (!applicationId) {
      return setMessage({
        type: 'danger',
        text: 'Application profile not initialized'
      });
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const sendUpload = async (dataUrl = null) => {
      const formData = new FormData();
      formData.append('applicationId', applicationId);
      formData.append('documentType', selectedType);
      formData.append('fileName', file.name);
      formData.append('fileSize', `${Math.round(file.size / 1024)} KB`);
      if (dataUrl) formData.append('dataUrl', dataUrl);
      formData.append('file', file);

      try {
        const res = await api.post('/documents/upload', formData);

        if (res.success) {
          setMessage({
            type: 'success',
            text: `Uploaded ${selectedType.replace(/_/g, ' ')} successfully!`
          });

          setFile(null);

          const fileInput = document.getElementById('docFileInput');
          if (fileInput) {
            fileInput.value = '';
          }

          await fetchDocuments();
        }
      } catch (err) {
        setMessage({
          type: 'danger',
          text: err.message || 'Upload failed'
        });
      } finally {
        setUploading(false);
      }
    };

    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      const reader = new FileReader();
      reader.onload = () => sendUpload(reader.result);
      reader.onerror = () => sendUpload(null);
      reader.readAsDataURL(file);
    } else {
      sendUpload(null);
    }
  };

  // Delete a document
  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const res = await api.delete(`/documents/${docId}`);

      if (res.success) {
        setMessage({
          type: 'success',
          text: 'Document removed successfully'
        });

        await fetchDocuments();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.message || 'Delete failed'
      });
    }
  };

  // View a document
  const handleViewDocument = async (docId) => {
    try {
      const res = await api.get(`/documents/${docId}/url`);
      if (res && (res.url || res.html)) {
        setPreviewDoc(res);
        setModalOpen(true);
      } else {
        await api.openDocument(docId);
      }
    } catch (err) {
      api.openDocument(docId).catch((e) => {
        setMessage({
          type: 'danger',
          text: err.message || 'Unable to open document'
        });
      });
    }
  };

  // Document verification status badge
  const getDocStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span style={{
            color: 'var(--success)',
            fontWeight: '700',
            fontSize: '0.8rem'
          }}>
            ✓ Verified
          </span>
        );

      case 'REJECTED':
        return (
          <span style={{
            color: 'var(--danger)',
            fontWeight: '700',
            fontSize: '0.8rem'
          }}>
            ✕ Rejected
          </span>
        );

      default:
        return (
          <span style={{
            color: 'var(--warning)',
            fontWeight: '600',
            fontSize: '0.8rem'
          }}>
            ⏳ Pending Verification
          </span>
        );
    }
  };

  // Safely format uploaded date
  const formatUploadedDate = (doc) => {
    const dateValue = doc?.uploadedAt || doc?.createdAt;
    if (dateValue) {
      const date = new Date(dateValue);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN');
      }
    }
    return new Date().toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        Loading documents checklist...
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Document Upload & Management</h1>

      <p className="page-subtitle">
        Upload scanned copies of your official documents in PDF, PNG, or JPG
        format (Max 5MB per file)
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Upload Box */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="section-title">Upload / Replace Document</h3>

        <form onSubmit={handleUpload}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Select Document Type <span className="required">*</span>
              </label>

              <select
                className="form-control"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {documentCategories.map((cat) => (
                  <option key={cat.type} value={cat.type}>
                    {cat.label} {cat.required ? '(Mandatory)' : '(Optional)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Choose File (PDF, JPG, PNG) <span className="required">*</span>
              </label>

              <input
                type="file"
                id="docFileInput"
                className="form-control"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0] || null)}
                required
              />

              <div className="form-hint">
                Maximum file size allowed is 5 MB.
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={uploading}
          >
            {uploading ? 'Uploading File...' : '📤 Upload Selected Document'}
          </button>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="card">
        <h3 className="section-title">Uploaded Documents Checklist</h3>

        {documents.length === 0 ? (
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            padding: '1rem 0'
          }}>
            No documents uploaded yet. Please use the form above to upload
            your certificates.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Original Filename</th>
                  <th>File Size</th>
                  <th>Uploaded Date</th>
                  <th>Verification Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <strong>
                        {doc.documentType.replace(/_/g, ' ')}
                      </strong>
                    </td>

                    <td style={{ color: 'var(--text-muted)' }}>
                      {doc.originalFileName}
                    </td>

                    <td>
                      {typeof doc.fileSize === 'number'
                        ? `${Math.round(doc.fileSize / 1024)} KB`
                        : (doc.fileSize || '1.2 MB')}
                    </td>

                    <td>
                      {formatUploadedDate(doc)}
                    </td>

                    <td>
                      {getDocStatusBadge(doc.verificationStatus)}
                    </td>

                    <td style={{
                      fontSize: '0.8rem',
                      color: doc.remarks
                        ? 'var(--danger)'
                        : 'var(--text-muted)'
                    }}>
                      {doc.remarks || '—'}
                    </td>

                    <td>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <button
                          type="button"
                          onClick={() => handleViewDocument(doc._id)}
                          className="btn btn-secondary btn-sm"
                        >
                          👁️ View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(doc._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete document"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* In-app Document Viewer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={previewDoc?.document?.originalFileName || 'Official Document Dossier'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '520px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--primary-light)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary-border)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <strong>Status:</strong> {previewDoc?.document?.verificationStatus || 'VERIFIED'} |{' '}
              {previewDoc?.document?.fileSize || '1.2 MB'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {previewDoc?.url && (
                <button
                  type="button"
                  onClick={() => window.open(previewDoc.url, '_blank')}
                  className="btn btn-primary btn-sm"
                >
                  ↗ Open in New Window
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const frame = document.getElementById('previewIframeStudent');
                  if (frame?.contentWindow) frame.contentWindow.print();
                  else window.print();
                }}
                className="btn btn-secondary btn-sm"
              >
                🖨️ Print
              </button>
            </div>
          </div>
          <iframe
            id="previewIframeStudent"
            srcDoc={previewDoc?.html}
            src={previewDoc?.url}
            title="Document Viewer"
            style={{
              width: '100%',
              height: '520px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DocumentUpload;
