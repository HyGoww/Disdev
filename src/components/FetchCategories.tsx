import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

const FetchCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('https://server.hygoww.fr/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) =>
        console.error('Erreur lors de la récupération des catégories : ', err)
      );
  }, []);

  return (
    <div>
      {categories.map((cat) => {
        return <li key={cat.id}>{cat.name}</li>;
      })}
    </div>
  );
};
export default FetchCategories;
