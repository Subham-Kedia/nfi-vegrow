import { useRef, useState } from 'react';
import { getPartners } from 'Services/purchaseOrder';

const usePartnersList = () => {
  const [partners, setPartners] = useState([]);
  const inProgressApi = useRef();

  const getUpdatedPartnersList = (query) => {
    if (query.length < 3) return;

    clearTimeout(inProgressApi.current);

    inProgressApi.current = setTimeout(() => {
      getPartners({ q: query }).then(({ items = [] }) => {
        setPartners(items);
      });
    }, 200);
  };

  return [partners, getUpdatedPartnersList];
};

export default usePartnersList;
