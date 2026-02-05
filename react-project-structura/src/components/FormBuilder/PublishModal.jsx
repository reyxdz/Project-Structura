import React, { useState } from 'react';
import { copyToClipboard, generateQRCodeUrl, unpublishForm } from '../../utils/formApi';
import './PublishModal.css';

/**
 * PublishModal Component
 * Displays the public form link with copy, QR code, and sharing options
 */
export default function PublishModal({ isOpen, onClose, formId, publishData, onUnpublish }) {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [unpublishing, setUnpublishing] = useState(false);

    if (!isOpen || !publishData) return null;

    const { publicUrl, responseCount } = publishData;
    const qrUrl = generateQRCodeUrl(publicUrl, { size: 250 });

    const handleCopyLink = async () => {
        const success = await copyToClipboard(publicUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleUnpublish = async () => {
        if (window.confirm('Are you sure you want to unpublish this form? The public link will no longer work.')) {
            setUnpublishing(true);
            try {
                await unpublishForm(formId);
                if (onUnpublish) {
                    onUnpublish();
                }
                onClose();
            } catch (error) {
                console.error('Unpublish error:', error);
                alert('Failed to unpublish form: ' + error.message);
            } finally {
                setUnpublishing(false);
            }
        }
    };

    return (
        <div className="publish-modal-overlay" onClick={onClose}>
            <div className="publish-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="publish-modal-header">
                    <h2>🎉 Form Published!</h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="publish-modal-body">
                    {/* Link Section */}
                    <div className="publish-section">
                        <h3>Public Link</h3>
                        <p className="publish-description">
                            Share this link with participants to collect their responses
                        </p>
                        <div className="link-container">
                            <input
                                type="text"
                                className="public-link-input"
                                value={publicUrl}
                                readOnly
                            />
                            <button
                                className={`btn-copy ${copied ? 'copied' : ''}`}
                                onClick={handleCopyLink}
                                title={copied ? 'Copied!' : 'Copy to clipboard'}
                            >
                                {copied ? '✓ Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="publish-section">
                        <h3>QR Code</h3>
                        <p className="publish-description">
                            Scan with mobile device for instant access
                        </p>
                        <button
                            className="btn-toggle-qr"
                            onClick={() => setShowQR(!showQR)}
                        >
                            {showQR ? 'Hide QR Code' : 'Show QR Code'}
                        </button>
                        {showQR && (
                            <div className="qr-code-container">
                                <img
                                    src={qrUrl}
                                    alt="QR Code for public form"
                                    className="qr-code-image"
                                />
                            </div>
                        )}
                    </div>

                    {/* Stats Section */}
                    <div className="publish-section stats-section">
                        <div className="stat-item">
                            <span className="stat-label">Responses:</span>
                            <span className="stat-value">{responseCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Status:</span>
                            <span className="stat-value status-published">Published</span>
                        </div>
                    </div>

                    {/* Sharing Options */}
                    <div className="publish-section">
                        <h3>Share Via</h3>
                        <div className="share-buttons">
                            <button
                                className="share-btn email"
                                title="Share via email"
                                onClick={() => {
                                    window.location.href = `mailto:?subject=Form Submission&body=${encodeURIComponent(publicUrl)}`;
                                }}
                            >
                                📧 Email
                            </button>
                            <button
                                className="share-btn whatsapp"
                                title="Share via WhatsApp"
                                onClick={() => {
                                    window.open(
                                        `https://wa.me/?text=${encodeURIComponent(publicUrl)}`,
                                        '_blank'
                                    );
                                }}
                            >
                                💬 WhatsApp
                            </button>
                            <button
                                className="share-btn facebook"
                                title="Share via Facebook"
                                onClick={() => {
                                    window.open(
                                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`,
                                        '_blank'
                                    );
                                }}
                            >
                                👥 Facebook
                            </button>
                            <button
                                className="share-btn twitter"
                                title="Share via Twitter"
                                onClick={() => {
                                    window.open(
                                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=Check%20out%20this%20form`,
                                        '_blank'
                                    );
                                }}
                            >
                                𝕏 Twitter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="publish-modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={handleUnpublish}
                        disabled={unpublishing}
                    >
                        {unpublishing ? 'Unpublishing...' : 'Unpublish Form'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
