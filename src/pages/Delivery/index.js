import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Grid, Tab, Tabs, Typography, useTheme } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppLoader, CreateAllowed, CustomPagination } from 'Components';
import Sm from 'Components/Responsive/Sm';
import DeliveryDetails from 'Pages/Delivery/DeliveryDetails';
import { getDeliveriesDcArrival } from 'Services/delivery';
import { RESOURCES, STATUS_LIST } from 'Utilities/constants';

import {
  CreatedAtInfo,
  IdentifierInfo,
  ItemsInfo,
  SourceInfo,
} from './components/DeliveryInfo';
import DeliveryInfoHeader from './components/DeliveryInfoHeader';
import {
  classes,
  LeftSection,
  RightSection,
  ShipmentInfoWrapper,
} from './styled';

const PAGE_SIZE = 10;

const Delivery = () => {
  const navigate = useNavigate();
  const { dcId } = useSiteValue();
  const [selectedTransferOrderId, setSelectedTransferOrderId] = useState(null);
  const [delivery, setDelivery] = useState([]);
  const [tab, setTab] = useState(STATUS_LIST.PENDING.value);
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(1);

  const location = useLocation();

  const {
    palette: {
      colors: { white, gray1 },
    },
  } = useTheme();

  const { deliveryInfoWrapper, shipmentRow } = classes();

  const getDeliveryData = ({ newPage = page, selectedTab = tab } = {}) => {
    setLoading(true);
    getDeliveriesDcArrival({
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      status: selectedTab,
    })
      .then(({ items, total_count = 0, counts = {} }) => {
        setDelivery(items || []);
        setCounts(counts);
        setTotalCount(Math.ceil(total_count / PAGE_SIZE) || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const redirectToDCListing = () => {
    navigate('/app/dc-arrival');
  };

  useEffect(() => {
    backHandler();
  }, [tab]);

  const handleChangeTab = (_event, newValue) => {
    setTab(newValue);
    setPage(1);
    getDeliveryData({ selectedTab: newValue });
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    getDeliveryData({ newPage });
    if (location.pathname !== '/app/dc-arrival')
      navigate('', { replace: true });
  };

  useEffect(() => {
    getDeliveryData();
    setSelectedTransferOrderId(null);
    redirectToDCListing();
  }, [dcId]);

  const onClickRow = (row) => {
    setSelectedTransferOrderId(row.id);
    navigate(row.id.toString());
  };

  const backHandler = () => {
    navigate(`/app/dc-arrival`);
    setSelectedTransferOrderId(null);
  };

  const deliveryInfo = delivery.map((d, index) => {
    const { shipments, identifier } = d;

    const bgColor = index % 2 === 0 ? gray1 : white;

    const shipmentsInfo = shipments.map((shipment, idx) => {
      const {
        sender_name: sender,
        created_at: createdAt,
        non_fruit_shipment_items: nfiItems,
        id,
      } = shipment;

      const identifierValue = idx === 0 ? identifier : '';

      return (
        <Grid container key={id} className={shipmentRow}>
          <IdentifierInfo identifier={identifierValue} />
          <SourceInfo source={sender} />
          <CreatedAtInfo date={createdAt} />
          <ItemsInfo items={nfiItems} />
        </Grid>
      );
    });

    return (
      <ShipmentInfoWrapper
        bgColor={bgColor}
        key={identifier}
        onClick={() => onClickRow(d)}
      >
        {shipmentsInfo}
      </ShipmentInfoWrapper>
    );
  });

  return (
    <PageLayout title="DC Arrivals" showSelectDC>
      <PageLayout.Body flexDirection="row">
        <Sm
          backHandler={backHandler}
          selectedId={
            selectedTransferOrderId || location.pathname.includes('add')
          }
          rightSection={() =>
            loading ? (
              <AppLoader />
            ) : (
              <RightSection>
                <CreateAllowed resource={RESOURCES.TRANSFER_ORDER}>
                  {() => {
                    return (
                      <Routes>
                        <Route
                          path=":deliveryId"
                          element={
                            <DeliveryDetails
                              data={delivery}
                              backHandler={backHandler}
                              loadDelivery={getDeliveryData}
                            />
                          }
                        />
                        <Route
                          path="*"
                          element={
                            <Grid
                              container
                              justifyContent="center"
                              alignItems="center"
                              style={{ height: '100%' }}
                            >
                              <Typography variant="h5" gutterBottom>
                                Select or Add Shipment
                              </Typography>
                            </Grid>
                          }
                        />
                      </Routes>
                    );
                  }}
                </CreateAllowed>
              </RightSection>
            )
          }
          leftSection={() => (
            <LeftSection>
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                className="transfer-order-tabs"
                style={{ marginBottom: '0.2rem' }}
              >
                {Object.values(STATUS_LIST).map(({ value, label }) => (
                  <Tab
                    label={`${label} (${counts[value] || 0})`}
                    key={value}
                    value={value}
                  />
                ))}
              </Tabs>
              {loading ? (
                <AppLoader />
              ) : (
                <>
                  <div className={deliveryInfoWrapper}>
                    <DeliveryInfoHeader />
                    <div>{deliveryInfo}</div>
                  </div>
                  {delivery.length > 0 && (
                    <CustomPagination
                      count={totalCount}
                      page={page}
                      shape="rounded"
                      onChange={handleChangePage}
                    />
                  )}
                </>
              )}
            </LeftSection>
          )}
        />
      </PageLayout.Body>
    </PageLayout>
  );
};

export default Delivery;
