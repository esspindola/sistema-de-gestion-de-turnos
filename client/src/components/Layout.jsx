import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children, page, setPage }) {
  const { user, logout } = useAuth();

  const adminLinks = [
    { id: 'appointments', label: 'Turnos' },
    { id: 'professionals', label: 'Profesionales' },
    { id: 'users', label: 'Usuarios' },
  ];

  const patientLinks = [
    { id: 'my-appointments', label: 'Mis Turnos' },
    { id: 'new-appointment', label: 'Nuevo Turno' },
  ];

  const links = user?.role === 'admin' ? adminLinks : patientLinks;

  return (
    <div className="min-h-screen bg-violet-50 text-slate-700">
      <header className="bg-white border-b border-violet-100 px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-xl font-bold tracking-tight">Rampage</span>
          <span className="text-violet-200 text-xs font-medium uppercase tracking-widest">Medicus</span>
        </div>
        <nav className="flex items-center flex-wrap gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === l.id
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              {l.label}
            </button>
          ))}
          <div className="ml-2 flex items-center gap-2 border-l border-violet-100 pl-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              {user?.name} <span className="text-violet-400">({user?.role})</span>
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            >
              Salir
            </button>
          </div>
        </nav>
      </header>
      <main className="p-4 sm:p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
