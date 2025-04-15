import { Route, Routes } from 'react-router-dom';
import Inventory from 'Pages/Inventory/Inventory';

const InventoryPage = () => {
  return (
    <Routes>
      <Route path="" element={<Inventory />} />
    </Routes>
  );
};

export default InventoryPage;
