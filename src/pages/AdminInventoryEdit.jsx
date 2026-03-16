import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import InventoryForm from '../components/inventory/InventoryForm'
import { inventoryApi } from '../services/inventoryApi'
import { useInventory } from '../store/InventoryContext'
import styles from './AdminInventoryCreate.module.css'

export default function AdminInventoryEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateItem } = useInventory()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [serverError, setServerError] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    inventoryApi.getById(id)
      .then(data => setItem(data))
      .catch(() => setServerError('Не вдалося завантажити дані'))
      .finally(() => setFetchLoading(false))
  }, [id])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleUpdateText(data) {
    setLoading(true)
    setServerError(null)
    try {
      const updated = await inventoryApi.update(id, data)
      updateItem(id, updated)
      setItem(prev => ({ ...prev, ...updated }))
      showToast('Дані оновлено')
    } catch (e) {
      setServerError(e?.response?.data?.message || e.message || 'Помилка оновлення')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePhoto(formData) {
    setLoading(true)
    setServerError(null)
    try {
      await inventoryApi.updatePhoto(id, formData)
      updateItem(id, { _photoUpdated: Date.now() })
      showToast('Фото оновлено')
    } catch (e) {
      setServerError(e?.response?.data?.message || e.message || 'Помилка завантаження фото')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className={styles.page}>
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
          Завантаження…
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/admin/inventory" className={styles.back}>
          <BackIcon /> До списку
        </Link>
        <div>
          <h1 className={styles.title}>Редагування</h1>
          <p className={styles.subtitle}>{item?.inventory_name || `ID: ${id}`}</p>
        </div>
      </div>

      {serverError && (
        <div className={styles.error}>⚠️ {serverError}</div>
      )}

      {item && (
        <InventoryForm
          isEdit={true}
          initialValues={item}
          onSubmitText={handleUpdateText}
          onSubmitPhoto={handleUpdatePhoto}
          loading={loading}
        />
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: toast.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
          fontSize: 13, fontWeight: 500, boxShadow: 'var(--shadow-md)',
          animation: 'toastIn 0.2s ease', zIndex: 2000
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  )
}
