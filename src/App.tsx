import React from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Home as HomeIcon, LayoutDashboard, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

// Breadcrumb component
const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="container mx-auto px-4 py-2 flex items-center text-sm" data-testid="breadcrumb">
      <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
        <HomeIcon size={16} />
        Inicio
      </Link>
      {pathnames.map((name, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="mx-2 text-gray-500" />
          <span className="capitalize" data-testid={`breadcrumb-${name}`}>
            {name}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

// Back button component
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      data-testid="back-button"
    >
      <ArrowLeft size={20} />
      Volver
    </button>
  );
};

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <HomeIcon size={20} />
            <span>Inicio</span>
          </Link>
          {!isAuthenticated && (
            <>
              <Link to="/register" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <UserPlus size={20} />
                <span>Registro</span>
              </Link>
              <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600" data-testid="login-link">
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>
        {isAuthenticated && (
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
            data-testid="logout-button"
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const HomePage = () => (
  <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-3xl font-bold mb-6 text-center">Bienvenido a nuestra aplicación</h1>
    <div className="flex justify-center gap-4">
      <Link
        to="/register"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        data-testid="register-button"
      >
        Registro
      </Link>
      <Link
        to="/login"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        data-testid="login-button"
      >
        Iniciar Sesión
      </Link>
    </div>
  </div>
);

const Register = () => {
  const { register } = useAuth();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!username || !email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      setError('Ya existe un usuario con este correo electrónico');
      return;
    }

    register({ username, email, password });
    setSuccess(true);
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      <BackButton />
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md" data-testid="register-form">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" data-testid="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded" data-testid="success-message">
              Registro exitoso. Redirigiendo al login...
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-2 border rounded"
              data-testid="username-input"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded"
              data-testid="email-input"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border rounded"
              data-testid="password-input"
            />
            <p className="text-sm text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            data-testid="register-submit"
          >
            Registrarse
          </button>
          <p className="mt-4 text-center text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800" data-testid="login-button">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Todos los campos son requeridos');
      setIsLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      setError('No existe una cuenta con este correo electrónico');
      setIsLoading(false);
      return;
    }

    if (user.password !== password) {
      setError('Contraseña incorrecta');
      setIsLoading(false);
      return;
    }

    login(email, password);
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      <BackButton />
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md" data-testid="login-form">
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" data-testid="error-message">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 border rounded"
              data-testid="email-input"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border rounded"
              data-testid="password-input"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            disabled={isLoading}
            data-testid="login-submit"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          <p className="mt-4 text-center text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800" data-testid="register-link">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <BackButton />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6" data-testid="welcome-message">
          Bienvenido, {user.username}!
        </h1>
        <p className="text-gray-600 mb-4">
          Has iniciado sesión correctamente en el dashboard.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg" data-testid="user-info">
          <h2 className="text-xl font-semibold mb-2">Información del usuario</h2>
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;