import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from 'App/PageLayout';
import { AppLoader } from 'Components';

import { PAGE_SIZE, SDN_STATUS } from './const';
import SDNDetails from './SDNDetails';
import SDNListing from './SDNListing';
import SDNService from './service';
import {
  LeftSectionWrapper,
  RightSectionWrapper,
  SectionWrapper,
} from './style';

const ServiceDeliveryNote = () => {
  const [status, setStatus] = useState(SDN_STATUS.PENDING.value);
  const [sdnData, setSdnData] = useState({ items: [], counts: {} });
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedService, setSelectedService] = useState({});

  const controllerRef = useRef(null);

  const fetchData = useCallback(
    ({
      newStatus = status,
      limit = PAGE_SIZE,
      offset = page * PAGE_SIZE,
    } = {}) => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      setIsApiInProgress(true);

      SDNService.getSDNData(
        {
          status: newStatus,
          limit,
          offset,
        },
        { signal: controllerRef.current.signal },
      )
        .then((res) => {
          setSdnData(res);
          setSelectedService({});
        })
        .finally(() => {
          setIsApiInProgress(false);
        });
    },
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (_, val) => {
    setStatus(val);
    setPage(0);
    fetchData({ newStatus: val, offset: 0 });
  };

  const handlePageChange = (_, val) => {
    const newPage = val - 1;
    setPage(newPage);
    fetchData({ offset: newPage * PAGE_SIZE });
  };

  const handleAcknowledgeSDN = () => {
    const newStatus = SDN_STATUS.RECEIVED.value;
    setStatus(newStatus);
    setPage(0);
    fetchData({ newStatus });
  };

  return (
    <PageLayout title="Service Delivery Note" showSelectDC>
      <PageLayout.Body>
        {isApiInProgress && <AppLoader />}
        {!isApiInProgress && (
          <SectionWrapper>
            <LeftSectionWrapper>
              <SDNListing
                data={sdnData.items}
                handleStatusChange={handleStatusChange}
                totalCount={sdnData.counts[status]}
                counts={sdnData.counts}
                page={page}
                handlePageChange={handlePageChange}
                status={status}
                selectedService={selectedService}
                setSelectedService={(_, service) => setSelectedService(service)}
              />
            </LeftSectionWrapper>
            <RightSectionWrapper>
              <SDNDetails
                selectedService={selectedService}
                status={status}
                onSubmit={handleAcknowledgeSDN}
              />
            </RightSectionWrapper>
          </SectionWrapper>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};

export default ServiceDeliveryNote;
