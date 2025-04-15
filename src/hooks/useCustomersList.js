import { useRef, useState } from 'react';
import { getCustomers } from 'Services/users';

const useCustomersList = ({ showActive } = { showActive: true }) => {
  const [customers, setCustomers] = useState([]);
  const inProgressApi = useRef();

  const getUpdatedCustomersList = (query) => {
    if (query.length < 3) return;

    clearTimeout(inProgressApi.current);

    inProgressApi.current = setTimeout(() => {
      getCustomers({ q: query, active: showActive }).then(({ items = [] }) => {
        setCustomers(items);
      });
    }, 200);
  };

  return [customers, getUpdatedCustomersList];
};

export default useCustomersList;
