import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import CreateAllowed from 'Components/CreateAllowed';
import RouteTransformer from 'Routes/routeTransformer';

import AuditListingUI from './components/AuditListingUI';
import { AUDIT_TABS } from './constants';
import AuditAPI from './services';

const PAGE_SIZE = 20;

const AuditMain = () => {
  const [tab, setTab] = useState(AUDIT_TABS.DRAFT.value);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({});
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { dcId } = useSiteValue();
  const controllerRef = useRef(null);

  const listAllAudits = useCallback(
    ({ offset = 0, limit = PAGE_SIZE, tab: newTab }, callback) => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      AuditAPI.getAllAudits(
        {
          limit,
          offset,
          status: newTab,
        },
        { signal: controllerRef.current.signal },
      )
        .then(
          ({
            items,
            completed_count,
            draft_count,
            total_count,
            pending_count,
            rejected_count,
          }) => {
            setData((prevData) =>
              offset === 0 ? items : [...prevData, ...items],
            );

            setCounts({
              Completed: completed_count,
              Draft: draft_count,
              PendingApproval: pending_count,
              Rejected: rejected_count,
            });
            setTotalCount(total_count);
            if (callback) callback();
          },
        )
        .finally(() => setLoading(false));
    },
    [],
  );

  useEffect(() => {
    setLoading(true);
    listAllAudits({ tab });
  }, [dcId, listAllAudits]);

  const handleChangeTab = (_event, newTab) => {
    setLoading(true);
    listAllAudits({ tab: newTab });
    setTab(newTab);
  };

  return (
    <PageLayout
      title="Audits"
      titleComponent={
        <CreateAllowed
          buttonProps={{
            href: `/app${RouteTransformer.getInventoryAuditCreation()}`,
          }}
          label="Audit"
          resource="nfi/inventory_audit"
        />
      }
      showSelectDC
    >
      <AuditListingUI
        loading={loading}
        tab={tab}
        handleChangeTab={handleChangeTab}
        data={data}
        counts={counts}
        totalCount={totalCount}
        loadMoreData={listAllAudits}
        tabList={AUDIT_TABS}
      />
    </PageLayout>
  );
};

export default AuditMain;
