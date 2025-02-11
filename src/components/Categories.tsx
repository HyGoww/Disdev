import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  img: string;
  author: string;
  title: string;
  description: string;
}

interface Users {
  username: string;
}

const CategorieComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    fetch('https://server.hygoww.fr/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        console.log(
          'Une erreur est survenue pendant la récupération des catégories : ',
          err
        );
      });

    fetch('https://server.hygoww.fr/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.log(
          'Une erreur est survenue pendant la récupération des catégories : ',
          err
        );
      });
  }, []);

  return (
    <div className="bg-base-100 w-full h-screen flex ">
      <div className="mt-4 w-2/3 mx-auto">
        <div className="mockup-browser border border-base-300 bg-neutral w-full">
          <div className="mockup-browser-toolbar">
            <div className="input">https://rulesandinformations.disdev.com</div>
          </div>
          <ul className="list bg-base-100 rounded-box shadow-md">
            <li className="p-4 pb-2 text-lg tracking-wide">
              Règles et Informations
            </li>

            {categories.map((cat) => {
              if (!categories) {
                return (
                  <div className="flex w-52 flex-col gap-4">
                    <div className="skeleton h-32 w-full"></div>
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-full"></div>
                  </div>
                );
              } else {
                return (
                  <li className="list-row" key={cat.id}>
                    <div>
                      <img className="size-10 rounded-box" src={cat.img} />
                    </div>
                    <div className="list-col-grow">
                      <Link to={`/category/${cat.id}`}>{cat.title}</Link>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        {cat.description}
                      </div>
                    </div>
                    <button className="btn btn-square btn-ghost">
                      <svg
                        className="size-[1.2em]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M6 3L20 12 6 21 6 3z"></path>
                        </g>
                      </svg>
                    </button>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
      <div className="w-1/4 h-full p-4">
        <div className="bg-neutral rounded-md w-full h-full flex flex-col">
          <h1 className="text-white font-semibold text-2xl mt-4 ml-4 font-mono">
            En ligne:
          </h1>
          <div className="flex gap-1 ml-4">
            {users.map((user) => {
              if (users.length < 1) {
                return <p>{user.username},</p>;
              }

              return <p>{user.username}, </p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategorieComponent;
