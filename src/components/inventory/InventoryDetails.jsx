import React from 'react'
import { inventoryApi } from '../../services/inventoryApi'
import styles from './InventoryDetails.module.css'

export default function InventoryDetails({ item }) {
  const id = item.id ?? item._id
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={inventoryApi.photoUrl(id)}
          alt={item.inventory_name}
          className={styles.image}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div className={styles.noPhoto}>Немає фото</div>
      </div>
      <div className={styles.body}>
        <div className={styles.idLabel}>ID: {id}</div>
        <h2 className={styles.title}>{item.inventory_name}</h2>
        <p className={styles.desc}>{item.description || <span className={styles.empty}>Опис відсутній</span>}</p>
      </div>
    </div>
  )
}
