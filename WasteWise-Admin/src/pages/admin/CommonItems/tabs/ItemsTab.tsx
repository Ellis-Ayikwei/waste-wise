import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import FilterSelect from '../../../../components/ui/FilterSelect';
import DraggableDataTable, { ColumnDefinition } from '../../../../components/ui/DraggableDataTable';
import CrudModal from '../../../../components/ui/CrudModal';
import {
  fetchCommonItems,
  createCommonItem,
  updateCommonItem,
  deleteCommonItem,
  fetchItemCategories,
  fetchItemTypes,
  fetchItemBrands,
  fetchItemModels,
} from '../../../../services/commonItemService';

interface Category { id: string; name: string; }
interface Type     { id: string; name: string; }
interface Brand    { id: string; name: string; }
interface Model    { id: string; name: string; }
interface CommonItem {
  id: string;
  name: string;
  category: Category;
  type: Type;
  brand: Brand;
  model: Model;
  description?: string;
  weight?: number;
  dimensions?: any;
  fragile?: boolean;
  needs_disassembly?: boolean;
  icon?: string;
  color?: string;
  tab_color?: string;
  image?: string;
}

const ItemsTab: React.FC = () => {
  const [items, setItems]     = useState<CommonItem[]>([]);
  const [cats, setCats]       = useState<Category[]>([]);
  const [types, setTypes]     = useState<Type[]>([]);
  const [brands, setBrands]   = useState<Brand[]>([]);
  const [models, setModels]   = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string|''>('');
  const [typeFilter, setTypeFilter] = useState<string|''>('');
  const [brandFilter, setBrandFilter] = useState<string|''>('');
  const [modelFilter, setModelFilter] = useState<string|''>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Partial<CommonItem> | null>(null);
  const [form, setForm] = useState<{
    name: string;
    category_id: string | '';
    type_id: string | '';
    brand_id: string | '';
    model_id: string | '';
    description: string;
    weight: string | '';
    dimensions: string;
    fragile: boolean;
    needs_disassembly: boolean;
    icon: string;
    color: string;
    tab_color: string;
    image: string;
  }>({
    name: '',
    category_id: '',
    type_id: '',
    brand_id: '',
    model_id: '',
    description: '',
    weight: '',
    dimensions: '',
    fragile: false,
    needs_disassembly: false,
    icon: '',
    color: '',
    tab_color: '',
    image: '',
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [iRes, cRes, tRes] = await Promise.all([
        fetchCommonItems(),
        fetchItemCategories(),
        fetchItemTypes(),
      ]);
      setItems(iRes.data.results || iRes.data);
      setCats(cRes.data.results || cRes.data);
      setTypes(tRes.data.results || tRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTypes(catId?: string) {
    try {
      const res = await fetchItemTypes(catId || '');
      setTypes(res.data.results || res.data);
    } catch (error) {
      console.error('Failed to load types:', error);
    }
  }

  async function loadBrands(catId?: string) {
    try {
      const res = await fetchItemBrands(catId || '');
      setBrands(res.data.results || res.data);
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
  }

  async function loadModels(brId?: string) {
    try {
      const res = await fetchItemModels(brId || '');
      setModels(res.data.results || res.data);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  }

  function openForm(item?: CommonItem) {
    setEditing(item || null);
    setForm({
      name: item?.name || '',
      category_id: item?.category?.id || '',
      type_id: item?.type?.id || '',
      brand_id: item?.brand?.id || '',
      model_id: item?.model?.id || '',
      description: item?.description || '',
      weight: item?.weight ? String(item.weight) : '',
      dimensions: item?.dimensions ? JSON.stringify(item.dimensions) : '',
      fragile: item?.fragile || false,
      needs_disassembly: item?.needs_disassembly || false,
      icon: item?.icon || '',
      color: item?.color || '',
      tab_color: item?.tab_color || '',
      image: item?.image || '',
    });
    if (item?.category?.id) {
      loadTypes(item.category.id);
      loadBrands(item.category.id);
    }
    if (item?.brand?.id)    loadModels(item.brand.id);
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      const payload = form;
      if (editing?.id) await updateCommonItem(editing.id, payload);
      else             await createCommonItem(payload);
      await loadAll();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteCommonItem(id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  const filtered = items.filter(i =>
    (!categoryFilter || i.category?.id === categoryFilter) &&
    (!typeFilter     || i.type?.id     === typeFilter) &&
    (!brandFilter    || i.brand?.id    === brandFilter) &&
    (!modelFilter    || i.model?.id    === modelFilter)
  );

  console.log("the filtered", filtered)
  console.log("the items", items)

  const columns: ColumnDefinition[] = [
    { 
      accessor: 'name', 
      title: 'Name',
      sortable: true,
      width: '15%'
    },
    { 
      accessor: 'category.name', 
      title: 'Category',
      sortable: true,
      width: '13%',
      render: (item: CommonItem) => item.category?.name || '-'
    },
    { 
      accessor: 'type.name', 
      title: 'Type',
      sortable: true,
      width: '13%',
      render: (item: CommonItem) => item.type?.name || '-'
    },
    { 
      accessor: 'brand.name', 
      title: 'Brand',
      sortable: true,
      width: '13%',
      render: (item: CommonItem) => item.brand?.name || '-'
    },
    { 
      accessor: 'model.name', 
      title: 'Model',
      sortable: true,
      width: '13%',
      render: (item: CommonItem) => item.model?.name || '-'
    },
    { 
      accessor: 'weight', 
      title: 'Weight (kg)',
      sortable: true,
      width: '10%',
      render: (item: CommonItem) => item.weight ? `${item.weight} kg` : '-'
    },
    { 
      accessor: 'dimensions', 
      title: 'Dimensions',
      width: '10%',
      render: (item: CommonItem) => {
        if (!item.dimensions) return '-';
        try {
          const dims = typeof item.dimensions === 'string' ? JSON.parse(item.dimensions) : item.dimensions;
          return `${dims.length || 0} × ${dims.width || 0} × ${dims.height || 0} cm`;
        } catch {
          return '-';
        }
      }
    },
    { 
      accessor: 'fragile', 
      title: 'Fragile',
      width: '8%',
      textAlign: 'center',
      render: (item: CommonItem) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          item.fragile 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {item.fragile ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      accessor: 'needs_disassembly', 
      title: 'Disassembly',
      width: '10%',
      textAlign: 'center',
      render: (item: CommonItem) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          item.needs_disassembly 
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {item.needs_disassembly ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      accessor: 'image', 
      title: 'Image',
      width: '8%',
      textAlign: 'center',
      render: (item: CommonItem) => item.image ? (
        <img src={item.image} className="w-8 h-8 rounded object-cover" alt={item.name} />
      ) : (
        <span className="text-gray-400 dark:text-gray-500">-</span>
      )
    },
    {
      accessor: 'actions',
      title: 'Actions',
      width: '12%',
      textAlign: 'center',
      render: (item: CommonItem) => (
        <div className="flex gap-2 justify-center">
          <button 
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50" 
            onClick={() => openForm(item)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" 
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }
  ];

  return (
    <>
      <DraggableDataTable
        data={filtered}
        columns={columns}
        loading={loading}
        title="Common Items"
        exportFileName="common-items"
        storeKey="items-table"
        onRefreshData={loadAll}
        actionButtons={
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => openForm()}
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        }
        extraFilters={
          <div className="flex gap-2">
            <FilterSelect
              options={cats.map(c => ({ value: c.id, label: c.name }))}
              value={categoryFilter}
              placeholder="All Categories"
              onChange={val => {
                setCategoryFilter(val ? String(val) : '');
                setTypeFilter('');
                setBrandFilter('');
                setModelFilter('');
                loadTypes(val ? String(val) : '');
                loadBrands(val ? String(val) : '');
              }}
            />
            <FilterSelect
              options={types.map(t => ({ value: t.id, label: t.name }))}
              value={typeFilter}
              placeholder="All Types"
              onChange={val => {
                setTypeFilter(val ? String(val) : '');
                setBrandFilter('');
                setModelFilter('');
                // Optionally, you could filter brands by type if needed
              }}
            />
            <FilterSelect
              options={brands.map(b => ({ value: b.id, label: b.name }))}
              value={brandFilter}
              placeholder="All Brands"
              onChange={val => {
                setBrandFilter(val ? String(val) : '');
                setModelFilter('');
                loadModels(val ? String(val) : '');
              }}
            />
            <FilterSelect
              options={models.map(m => ({ value: m.id, label: m.name }))}
              value={modelFilter}
              placeholder="All Models"
              onChange={val => setModelFilter(val ? String(val) : '')}
            />
          </div>
        }
        quickCheckFields={['id', 'name', 'category.name', 'type.name', 'brand.name', 'model.name']}
      />

      <CrudModal
        title={editing ? 'Edit Item' : 'Add Item'}
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        size="xl"
      >
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter item name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <FilterSelect
                  options={cats.map(c => ({ value: c.id, label: c.name }))}
                  value={form.category_id}
                  placeholder="Select category"
                  onChange={val => {
                    setForm({ ...form, category_id: val ? String(val) : '', type_id: '', brand_id: '', model_id: '' });
                    loadTypes(val ? String(val) : '');
                    loadBrands(val ? String(val) : '');
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <FilterSelect
                  options={types.map(t => ({ value: t.id, label: t.name }))}
                  value={form.type_id}
                  placeholder="Select type"
                  onChange={val => setForm({ ...form, type_id: val ? String(val) : '' })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Brand & Model</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                <FilterSelect
                  options={brands.map(b => ({ value: b.id, label: b.name }))}
                  value={form.brand_id}
                  placeholder="Select brand"
                  onChange={val => {
                    setForm({ ...form, brand_id: val ? String(val) : '', model_id: '' });
                    loadModels(val ? String(val) : '');
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <FilterSelect
                  options={models.map(m => ({ value: m.id, label: m.name }))}
                  value={form.model_id}
                  placeholder="Select model"
                  onChange={val => setForm({ ...form, model_id: val ? String(val) : '' })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter item description"
            />
          </div>

          {/* Physical Properties Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Properties</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.weight}
                  onChange={e => setForm({ ...form, weight: e.target.value === '' ? '' : String(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (JSON)</label>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={e => setForm({ ...form, dimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder='{"length": 10, "width": 5, "height": 3}'
                />
              </div>
            </div>
          </div>

          {/* Special Properties Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Special Properties</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fragile"
                  checked={form.fragile}
                  onChange={e => setForm({ ...form, fragile: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="fragile" className="ml-2 text-sm font-medium text-gray-700">
                  Fragile Item
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="needs_disassembly"
                  checked={form.needs_disassembly}
                  onChange={e => setForm({ ...form, needs_disassembly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="needs_disassembly" className="ml-2 text-sm font-medium text-gray-700">
                  Needs Disassembly
                </label>
              </div>
            </div>
          </div>

          {/* Visual Properties Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Properties</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (FontAwesome)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="box, cube, package"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tab Color</label>
                <input
                  type="text"
                  value={form.tab_color}
                  onChange={e => setForm({ ...form, tab_color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#1E40AF"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </CrudModal>
    </>
  );
};

export default ItemsTab; 