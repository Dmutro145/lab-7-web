import React, { createContext, useContext, useState, useCallback } from 'react'
import { inventoryApi } from '../services/inventoryApi'

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await inventoryApi.getAll()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Помилка завантаження')
    } finally {
      setLoading(false)
    }
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => (item.id ?? item._id) !== id))
  }, [])

  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item])
  }, [])

  const updateItem = useCallback((id, updated) => {
    setItems(prev =>
      prev.map(item => (item.id ?? item._id) === id ? { ...item, ...updated } : item)
    )
  }, [])

  return (
    <InventoryContext.Provider value={{ items, loading, error, fetchAll, removeItem, addItem, updateItem }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}