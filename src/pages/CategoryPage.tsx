import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaThumbsUp } from 'react-icons/fa';

interface Post {
  id: number;
  like: number;
  nolike: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [titleField, setTitleField] = useState('');
  const [contentField, setContentField] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
  const [authorInfos, setAuthorInfos] = useState<{
    username?: string;
    id?: number;
    up_vote?: number;
    down_vote?: number;
  }>({});
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesReponse, postsReponse] = await Promise.all([
          fetch(`https://server.hygoww.fr/categories/${id}`),
          fetch(`https://server.hygoww.fr/categories/${id}/posts`),
        ]);

        const [categories, posts] = await Promise.all([
          categoriesReponse.json(),
          postsReponse.json(),
        ]);

        setCategoryName(categories.title);
        setPosts(posts);
      } catch (err) {
        console.log('Erreur lors de la récupération des données : ', err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const newAvatars: { [key: string]: string } = {};

      for (const post of posts) {
        if (!avatars[post.author]) {
          try {
            const userRes = await fetch(
              `https://server.hygoww.fr/auth/user/${post.author}`
            );
            const userData = await userRes.json();

            if (!userData || userData.length === 0) continue;
            const authorId = userData[0].id;
            setAuthorInfos(userData[0]);

            const avatarRes = await fetch(
              `https://server.hygoww.fr/api/avatar/${authorId}`
            );
            const avatarData = await avatarRes.json();

            if (avatarData?.avatarUrl) {
              newAvatars[post.author] = avatarData.avatarUrl;
            }
          } catch (err) {
            console.log('Erreur récupération avatar :', err);
          }
        }
      }

      setAvatars((prev) => ({ ...prev, ...newAvatars }));
    };

    if (posts.length > 0) fetchAvatars();
  }, [avatars, posts]);

  // INITIALE LIKE
  const fetchLikes = async () => {
    try {
      const response = await fetch(
        `https://server.hygoww.fr/categories/${id}/posts`
      );
      const data = await response.json();
      setLikes(data[0].like);
    } catch (error) {
      console.error('Erreur de récupération des likes:', error);
    }
  };
  useEffect(() => {
    fetchLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //    HANDLE LIKE
  const handleLike = async () => {
    try {
      const response = await fetch(
        `https://server.hygoww.fr/categories/${id}/like`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error("Impossible d'ajouter le like");
      }

      // Récupérer les nouvelles informations (comme les likes mis à jour)
      const data = await response.json();
      setLikes(data.like); // Mettre à jour le nombre de likes
      setIsLiked(true); // L'utilisateur a maintenant liké
    } catch (error) {
      console.error("Erreur lors de l'ajout du like:", error);
    }
  };

  //   HANDLE NO LIKE
  const handleNolike = async () => {};

  //   HANDLE SUBMIT
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://server.hygoww.fr/categories/${id}/posts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: titleField,
            content: contentField,
            author: user && user.username,
          }),
        }
      );
      if (!response.ok) throw new Error("Problème lors de l'envoi");
      window.location.reload();
    } catch (err) {
      console.error('Un problème est survenu : ', err);
    }
  };

  return (
    <div className="gap-4 flex justify-center">
      {/* User card */}
      {posts.map((post) => (
        <div
          className="bg-neutral-900 rounded-lg shadow mb-4 mt-25 px-8 py-4"
          key={post.id}
        >
          <div className="flex flex-col">
            {avatars[post.author] ? (
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm font-semibold mb-2 opacity-60">
                  Posté par
                </p>
                <img
                  src={avatars[post.author]}
                  alt={`${post.author}'s avatar`}
                  className="w-24 h-24 rounded-sm"
                />
                <p className="text-lg font-bold mt-2">{post.author}</p>
                <div className="badge bg-red-700 mt-2">
                  <p className="text-zinc-100 font-semibold">Administrateur</p>
                </div>
                <p className="mt-4">
                  Upvote:{' '}
                  {authorInfos.up_vote || (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}
                </p>
                <p className="">Downvote: {authorInfos.down_vote}</p>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-sm bg-gray-300 flex items-center justify-center">
                <span className="text-white">{post.author[0]}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="mt-12 w-2/3">
        <h1 className="text-3xl font-bold mb-4">{categoryName}</h1>
        {posts.length === 0 ? (
          <div>
            <p className="text-error">Aucun contenu disponible.</p>
            {token && user?.rank === 1 ? (
              <div>
                <p className="mt-8 text-xl font-bold">
                  Effectuer une action Administrateur
                </p>
                <p>Créer un sujet principal sur ce topic</p>
                <form
                  action=""
                  className="flex flex-col text-lg font-semibold mt-4"
                  onSubmit={handleSubmit}
                >
                  <label htmlFor="">- Titre de ce topic</label>
                  <input
                    className="input"
                    type="text"
                    name="title"
                    id=""
                    onChange={(e) => setTitleField(e.target.value)}
                  />
                  <label htmlFor="">- Contenu de ce topic</label>
                  <textarea
                    className="input w-1/2"
                    name="title"
                    id=""
                    onChange={(e) => setContentField(e.target.value)}
                  />
                  <button type="submit" className="btn btn-soft mt-2 w-1/8">
                    Envoyer
                  </button>
                </form>
              </div>
            ) : (
              ' '
            )}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-neutral-900 rounded-lg shadow mb-4"
              >
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-gray-500 text-sm">
                  Par {post.author} - le{' '}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2">{post.content}</p>
                {/* Interactions */}
                <div className="w-full h-8 mt-8 flex items-center">
                  {!isLiked ? (
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white bg-transparent hover:bg-blue-500 hover:border-transparent rounded-full focus:outline-none transition duration-200 ease-in-out"
                      onClick={handleLike}
                    >
                      <FaThumbsUp className="text-lg" />{' '}
                      {/* Icône de pouce en l'air */}
                      J'aime - {likes}
                    </button>
                  ) : (
                    <button
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-300 bg-transparent hover:border-transparent rounded-full focus:outline-none transition duration-200 ease-in-out disabled"
                      onClick={handleLike}
                    >
                      <FaThumbsUp className="text-lg" />{' '}
                      {/* Icône de pouce en l'air */}
                      J'aime - {likes}
                    </button>
                  )}

                  <button className="btn btn-error" onClick={handleNolike}>
                    Je n'aime pas
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CategoryPage;
