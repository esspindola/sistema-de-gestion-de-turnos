import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

const EMPTY = { name: '', specialty: '', email: '', phone: '' };
const inputClass = 'w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors';

export default function Professionals() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/professionals').then((r) => setList(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/professionals/${editing}`, form);
      } else {
        await api.post('/professionals', form);
      }
      setForm(EMPTY);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, specialty: p.specialty, email: p.email || '', phone: p.phone || '' });
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar profesional?')) return;
    try {
      await api.delete(`/professionals/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-600">Profesionales</h2>
      <form onSubmit={submit} className="bg-white border border-violet-100 rounded-2xl p-5 shadow-sm space-y-3 max-w-lg">
        <h3 className="text-sm font-medium text-slate-500">{editing ? 'Editar' : 'Nuevo'} profesional</h3>
        {error && <p className="text-rose-500 text-xs bg-rose-50 border border-rose-100 rounded-lg p-2">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[['name', 'Nombre'], ['specialty', 'Especialidad'], ['email', 'Email'], ['phone', 'Teléfono']].map(([k, label]) => (
            <div key={k}>
              <label className="block text-xs text-slate-400 mb-1">{label}</label>
              <input value={form[k]} onChange={set(k)} required={k === 'name' || k === 'specialty'} className={inputClass} />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-violet-300 hover:bg-violet-400 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            {editing ? 'Guardar' : 'Agregar'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="text-sm text-slate-400 hover:text-slate-600 px-3 py-1.5 transition-colors">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-slate-400 text-sm">Cargando...</p>}
      <div className="grid gap-2 max-w-lg">
        {list.map((p) => (
          <div key={p._id} className="bg-white border border-violet-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="font-medium text-slate-600 text-sm">{p.name}</span>
              <span className="text-slate-400 text-xs ml-2">{p.specialty}</span>
              {p.email && <span className="text-slate-300 text-xs ml-2 hidden sm:inline">{p.email}</span>}
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => startEdit(p)} className="text-xs text-violet-400 hover:text-violet-600 transition-colors">Editar</button>
              <button onClick={() => remove(p._id)} className="text-xs text-slate-400 hover:text-rose-400 transition-colors">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
