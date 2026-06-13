import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterPage({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'paciente' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-violet-400 tracking-tight">Rampage</h1>
          <p className="text-violet-300 text-xs uppercase tracking-widest mt-1">Medicus</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-8 border border-violet-100 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-600">Crear cuenta</h2>
          {error && <p className="text-rose-500 text-xs bg-rose-50 border border-rose-100 rounded-lg p-3">{error}</p>}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nombre</label>
            <input value={form.name} onChange={set('name')} className="w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors" required />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={set('email')} className="w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors" required />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Contraseña</label>
            <input type="password" value={form.password} onChange={set('password')} className="w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors" required />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Rol</label>
            <select value={form.role} onChange={set('role')} className="w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors">
              <option value="paciente">Paciente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-violet-300 hover:bg-violet-400 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          <p className="text-center text-xs text-slate-400">
            ¿Ya tenés cuenta?{' '}
            <button type="button" onClick={onSwitch} className="text-violet-500 hover:text-violet-600">Iniciá sesión</button>
          </p>
        </form>
      </div>
    </div>
  );
}
