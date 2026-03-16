import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import InventoryDetails from '../components/inventory/InventoryDetails'
import ConfirmModal from '../components/inventory/ConfirmModal'
import { inventoryApi } from '../services/inventoryApi'
import { useInventory } from '../store/InventoryContext'
import styles from './AdminInventoryDetails.module.css'

export default function AdminInventoryDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { removeItem } = useInventory()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    inventoryApi.getById(id)
      .then(setItem)
      .catch(() => setError('Позицію не знайдено'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await inventoryApi.delete(id)
      removeItem(id)
      navigate('/admin/inventory')
    } catch {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/admin/inventory" className={styles.back}>
          <BackIcon /> До списку
        </Link>
        {item && (
          <div className={styles.actions}>
            <Link to={`/admin/inventory/${id}/edit`} className={styles.btnEdit}>
              <EditIcon /> Редагувати
            </Link>
            <button className={styles.btnDelete} onClick={() => setShowConfirm(true)}>
              <TrashIcon /> Видалити
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.skeletonCard} />
        </div>
      )}

      {error && (
        <div className={styles.error}>⚠️ {error}</div>
      )}

      {item && !loading && (
        <InventoryDetails item={item} />
      )}

      {showConfirm && item && (
        <ConfirmModal
          item={item}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}
    </div>
  )
}

function BackIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
}
function EditIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
