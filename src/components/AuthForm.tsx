import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Si tu utilises React Router
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  type: string;
}

const asciiArt = `
██████╗ ██╗███████╗██████╗ ███████╗██╗   ██╗
██╔══██╗██║██╔════╝██╔══██╗██╔════╝██║   ██║
██████╔╝██║███████╗██████╔╝█████╗  ██║   ██║
██╔═══╝ ██║╚════██║██╔═══╝ ██╔══╝  ██║   ██║
██║     ██║███████║██║     ███████╗╚██████╔╝
╚═╝     ╚═╝╚══════╝╚═╝     ╚══════╝ ╚═════╝ 
`;

function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Uniquement pour l'inscription
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Définition de l'URL API (connexion ou inscription)
    const url =
      type === 'register'
        ? 'https://server.hygoww.fr/auth/register'
        : 'https://server.hygoww.fr/auth/login';

    // Création de l'objet avec les données du formulaire
    const userData =
      type === 'register' ? { username, email, password } : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      // Stocker le token si connexion réussie
      if (data.token) {
        localStorage.setItem('token', data.token);
        setSuccess('Connexion réussie !');
        setTimeout(() => {
          window.location.href = '/'; // Rediriger l'utilisateur
        }, 1000);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="mockup-code gap-4 p-4 h-[80vh] w-[90vw] mx-auto mt-14">
        <pre className="text-success text-center text-lg">{asciiArt}</pre>

        {type === 'login' ? (
          <div className="font-mono text-lg ml-6">
            <p>Pour te connecter, c'est très simple !</p>
            <p>
              Entre ton adresse mail que tu as mit pendant la création de ton
              compte.
            </p>
            <p>Ensuite tu rentres ton mot de passe.</p>
            <p>Puis appuie sur "Entrer" quand tu as fini !</p>
          </div>
        ) : (
          <div className="font-mono text-lg ml-6">
            <p>Pour te créer un compte, c'est très simple !</p>
            <p>Entre une adresse mail (que tu utilises, c'est mieux).</p>
            <p>Ensuite tu rentres ton mot de passe.</p>
            <p>Puis appuie sur "Entrer" quand tu as fini !</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          {type === 'register' && (
            <div>
              <label className="font-mono font-semibold text-lg ml-6">
                Pseudo
              </label>
              <motion.pre data-prefix="$">
                <input
                  className="bg-transparent outline-none text-success w-32"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </motion.pre>
            </div>
          )}
          <div className="">
            <p className="font-mono font-semibold text-lg ml-6">Email</p>
            <motion.pre data-prefix="$">
              <input
                className="bg-transparent outline-none text-success w-32"
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.pre>
            {email && (
              <div>
                <p className="font-mono font-semibold text-lg ml-6">
                  Mot de passe
                </p>
                <motion.pre data-prefix="$">
                  <input
                    className="bg-transparent outline-none text-success w-32"
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.pre>
                <button type="submit" className="hidden"></button>
                {error && (
                  <p className="font-mono text-lg ml-6 mt-4 text-error">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="font-mono text-lg ml-6 mt-4 text-success">
                    {success}
                  </p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">
              {type === 'register' ? 'Inscription' : 'Connexion'}
            </h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>

          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form className="fieldset" onSubmit={handleSubmit}>
                {type === 'register' && (
                  <div>
                    <label className="fieldset-label">Pseudo</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                )}
                <label className="fieldset-label">Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="fieldset-label">Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button className="btn btn-neutral mt-4">
                  {type === 'register' ? "S'inscrire" : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      </div> */}
    </div>
  );
}

export default AuthForm;
