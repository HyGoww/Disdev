import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const asciiArt = `
██████╗ ██╗███████╗██████╗ ███████╗██╗   ██╗
██╔══██╗██║██╔════╝██╔══██╗██╔════╝██║   ██║
██████╔╝██║███████╗██████╔╝█████╗  ██║   ██║
██╔═══╝ ██║╚════██║██╔═══╝ ██╔══╝  ██║   ██║
██║     ██║███████║██║     ███████╗╚██████╔╝
╚═╝     ╚═╝╚══════╝╚═╝     ╚══════╝ ╚═════╝ 
`;

const HeroSectionComponent = () => {
  const [expandTerminal, setExpandTerminal] = useState(false);
  const [showAscii, setShowAscii] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['npm i disdev', 'installing', 'Done!']);
  const navigate = useNavigate();
  const [dots, setDots] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [comment, setComment] = useState('');
  const { user, token, logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setShowDone(true);
    }, 3000);

    setTimeout(() => {
      setExpandTerminal(true);
    }, 4000);

    setTimeout(() => {
      setShowAscii(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCommand = (event: { key: string }) => {
    if (event.key === 'Enter') {
      if (input.toLowerCase() === 'login' && token === null) {
        setComment(`Redirection vers la page de connexion`);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (input.toLowerCase() === 'register' && token === null) {
        navigate('/register');
      } else if (input.toLowerCase() === 'userpanel' && token != null) {
        navigate('/dashboard');
      } else if (input.toLowerCase() === 'logout' && token != null) {
        logout();
      } else if (input.toLowerCase() === 'go to') {
        navigate('/');
      } else {
        setOutput([...output, `$ ${input}`, 'Commande non reconnue']);
      }
      setInput('');
    }
  };

  return (
    <div className="bg-base-200 min-h-screen w-full flex items-center justify-center">
      <motion.div
        className="text-start flex justify-center w-full"
        initial={{ height: '150px', width: '400px' }}
        animate={{
          height: expandTerminal ? '80vh' : '150px',
          width: expandTerminal ? '90vw' : '400px',
        }}
        transition={{ duration: 1 }}
      >
        <div className="mockup-code w-full h-full overflow-hidden p-4">
          {showAscii ? (
            <pre className="text-success text-center text-lg">{asciiArt}</pre>
          ) : (
            <>
              <motion.pre
                data-prefix="$"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <code>connect disdev.com</code>
              </motion.pre>

              <motion.pre
                data-prefix=">"
                className="text-warning"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <code>connexion en cours{dots}</code>
              </motion.pre>

              {showDone && (
                <motion.pre
                  data-prefix=">"
                  className="text-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <code>Connexion réussie !</code>
                </motion.pre>
              )}
            </>
          )}
          {showAscii && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col text-lg ml-4 font-mono">
                <div className="text-sm">
                  <p>Processeur : 420 coeurs</p>
                  <p>RAM: 98745MB libres / 128968MB</p>
                  <p>
                    Adresse IP :{' '}
                    <span className="text-secondary">127.0.0.1</span>
                  </p>
                  <p>Uptime: up 7 decades, 4 days, 18 minutes</p>
                </div>

                <br />

                <p>
                  {token
                    ? `Ravi de te revoir ${user?.username} !`
                    : 'Bienvenue à toi ! Ravi de te retrouver sur Disdev.'}
                </p>
                <p>
                  {!token &&
                    "Tu n'as pas l'air d'avoir de compte ou alors tu n'es pas encore connecté."}
                </p>
                <p>
                  Petit rappel des commandes que tu peux faire directement dans
                  ce terminal :
                </p>
                {token ? (
                  <ul className="list-none pl-6">
                    <li>
                      <strong>userpanel</strong> : Permet d'aller sur ton panel
                      utilisateur
                    </li>
                    <li>
                      <strong>logout</strong> : Permet de te déconnecter
                      rapidement
                    </li>
                  </ul>
                ) : (
                  <ul className="list-none pl-6">
                    <li>
                      <strong>login</strong> : Permet de t'envoyer sur la page
                      de connexion
                    </li>
                    <li>
                      <strong>register</strong> : Permet de te créer un nouveau
                      compte
                    </li>
                  </ul>
                )}

                {comment}
              </div>

              <motion.pre data-prefix="$">
                <input
                  type="text"
                  className="bg-transparent outline-none text-success w-full"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  autoFocus
                />
              </motion.pre>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSectionComponent;
