import { useRef, useState } from 'react';
import { getFruitCategories } from 'Services/packagingBom';

const useFruitCategoriesList = () => {
  const [fruitCategories, setFruitCategories] = useState([]);
  const inProgressApi = useRef();

  const getUpdatedFruitCategoriesList = (query) => {
    if (query.length < 2) return;

    clearTimeout(inProgressApi.current);

    inProgressApi.current = setTimeout(() => {
      getFruitCategories(query).then(({ items = [] }) => {
        setFruitCategories(items);
      });
    }, 200);
  };

  return [fruitCategories, getUpdatedFruitCategoriesList];
};

export default useFruitCategoriesList;
