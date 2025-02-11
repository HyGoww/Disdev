import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const token = localStorage.getItem('token');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  fetch(`https://server.hygoww.fr/api/avatar/${user && user.id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      }
    })
    .catch((err) =>
      console.log('Erreur lors de la récupération des utilisateurs : ', err)
    );
  console.log(token);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex navbar-start">
        <img src="../public/logo.png" alt="Logo" className="w-12 h-12" />
        <a className="font-bold text-xl mx-4" href="/">
          Disdev
        </a>
      </div>
      <div className="flex gap-2 navbar-end">
        <input
          type="text"
          placeholder="Rechercher"
          className="input input-bordered w-24 md:w-auto"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            {token ? (
              <div className="avatar avatar-online">
                <div className="w-10 rounded-full">
                  {user ? (
                    <img src={avatarUrl} />
                  ) : (
                    <span className="loading loading-spinner loading-xl"></span>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            )}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {token && <li>Salut, {user && user.username}</li>}
            <li>
              {token ? (
                ' '
              ) : (
                <a className="justify-between" href="/login">
                  Se connecter
                </a>
              )}
            </li>
            <li>
              {token ? (
                <a className="justify-between" href="/dashboard">
                  Panneau utilisateur
                  <span className="badge">Nouveau!</span>
                </a>
              ) : (
                ' '
              )}
            </li>
            <li>
              {token ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Se déconnecter
                </button>
              ) : (
                <a href="/register">S'inscrire</a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default NavbarComponent;
