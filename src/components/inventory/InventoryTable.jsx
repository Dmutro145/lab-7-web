import React from 'react'
import { useNavigate } from 'react-router-dom'
import { inventoryApi } from '../../services/inventoryApi'
import styles from './InventoryTable.module.css'

export default function InventoryTable({ items, onDeleteRequest }) {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} style={{ width: 64 }}>Фото</th>
            <th className={styles.th}>Назва</th>
            <th className={styles.th}>Опис</th>
            <th className={styles.th} style={{ width: 160 }}>Дії</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const id = item.id ?? item._id
            return (
              <tr key={id} className={styles.row}>
                <td className={styles.td}>
                  <div className={styles.imgWrap}>
                    <img
                      src={inventoryApi.photoUrl(id)}
                      alt={item.inventory_name}
                      className={styles.img}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.name}>{item.inventory_name}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.desc}>
                    {item.description
                      ? item.description.length > 80
                        ? item.description.slice(0, 80) + '…'
                        : item.description
                      : <span className={styles.empty}>—</span>
                    }
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.btn} ${styles.btnView}`}
                      onClick={() => navigate(`/admin/inventory/${id}`)}
                      title="Переглянути"
                    >
                      <EyeIcon />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnEdit}`}
                      onClick={() => navigate(`/admin/inventory/${id}/edit`)}
                      title="Редагувати"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDelete}`}
                      onClick={() => onDeleteRequest(item)}
                      title="Видалити"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}
