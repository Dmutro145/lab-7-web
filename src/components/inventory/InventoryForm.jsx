import React, { useState, useRef } from 'react'
import styles from './InventoryForm.module.css'

export default function InventoryForm({
  initialValues = {},
  onSubmitText,
  onSubmitPhoto,
  isEdit = false,
  loading = false,
}) {
  const [name, setName] = useState(initialValues.inventory_name || '')
  const [desc, setDesc] = useState(initialValues.description || '')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  function validate() {
    const e = {}
    if (!name.trim()) e.name = "Назва обов'язкова"
    return e
  }

  async function handleTextSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    await onSubmitText({ inventory_name: name.trim(), description: desc.trim() })
  }

  async function handlePhotoSubmit(e) {
    e.preventDefault()
    if (!photo) { setErrors({ photo: 'Оберіть фото' }); return }
    setErrors({})
    const fd = new FormData()
    fd.append('photo', photo)
    await onSubmitPhoto(fd)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.container}>
      {/* Text fields form */}
      <form onSubmit={handleTextSubmit} className={styles.form} noValidate>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            {isEdit ? 'Текстові дані' : 'Основна інформація'}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="inv-name">
              Назва <span className={styles.required}>*</span>
            </label>
            <input
              id="inv-name"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Введіть назву інвентарю..."
              autoComplete="off"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="inv-desc">Опис</label>
            <textarea
              id="inv-desc"
              className={styles.textarea}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Необов'язковий опис..."
              rows={4}
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? <Spinner /> : null}
            {isEdit ? 'Зберегти зміни' : 'Створити інвентар'}
          </button>
        </div>
      </form>

      {/* Photo form (shown always; on create it's part of same submission, on edit separate) */}
      <form onSubmit={isEdit ? handlePhotoSubmit : handleTextSubmit} className={styles.form} noValidate>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            {isEdit ? 'Оновлення фото' : 'Фотографія'}
          </div>

          <div
            className={styles.dropzone}
            onClick={() => fileRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              const f = e.dataTransfer.files[0]
              if (f) { setPhoto(f); const r = new FileReader(); r.onload = ev => setPreview(ev.target.result); r.readAsDataURL(f) }
            }}
          >
            {preview
              ? <img src={preview} alt="preview" className={styles.preview} />
              : (
                <div className={styles.dropzoneInner}>
                  <UploadIcon />
                  <span>Перетягніть або клікніть щоб обрати</span>
                  <span className={styles.hint}>PNG, JPG, WEBP до 10MB</span>
                </div>
              )
            }
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {errors.photo && <span className={styles.error}>{errors.photo}</span>}

          {isEdit && (
            <button type="submit" className={`${styles.btnPrimary} ${styles.btnSecondary}`} disabled={loading}>
              {loading ? <Spinner /> : null}
              Оновити фото
            </button>
          )}

          {!isEdit && photo && (
            <p className={styles.selectedFile}>📎 {photo.name}</p>
          )}
        </div>
      </form>
    </div>
  )
}

function Spinner() {
  return (
    <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  )
}
