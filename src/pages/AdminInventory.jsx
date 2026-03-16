import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInventory } from '../store/InventoryContext'
import InventoryTable from '../components/inventory/InventoryTable'
import ConfirmModal from '../components/inventory/ConfirmModal'
import { inventoryApi } from '../services/inventoryApi'
import styles from './AdminInventory.module.css'

export default function AdminInventory() {
  const { items, loading, error, fetchAll, removeItem } = useInventory()
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchAll() }, [fetchAll])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await inventoryApi.delete(deleteTarget.id ?? deleteTarget._id)
      removeItem(deleteTarget.id ?? deleteTarget._id)
      showToast(`«${deleteTarget.inventory_name}» видалено`)
    } catch {
      showToast('Помилка видалення', 'error')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Інвентар</h1>
          <p className={styles.subtitle}>
            {loading ? 'Завантаження…' : `${items.length} позицій на складі`}
          </p>
        </div>
        <Link to="/admin/inventory/create" className={styles.btnCreate}>
          <PlusIcon /> Додати позицію
        </Link>
      </div>

      {error && (
        <div className={styles.errorState}>
          <span>⚠️ {error}</span>
          <button onClick={fetchAll} className={styles.retryBtn}>Повторити</button>
        </div>
      )}

      {loading && !error && (
        <div className={styles.loadingState}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className={styles.emptyState}>
          <BoxIcon />
          <p>Інвентар порожній</p>
          <Link to="/admin/inventory/create" className={styles.btnCreate}>
            Додати першу позицію
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <InventoryTable items={items} onDeleteRequest={setDeleteTarget} />
      )}

      {deleteTarget && (
        <ConfirmModal
          item={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}
