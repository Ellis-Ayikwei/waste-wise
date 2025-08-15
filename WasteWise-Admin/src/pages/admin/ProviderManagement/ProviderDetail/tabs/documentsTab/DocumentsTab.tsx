import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faDownload, faEye, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import DocumentViewer from './DocumentViewer';

import { Plus, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';
import AddProviderDocumentModal from './AddProviderDocumentModal';
import axiosInstance from '../../../../../../services/axiosInstance';


interface DocumentsTabProps {
  provider: any;
  isAdmin?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ provider, isAdmin = false }) => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/providers/${provider.id}/documents/`);
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (documentData: FormData) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/providers/${provider.id}/documents/`, documentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchDocuments();
      setIsUploadModalOpen(false);
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (document: DocumentType, notes: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/providers/${provider.id}/verify_document/`, {
        document_id: document.id,
        is_verified: true,
        verification_note: notes
      });
      await fetchDocuments();
      return true;
    } catch (err) {
      setError('Failed to verify document');
      console.error('Error verifying document:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (document: DocumentType, reason: string) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/providers/${provider.id}/reject_document/`, {
        document_id: document.id,
        is_verified: false,
        rejection_reason: reason
      });
      await fetchDocuments();
      return true;
    } catch (err) {
      setError('Failed to reject document');
      console.error('Error rejecting document:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document: DocumentType, side?: string) => {
    try {
      const response = await axiosInstance.get(
        `/providers/${provider.id}/documents/${document.id}/download/${side || 'front'}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', side === 'back' ? document.back_url! : document.front_url);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download document');
      console.error('Error downloading document:', err);
    }
  };

  const handleDownloadAll = async (document: DocumentType) => {
    if (document.has_two_sides) {
      await handleDownload(document, 'front');
      await handleDownload(document, 'back');
    } else {
      await handleDownload(document);
    }
  };

  const handleDelete = async (document: DocumentType) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/provider-documents/${document.id}/`);
      await fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-white">Documents</h3>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn btn-outline-primary flex items-center gap-2"
        >
          <Plus />
          Upload Document
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faTimes} className="mr-3" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {doc.name}
              </h3>
              {doc.status === 'verified' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : doc.status === 'rejected' ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reference: {doc.reference_number}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Issue Date: {new Date(doc.issue_date).toLocaleDateString()}
            </p>
            {doc.expiry_date && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expires: {new Date(doc.expiry_date).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedDocument(doc);
                  setIsViewerOpen(true);
                }}
                className="btn btn-sm btn-outline-primary flex items-center"
              >
                <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-1" />
                View
              </button>
              {doc.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedDocument(doc);
                      setIsVerifyModalOpen(true);
                    }}
                    className="btn btn-sm btn-success flex items-center"
                  >
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-1" />
                    Verify
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocument(doc);
                      setIsRejectModalOpen(true);
                    }}
                    className="btn btn-sm btn-danger flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(doc)}
                className="btn btn-sm btn-danger flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddProviderDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        providerId={provider.id}
        onSuccess={fetchDocuments}
      />

      {selectedDocument && (
        <>
          <DocumentViewer
            document={selectedDocument}
            isOpen={isViewerOpen}
            onClose={() => {
              setIsViewerOpen(false);
              setSelectedDocument(null);
            }}
            onVerify={ selectedDocument.status === 'pending' ? () => setIsVerifyModalOpen(true) : undefined}
            onReject={ selectedDocument.status === 'pending' ? () => setIsRejectModalOpen(true) : undefined}
            onDownload={handleDownload}
            onDownloadAll={handleDownloadAll}
            isAdmin={isAdmin}
          />

          <DocumentVerifyModal
            document={selectedDocument}
            isOpen={isVerifyModalOpen}
            onClose={() => {
              setIsVerifyModalOpen(false);
              setSelectedDocument(null);
            }}
            onVerify={handleVerify}
            onReject={handleReject}
            action="verify"
          />

          <DocumentVerifyModal
            document={selectedDocument}
            isOpen={isRejectModalOpen}
            onClose={() => {
              setIsRejectModalOpen(false);
              setSelectedDocument(null);
            }}
            onVerify={handleVerify}
            onReject={handleReject}
            action="reject"
          />
        </>
      )}
    </div>
  );
};

export default DocumentsTab; 