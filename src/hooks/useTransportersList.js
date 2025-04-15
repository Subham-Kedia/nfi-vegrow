import { useRef, useState } from 'react';
import { getTransporters } from 'Services/trips';

const useTransportersList = () => {
  const [transporters, setTransporters] = useState([]);
  const inProgressApi = useRef();

  const getUpdatedTransportersList = (query) => {
    if (query.length < 3) return;

    clearTimeout(inProgressApi.current);

    inProgressApi.current = setTimeout(() => {
      getTransporters({ q: query }).then(({ items = [] }) => {
        setTransporters(items);
      });
    }, 200);
  };

  return [transporters, getUpdatedTransportersList];
};
export default useTransportersList;
