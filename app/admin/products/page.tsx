'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, Upload, Loader2, Trash2, Package, ArrowLeft } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string | null
  category: string
  description: string | null
  weight: string | null
  selling_price: number | null
  cost_price: number | null
  price: number
  stock_quantity: number
  reorder_level: number
  supplier_name: string | null
  scent: string | null
  burn_time: string | null
  is_active: boolean
  is_featured: boolean
  image: string | null
  image_url: string | null
  notes: string | null
}

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  sku: '',
  category: 'Jar',
  description: '',
  weight: '',
  selling_price: null,
  cost_price: null,
  price: 0,
  stock_quantity: 0,
  reorder_level: 5,
  supplier_name: '',
  scent: '',
  burn_time: '',
  is_active: true,
  is_featured: false,
  image: null,
  image_url: null,
  notes: '',
}

function productToForm(p: Product): Omit<Product, 'id'> {
  return {
    name: p.name,
    sku: p.sku || '',
    category: p.category || 'Jar',
    description: p.description || '',
    weight: p.weight || '',
    selling_price: p.selling_price,
    cost_price: p.cost_price,
    price: p.price,
    stock_quantity: p.stock_quantity,
    reorder_level: p.reorder_level,
    supplier_name: p.supplier_name || '',
    scent: p.scent || '',
    burn_time: p.burn_time || '',
    is_active: p.is_active,
    is_featured: p.is_featured,
    image: p.image,
    image_url: p.image_url,
    notes: p.notes || '',
  }
}

// Derive a human-readable stock status from form values
function getStockStatus(form: Omit<Product, 'id'>): string {
  if (!form.is_active) return 'coming_soon'
  if (form.stock_quantity === 0) return 'sold_out'
  if (form.stock_quantity <= (form.reorder_level || 5)) return 'low_stock'
  return 'in_stock'
}

