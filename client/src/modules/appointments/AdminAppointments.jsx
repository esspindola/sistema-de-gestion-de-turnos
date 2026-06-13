import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

const STATUS_COLOR = {
  pendiente: 'text-amber-500 bg-amber-50 border-amber-200',
  confirmado: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  cancelado: 'text-slate-400 bg-slate-50 border-slate-200',
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    const q = filter ? `?status=${filter}` : '';
    api.get(`/appointments${q}`)
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar este turno?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-slate-600">Turnos</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white border border-violet-100 rounded-lg px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:border-violet-300 transition-colors">
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      {loading && <p className="text-slate-400 text-sm">Cargando...</p>}
      <div className="grid gap-2">
        {appointments.map((a) => (
          <div key={a._id} className="bg-white border border-violet-100 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium text-slate-600 text-sm">
                {a.patient?.name || 'Paciente'}
                <span className="text-slate-400 text-xs font-normal ml-2">→ {a.professional?.name}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{a.date?.slice(0, 10)} a las {a.time}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs border rounded-full px-2.5 py-0.5 ${STATUS_COLOR[a.status] || ''}`}>{a.status}</span>
              <select
                value={a.status}
                onChange={(e) => changeStatus(a._id, e.target.value)}
                className="bg-violet-50 border border-violet-100 rounded-lg px-2 py-1 text-xs text-slate-600 focus:outline-none"
              >
                <option value="pendiente">pendiente</option>
                <option value="confirmado">confirmado</option>
                <option value="cancelado">cancelado</option>
              </select>
              <button onClick={() => remove(a._id)} className="text-xs text-slate-400 hover:text-rose-400 transition-colors">Eliminar</button>
            </div>
          </div>
        ))}
        {!loading && appointments.length === 0 && <p className="text-slate-400 text-sm">No hay turnos.</p>}
      </div>
    </div>
  );
}
