import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

const inputClass = 'w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors';

export default function NewAppointment({ onCreated }) {
  const [professionals, setProfessionals] = useState([]);
  const [form, setForm] = useState({ professionalId: '', date: '', time: '', notes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/professionals').then((res) => setProfessionals(res.data)).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await api.post('/appointments', form);
      setSuccess(true);
      setForm({ professionalId: '', date: '', time: '', notes: '' });
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-slate-600">Nuevo Turno</h2>
      <form onSubmit={submit} className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm space-y-4">
        {error && <p className="text-rose-500 text-xs bg-rose-50 border border-rose-100 rounded-lg p-3">{error}</p>}
        {success && <p className="text-emerald-500 text-xs bg-emerald-50 border border-emerald-100 rounded-lg p-3">Turno creado exitosamente.</p>}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Profesional</label>
          <select value={form.professionalId} onChange={set('professionalId')} required className={inputClass}>
            <option value="">Seleccioná un profesional</option>
            {professionals.map((p) => (
              <option key={p._id} value={p._id}>{p.name} — {p.specialty}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Fecha</label>
          <input type="date" value={form.date} onChange={set('date')} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Hora</label>
          <input type="time" value={form.time} onChange={set('time')} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Notas (opcional)</label>
          <textarea value={form.notes} onChange={set('notes')} rows={2} className={`${inputClass} resize-none`} />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-violet-300 hover:bg-violet-400 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors">
          {loading ? 'Creando...' : 'Crear Turno'}
        </button>
      </form>
    </div>
  );
}
