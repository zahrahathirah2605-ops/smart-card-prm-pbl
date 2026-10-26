import React, { useState } from 'react';
import './DetailModal.css';

const DetailModal = ({
  isOpen,
  onClose,
  title = 'Rincian Detail',
  badgeText = null,
  badgeType = 'neutral', // 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children,
  actions = null
}) => {
  if (!isOpen) return null;

  return (
    <div className="detail-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-modal-header">
          <div className="detail-modal-heading-group">
            {badgeText && (
              <span className={`detail-modal-badge badge-${badgeType}`}>
                {badgeText}
              </span>
            )}
            <h3 className="detail-modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="detail-modal-close-btn"
            onClick={onClose}
            aria-label="Tutup Popup"
            title="Tutup (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="detail-modal-body">
          {children}
        </div>

        {/* Footer Actions */}
        <div className="detail-modal-footer">
          {actions ? (
            actions
          ) : (
            <button type="button" className="detail-modal-btn-close" onClick={onClose}>
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
