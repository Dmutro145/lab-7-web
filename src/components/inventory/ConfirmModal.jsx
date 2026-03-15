import React, { useEffect } from 'react'
import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ item, onConfirm, onCancel, loading }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.icon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 className={styles.title}>Підтвердіть видалення</h3>
        <p className={styles.message}>
          Ви впевнені, що хочете видалити{' '}
          <strong className={styles.itemName}>«{item?.inventory_name}»</strong>?
          <br />
          <span className={styles.sub}>Цю дію неможливо скасувати.</span>
        </p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onCancel} disabled={loading}>
            Скасувати
          </button>
          <button className={styles.btnDelete} onClick={onConfirm} disabled={loading}>
            {loading
              ? <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
              : null
            }
            Видалити
          </button>
        </div>
      </div>
    </div>
  )
}
