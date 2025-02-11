import React, { createContext, useContext, useEffect, useState } from 'react';

// Définition du type utilisateur
interface User {
  id: number;
  rank: number;
  username: string;
  email: string;
  avatar_url?: string; // Optionnel
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte plus facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Fonction pour décoder le JWT et vérifier son expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Décodage de la partie payload du JWT
    return payload.exp * 1000 < Date.now(); // Vérifie si la date d'expiration est passée
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return true; // Si erreur, on considère que le token est invalide
  }
};

// Provider pour gérer l'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  // Fonction de connexion
  const login = async (newToken: string) => {
    if (isTokenExpired(newToken)) {
      logout();
      return;
    }

    localStorage.setItem('token', newToken);
    setToken(newToken);

    // Récupérer les infos de l'utilisateur après connexion
    try {
      const response = await fetch('https://server.hygoww.fr/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      if (!response.ok)
        throw new Error('Échec de récupération de l’utilisateur');

      const userData = await response.json();
      setUser(userData);
      console.log('Utilisateur connecté:', userData);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      logout();
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Vérifie l'authentification au chargement de l'appli
  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        login(token);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
