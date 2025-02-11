import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

const FetchCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesReponse = await fetch(
          'https://server.hygoww.fr/categories'
        );
        const categories = await categoriesReponse.json();
        setCategories(categories);
      } catch (err) {
        console.log('Erreur lors de la récupération des données :', err);
      }
    };
    fetchData();
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
