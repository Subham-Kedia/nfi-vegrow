import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import CustomModal from 'Components/Modal';
import ViewPOPaymentRequest from 'Components/PaymentRequest/ViewPOPaymentRequest';
import ViewTripPaymentRequest from 'Components/PaymentRequest/ViewTripPaymentRequest';
import queryString from 'query-string';

const ViewPaymentRequest = ({ data }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { prId } = queryString.parse(location.search);
    +prId === data.id && openModal(prId);
  }, []);

  const openModal = () => {
    const { prId } = queryString.parse(location.search);
    navigate(`${location.pathname}?prId=${prId || data.id}`);
    setOpen(true);
  };

  const closeModal = () => {
    navigate(location.pathname);
    setOpen(false);
  };

  return (
    <>
      <Typography
        color="primary"
        onClick={openModal}
        style={{ cursor: 'pointer' }}
      >
        ₹ {data.amount || 0}
      </Typography>
      <CustomModal
        title={`Payment Request ID: ${data.id}`}
        open={open}
        onClose={closeModal}
        fullScreen
      >
        {data.purchase_order_id ? (
          <ViewPOPaymentRequest prId={data.id} />
        ) : (
          <ViewTripPaymentRequest prId={data.id} />
        )}
      </CustomModal>
    </>
  );
};

export default ViewPaymentRequest;
