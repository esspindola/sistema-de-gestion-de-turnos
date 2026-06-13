import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-violet-400 tracking-tight">Rampage</h1>
          <p className="text-violet-300 text-xs uppercase tracking-widest mt-1">Medicus</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-8 border border-violet-100 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-600">Iniciar sesión</h2>
          {error && <p className="text-rose-500 text-xs bg-rose-50 border border-rose-100 rounded-lg p-3">{error}</p>}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-violet-300 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-300 hover:bg-violet-400 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p className="text-center text-xs text-slate-400">
            ¿No tenés cuenta?{' '}
            <button type="button" onClick={onSwitch} className="text-violet-500 hover:text-violet-600">
              Registrate
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
