import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { InventoryProvider } from './store/InventoryContext'
import Layout from './components/Layout'
import AdminInventory from './pages/AdminInventory'
import AdminInventoryCreate from './pages/AdminInventoryCreate'
import AdminInventoryEdit from './pages/AdminInventoryEdit'
import AdminInventoryDetails from './pages/AdminInventoryDetails'

export default function App() {
  return (
    <BrowserRouter>
      <InventoryProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/inventory" replace />} />
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Navigate to="/admin/inventory" replace />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="inventory/create" element={<AdminInventoryCreate />} />
            <Route path="inventory/:id" element={<AdminInventoryDetails />} />
            <Route path="inventory/:id/edit" element={<AdminInventoryEdit />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/inventory" replace />} />
        </Routes>
      </InventoryProvider>
    </BrowserRouter>
  )
}
