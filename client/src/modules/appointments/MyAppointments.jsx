import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

const STATUS_COLOR = {
  pendiente: 'text-amber-500 bg-amber-50 border-amber-200',
  confirmado: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  cancelado: 'text-slate-400 bg-slate-50 border-slate-200',
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/appointments/me')
      .then((res) => setAppointments(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-slate-400 text-sm">Cargando...</p>;
  if (error) return <p className="text-rose-400 text-sm">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-600">Mis Turnos</h2>
      {appointments.length === 0 && <p className="text-slate-400 text-sm">No tenés turnos.</p>}
      <div className="grid gap-2">
        {appointments.map((a) => (
          <div key={a._id} className="bg-white border border-violet-100 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium text-slate-600 text-sm">
                {a.professional?.name || 'Profesional'}{' '}
                <span className="text-slate-400 text-xs font-normal">— {a.professional?.specialty}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{a.date?.slice(0, 10)} a las {a.time}</p>
              {a.notes && <p className="text-xs text-slate-400 mt-0.5">{a.notes}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs border rounded-full px-2.5 py-0.5 ${STATUS_COLOR[a.status] || ''}`}>
                {a.status}
              </span>
              {a.status !== 'cancelado' && (
                <button
                  onClick={() => cancel(a._id)}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
