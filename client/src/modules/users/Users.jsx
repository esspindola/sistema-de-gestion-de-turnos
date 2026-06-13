import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

const ROLE_COLOR = {
  admin: 'text-violet-500 bg-violet-50 border-violet-200',
  paciente: 'text-sky-500 bg-sky-50 border-sky-200',
};

export default function Users() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/users').then((r) => setList(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-600">Usuarios</h2>
      {loading && <p className="text-slate-400 text-sm">Cargando...</p>}
      <div className="grid gap-2 max-w-lg">
        {list.map((u) => (
          <div key={u._id} className="bg-white border border-violet-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="font-medium text-slate-600 text-sm">{u.name}</span>
              <span className="text-slate-400 text-xs ml-2 hidden sm:inline">{u.email}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs border rounded-full px-2.5 py-0.5 ${ROLE_COLOR[u.role] || ''}`}>{u.role}</span>
              <button onClick={() => remove(u._id)} className="text-xs text-slate-400 hover:text-rose-400 transition-colors">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
