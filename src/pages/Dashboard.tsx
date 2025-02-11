import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardComponent: React.FC = () => {
  const { user, token } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fieldUsername, setFieldUsername] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  if (!token) {
    navigate('/');
  }

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

  const handleUpload = async () => {
    if (!file) return setErrorMsg('Photo de profile manquante');
    console.log('handle lancé');

    // On prépare l'envoi vers le serveur
    const formData = new FormData();
    formData.append('file', file);
    if (user) {
      formData.append('userId', user.id.toString());
    }

    try {
      const response = await fetch('https://server.hygoww.fr/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoie de la photo");

      const data = await response.json();
      setSuccess(data.message);
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de l'envoi du fichier : ", err);
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/png': ['.png'] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
        setPreview(URL.createObjectURL(file)); // Affiche l'aperçu
      }
    },
  });

  return (
    <div className="p-4 gap-4 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mt-8">
        Personnalisez votre expérience
      </h1>
      <p className="mb-4">Changez ce que vous souhaitez !</p>
      <div className="flex gap-8">
        {/* Avatar */}
        <div className="card bg-base-300 w-96 shadow-sm h-[400px]">
          <div className="max-w-lg mx-auto my-4 w-full p-4">
            <div
              {...getRootProps()}
              className="border-4 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-center text-gray-500">Déposer une image</p>
            </div>
          </div>
          <div className="card-body">
            <h2 className="card-title">Photo de profil</h2>
            <p>
              Changez votre photo de profil. <br /> Format accepté : png
            </p>
            {success && <p className="text-green-700 text-center">{success}</p>}
            {errorMsg && <p className="text-red-700 text-center">{errorMsg}</p>}
            <button onClick={handleUpload} className="btn btn-primary mt-4">
              Envoyer l'image
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="font-semibold">
            Modifiez votre pseudo
          </label>
          <input
            type="text"
            placeholder={user ? user.username : ' '}
            className="input mt-2"
            onChange={(e) => {
              setFieldUsername(e.target.value);
            }}
          />
          <div className="avatar mt-12 flex">
            <div className="w-24 h-24 rounded-xl">
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <img src={avatarUrl} alt="" />
              )}
            </div>
            <div className="flex mx-4">
              <h1 className="text-xl font-bold">
                {fieldUsername ? fieldUsername : user && user.username}
              </h1>
              {user?.rank === 1 && (
                <div className="badge bg-red-700 text-white font-semibold mt-2">
                  Administrateur
                </div>
              )}
              {user?.rank === 2 && (
                <div className="badge bg-blue-700 text-white font-semibold mt-2">
                  Modérateur
                </div>
              )}
              {user?.rank === 3 && (
                <div className="badge bg-gray-700 text-white mt-2">Membre</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardComponent;
