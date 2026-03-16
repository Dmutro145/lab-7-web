import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import InventoryForm from '../components/inventory/InventoryForm'
import { inventoryApi } from '../services/inventoryApi'
import { useInventory } from '../store/InventoryContext'
import styles from './AdminInventoryCreate.module.css'

export default function AdminInventoryCreate() {
  const navigate = useNavigate()
  const { addItem } = useInventory()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  async function handleSubmitText({ inventory_name, description }) {
    // On create, collect text data and then also pick up photo from the form's state
    // The form calls onSubmitText with text data; for create we need multipart
    // So we intercept here and trigger the create call after collecting data
    // Store name/desc temporarily; photo is handled separately via onSubmitPhoto
    window.__pendingCreate = { inventory_name, description }
  }

  async function handleSubmitPhoto(photoFormData) {
    if (!window.__pendingCreate) {
      setServerError("Спочатку заповніть текстові поля та натисніть 'Створити інвентар'")
      return
    }
    setLoading(true)
    setServerError(null)
    try {
      const fd = new FormData()
      fd.append('inventory_name', window.__pendingCreate.inventory_name)
      fd.append('description', window.__pendingCreate.description)
      const photoFile = photoFormData.get('photo')
      if (photoFile) fd.append('photo', photoFile)
      const created = await inventoryApi.create(fd)
      addItem(created)
      delete window.__pendingCreate
      navigate('/admin/inventory')
    } catch (e) {
      setServerError(e?.response?.data?.message || e.message || 'Помилка створення')
    } finally {
      setLoading(false)
    }
  }

  // Simplified: for create, we just submit everything as one multipart on text submit
  async function handleCreate({ inventory_name, description }) {
    setLoading(true)
    setServerError(null)
    try {
      const fd = new FormData()
      fd.append('inventory_name', inventory_name)
      fd.append('description', description)
      const created = await inventoryApi.create(fd)
      addItem(created)
      navigate('/admin/inventory')
    } catch (e) {
      setServerError(e?.response?.data?.message || e.message || 'Помилка створення')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateWithPhoto(photoFormData) {
    // Grab last text values from pendingCreate if available
    const pending = window.__pendingCreate || {}
    if (!pending.inventory_name) {
      setServerError("Спочатку заповніть назву та натисніть 'Створити інвентар'")
      return
    }
    setLoading(true)
    setServerError(null)
    try {
      const fd = new FormData()
      fd.append('inventory_name', pending.inventory_name)
      fd.append('description', pending.description || '')
      const photoFile = photoFormData.get('photo')
      if (photoFile) fd.append('photo', photoFile)
      const created = await inventoryApi.create(fd)
      addItem(created)
      delete window.__pendingCreate
      navigate('/admin/inventory')
    } catch (e) {
      setServerError(e?.response?.data?.message || e.message || 'Помилка створення')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/admin/inventory" className={styles.back}>
          <BackIcon /> Назад
        </Link>
        <div>
          <h1 className={styles.title}>Нова позиція</h1>
          <p className={styles.subtitle}>Додати інвентар на склад</p>
        </div>
      </div>

      {serverError && (
        <div className={styles.error}>⚠️ {serverError}</div>
      )}

      <InventoryForm
        isEdit={false}
        onSubmitText={handleSubmitText}
        onSubmitPhoto={handleCreateWithPhoto}
        loading={loading}
      />

      <div className={styles.hint}>
        <InfoIcon />
        Заповніть назву, натисніть «Створити інвентар», потім оберіть фото і воно буде надіслано разом.
      </div>
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

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
