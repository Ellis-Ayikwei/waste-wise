import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import FilterSelect from '../../../../components/ui/FilterSelect';
import DraggableDataTable, { ColumnDefinition } from '../../../../components/ui/DraggableDataTable';
import CrudModal from '../../../../components/ui/CrudModal';
import {
  fetchItemBrands,
  fetchItemModels,
  createModel,
  updateModel,
  deleteModel,
} from '../../../../services/commonItemService';

interface Brand { id: number; name: string; }
interface Model { id: number; name: string; brand: Brand; }

const ModelsTab: React.FC = () => {
  const [brands, setBrands]   = useState<Brand[]>([]);
  const [models, setModels]   = useState<Model[]>([]);
  const [filter, setFilter]   = useState<number|''>('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Model|null>(null);
  const [name, setName]           = useState('');
  const [brandId, setBrandId]     = useState<number|''>('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [bRes, mRes] = await Promise.all([
        fetchItemBrands(),
        fetchItemModels(),
      ]);
      setBrands(bRes.data.results || bRes.data);
      setModels(mRes.data.results || mRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function openForm(m?: Model) {
    setEditing(m || null);
    setName(m?.name || '');
    setBrandId(m?.brand.id || '');
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      const payload = { name, brand_id: brandId };
      if (editing) await updateModel(editing.id, payload);
      else         await createModel(payload);
      await load();
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save model:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this model?')) return;
    try {
      await deleteModel(id);
      setModels(models.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  }

  const filtered = models.filter(m => !filter || m.brand.id === filter);

  const columns: ColumnDefinition[] = [
    { 
      accessor: 'name', 
      title: 'Name',
      sortable: true,
      width: '40%'
    },
    { 
      accessor: 'brand.name', 
      title: 'Brand',
      sortable: true,
      width: '40%'
    },
    {
      accessor: 'actions',
      title: 'Actions',
      width: '20%',
      textAlign: 'center',
      render: (item: Model) => (
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
        title="Models"
        exportFileName="models"
        storeKey="models-table"
        onRefreshData={load}
        actionButtons={
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => openForm()}
          >
            <Plus className="w-4 h-4" /> Add Model
          </button>
        }
        extraFilters={
          <FilterSelect
            options={brands.map(b => ({ value: b.id, label: b.name }))}
            value={filter}
            placeholder="All Brands"
            onChange={val => setFilter(val as number|'' )}
          />
        }
        quickCheckFields={['id', 'name', 'brand.name']}
      />

      <CrudModal
        title={editing ? 'Edit Model' : 'Add Model'}
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      >
        <label className="block mb-2">Brand</label>
        <FilterSelect
          options={brands.map(b => ({ value: b.id, label: b.name }))}
          value={brandId}
          placeholder="Select brand"
          onChange={val => setBrandId(val as number|'' )}
        />
        <label className="block mb-2 mt-4">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border w-full p-2"
        />
      </CrudModal>
    </>
  );
};

export default ModelsTab; 