const STATUS_LABELS: Record<string, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  sold_out: 'Sold Out',
  coming_soon: 'Coming Soon',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Product | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (res.ok) {
        const list: Product[] = data.products || []
        setProducts(list)
        return list
      } else {
        toast.error('Failed to load products')
        return []
      }
    } catch {
      toast.error('Network error loading products')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function selectProduct(p: Product) {
    setSelected(p)
    setIsNew(false)
    setForm(productToForm(p))
    setImageFile(null)
    setImagePreview(null)
    setShowDeleteConfirm(false)
    setShowEditPanel(true)
  }

  function startNew() {
    setSelected(null)
    setIsNew(true)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setShowDeleteConfirm(false)
    setShowEditPanel(true)
  }

  function handleBackToList() {
    setShowEditPanel(false)
  }

  function handleImageSelect(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only jpg, png, and webp files are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // Change stock status from dropdown
  function handleStatusChange(status: string) {
    setForm(f => {
      const updates: Partial<Omit<Product, 'id'>> = {}
      if (status === 'in_stock') {
        updates.is_active = true
        if (f.stock_quantity === 0) updates.stock_quantity = 10
      } else if (status === 'low_stock') {
        updates.is_active = true
        // Put them just at the reorder threshold
        if (f.stock_quantity === 0) updates.stock_quantity = Math.max(1, f.reorder_level || 5)
      } else if (status === 'sold_out') {
        updates.is_active = true
        updates.stock_quantity = 0
      } else if (status === 'coming_soon') {
        updates.is_active = false
      }
      return { ...f, ...updates }
    })
  }

  async function uploadImage(productId: string): Promise<string | null> {
    if (!imageFile) return null
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', imageFile)
      fd.append('sku', form.sku || productId)

      const currentImage = selected?.image || selected?.image_url
      if (currentImage) {
        const match = currentImage.match(/product-images\/(.+)$/)
        if (match) fd.append('oldPath', match[1])
      }

      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      return data.url
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Sanitise form values before sending to DB:
  // - empty strings → null for optional text fields (avoids NOT NULL conflicts)
  // - empty sku → null (avoids unique-index conflicts)
  function buildPayload(f: Omit<Product, 'id'>): Record<string, unknown> {
    const { image_url: _omit, ...rest } = f
    return {
      ...rest,
      sku: f.sku?.trim() || null,
      description: f.description?.trim() || null,
      weight: f.weight?.trim() || null,
      burn_time: f.burn_time?.trim() || null,
      scent: f.scent?.trim() || null,
      supplier_name: f.supplier_name?.trim() || null,
      notes: f.notes?.trim() || null,
      selling_price: f.selling_price,
      price: f.selling_price ?? f.price,
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('Product name is required')
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload(form)

      if (isNew) {
        // 1. Create the product record
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Create failed')

        let createdProduct: Product = data.product

        // 2. Upload image if selected, then patch the new product
        if (imageFile) {
          const imageUrl = await uploadImage(createdProduct.id)
          if (imageUrl) {
            const patchRes = await fetch(`/api/admin/products/${createdProduct.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: imageUrl }),
            })
            const patchData = await patchRes.json()
            createdProduct = {
              ...createdProduct,
              ...(patchRes.ok && patchData.product ? patchData.product : {}),
              image: imageUrl,
              image_url: imageUrl,
            }
          }
        }

        toast.success('Product created')
        // Add new product to the top of the list and switch to edit mode
        setProducts(prev => [createdProduct, ...prev])
        setIsNew(false)
        setImageFile(null)
        setImagePreview(null)
        setSelected(createdProduct)
        setForm(productToForm(createdProduct))
        // On mobile: go back to list so user can see the new product
        setShowEditPanel(false)
      } else if (selected) {
        // 1. Upload image first if a new file was chosen
        let newImageUrl: string | null = null
        if (imageFile) {
          newImageUrl = await uploadImage(selected.id)
          if (newImageUrl) {
            (payload as any).image = newImageUrl
          }
        }

        // 2. Save all form changes to the DB
        const res = await fetch(`/api/admin/products/${selected.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Update failed')

        // 3. Build the definitive updated product
        const serverProduct: Product = data.product
        const updatedProduct: Product = {
          ...serverProduct,
          name: form.name,
          sku: form.sku,
          category: form.category,
          description: form.description,
          weight: form.weight,
          selling_price: form.selling_price,
          cost_price: form.cost_price,
          price: form.selling_price ?? form.price,
          stock_quantity: form.stock_quantity,
          reorder_level: form.reorder_level,
          supplier_name: form.supplier_name,
          scent: form.scent,
          burn_time: form.burn_time,
          is_active: form.is_active,
          is_featured: form.is_featured,
          notes: form.notes,
          image: newImageUrl ?? serverProduct.image ?? form.image,
          image_url: newImageUrl ?? form.image_url,
        }

        // 4. Update all three pieces of UI state at once
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
        setSelected(updatedProduct)
        setForm(productToForm(updatedProduct))
        setIsNew(false)
        setImageFile(null)
        setImagePreview(null)
        toast.success('Changes saved')
      }
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${selected.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')

      // Remove the product from the list entirely
      setProducts(prev => prev.filter(p => p.id !== selected.id))
      toast.success('Product deleted')
      setSelected(null)
      setIsNew(false)
      setForm(EMPTY_FORM)
      setShowDeleteConfirm(false)
      setShowEditPanel(false)
    } catch (err: any) {
      toast.error(err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const profit = (form.selling_price ?? 0) - (form.cost_price ?? 0)
  const currentImage = imagePreview || form.image_url || form.image
  const stockStatus = getStockStatus(form)

  return (
    <div className="flex h-full min-h-screen">
      {/* Left panel — product list */}
      <div className={`w-full md:w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col ${showEditPanel ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-800">Products</h1>
          <button
            onClick={startNew}
            className="flex items-center gap-1 text-xs bg-gray-900 text-white px-2.5 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 flex justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <p className="p-4 text-xs text-gray-400">No products yet.</p>
          ) : (
            products.map(p => (
              <button
                key={p.id}
                onClick={() => selectProduct(p)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  selected?.id === p.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                {(p.image_url || p.image) ? (
                  <img
                    src={p.image_url || p.image || ''}
                    alt={p.name}
                    className="w-10 h-10 rounded object-cover shrink-0 bg-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 shrink-0 flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-300" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${p.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {p.sku && <span className="mr-1">{p.sku}</span>}
                    {!p.is_active && <span className="text-orange-400">inactive</span>}
                    {p.is_featured && <span className="text-purple-400 ml-1">featured</span>}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${(p.selling_price ?? p.price ?? 0).toFixed(2)} · {p.stock_quantity} in stock
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel — edit form */}
      <div className={`flex-1 min-w-0 overflow-y-auto ${showEditPanel ? 'flex flex-col' : 'hidden md:flex md:flex-col'}`}>
        {!selected && !isNew ? (
          <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
            <div className="text-center px-4">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a product or create a new one</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="md:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <h2 className="text-base font-semibold text-gray-900">
                  {isNew ? 'New Product' : 'Edit Product'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {form.is_active ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Inactive</span>
                )}
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <section>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Product Image</label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault()
                  setDragOver(false)
                  const file = e.dataTransfer.files[0]
                  if (file) handleImageSelect(file)
                }}
              >
                {currentImage ? (
                  <div className="flex items-center gap-4">
                    <img src={currentImage} alt="Product" className="w-20 h-20 rounded object-cover bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-2 truncate">
                        {imageFile ? imageFile.name : 'Current image'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs bg-white border border-gray-300 rounded px-2.5 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                          Replace
                        </button>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(null) }}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-center cursor-pointer py-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · max 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f) }}
                />
              </div>
            </section>

            {/* BASIC INFO */}
            <section className="space-y-3">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Basic Info</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. Lavender Dream Candle"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">SKU</label>
                  <input
                    type="text"
                    value={form.sku || ''}
                    onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. SC01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                  >
                    <option>Jar</option>
                    <option>Wax Melt</option>
                    <option>Tray</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Description</label>
                  <textarea
                    value={form.description || ''}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                    rows={3}
                    placeholder="Product description…"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Weight</label>
                  <input
                    type="text"
                    value={form.weight || ''}
                    onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. 8 oz"
                  />
                </div>
              </div>
            </section>

            {/* PRICING */}
            <section className="space-y-3">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Pricing</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.selling_price ?? ''}
                    onChange={e => setForm(f => ({ ...f, selling_price: e.target.value ? parseFloat(e.target.value) : null }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Cost Price ($) <span className="text-gray-400">private</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.cost_price ?? ''}
                    onChange={e => setForm(f => ({ ...f, cost_price: e.target.value ? parseFloat(e.target.value) : null }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Profit (auto)</label>
                  <div className={`border rounded-lg px-3 py-2 text-sm bg-gray-50 font-medium ${profit >= 0 ? 'text-green-700 border-green-200' : 'text-red-600 border-red-200'}`}>
                    ${profit.toFixed(2)}
                  </div>
                </div>
              </div>
            </section>

            {/* INVENTORY */}
            <section className="space-y-3">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Inventory</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Stock Status dropdown */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Stock Status</label>
                  <select
                    value={stockStatus}
                    onChange={e => handleStatusChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {stockStatus === 'sold_out' && 'Sets quantity to 0'}
                    {stockStatus === 'in_stock' && 'Sets active & quantity ≥ 1'}
                    {stockStatus === 'low_stock' && 'Active, quantity ≤ reorder level'}
                    {stockStatus === 'coming_soon' && 'Hidden from shop (inactive)'}
                  </p>
                </div>
                {/* Raw quantity */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={e => setForm(f => ({ ...f, stock_quantity: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reorder_level}
                    onChange={e => setForm(f => ({ ...f, reorder_level: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Supplier</label>
                  <input
                    type="text"
                    value={form.supplier_name || ''}
                    onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Supplier name"
                  />
                </div>
              </div>
            </section>

            {/* SCENT INFO */}
            <section className="space-y-3">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Scent Info</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Scent Notes</label>
                  <input
                    type="text"
                    value={form.scent || ''}
                    onChange={e => setForm(f => ({ ...f, scent: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. Top: Citrus, Heart: Lavender, Base: Vanilla"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Burn Time</label>
                  <input
                    type="text"
                    value={form.burn_time || ''}
                    onChange={e => setForm(f => ({ ...f, burn_time: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="e.g. 45-55 hours"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Notes (internal)</label>
                  <input
                    type="text"
                    value={form.notes || ''}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Internal notes"
                  />
                </div>
              </div>
            </section>

            {/* VISIBILITY */}
            <section className="space-y-3">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Visibility</label>
              <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
                {/* Active toggle */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Active (visible on site)</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {form.is_active ? 'Visible in shop and search' : 'Hidden from all public pages'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${form.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                {/* Featured toggle */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Featured on Homepage</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {form.is_featured ? 'Shown in the homepage collection' : 'Not shown on the homepage'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                    className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${form.is_featured ? 'bg-purple-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Must be <strong>Active</strong> to appear on the site. Toggle <strong>Featured</strong> to show/hide from the homepage collection.
              </p>
            </section>

            {/* ACTIONS */}
            <section className="flex flex-col gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={handleSave}
                disabled={saving || uploadingImage}
                className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(saving || uploadingImage) && <Loader2 className="w-4 h-4 animate-spin" />}
                {isNew ? 'Create Product' : 'Save Changes'}
              </button>

              {selected && !isNew && (
                <>
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full border border-red-200 text-red-600 rounded-lg py-2.5 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Product
                    </button>
                  ) : (
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50 space-y-3">
                      <p className="text-sm text-red-800 font-medium">Permanently delete &ldquo;{selected.name}&rdquo;?</p>
                      <p className="text-xs text-red-600">This cannot be undone. The product will be removed from your store.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
