import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <h1 className="text-6xl font-bold">404 - Page non trouvée</h1>
      <p className="mt-6">La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="font-semibold">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
