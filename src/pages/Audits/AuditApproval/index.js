import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageFilter } from 'Components';
import { getDcs } from 'Services/users';

import AuditListingUI from '../components/AuditListingUI';
import { AUDIT_APPROVAL_TABS, AUDIT_TABS, getFilterUI } from '../constants';
import AuditAPI from '../services';

const PAGE_SIZE = 20;

const AuditApproval = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [tab, setTab] = useState(AUDIT_TABS.PENDING_APPROVAL.value);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({});
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    before: null,
    after: null,
    dc_id: null,
    audit_type: null,
    ...searchParams,
  });
  const [dcs, setDcs] = useState([]);

  const controllerRef = useRef(null);

  const listAllAudits = useCallback(
    ({ offset = 0, limit = PAGE_SIZE, tab: newTab, ...filters }, callback) => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      AuditAPI.getAllApproverAudits(
        {
          limit,
          offset,
          status: newTab,
          ...filters,
        },
        { signal: controllerRef.current.signal },
      )
        .then(
          ({
            items,
            completed_count,
            pending_count,
            total_count,
            rejected_count,
          }) => {
            setData((prevData) =>
              offset === 0 ? items : [...prevData, ...items],
            );

            setCounts({
              Completed: completed_count,
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
    getDcs().then(({ items } = {}) =>
      setDcs(items.map(({ id, name }) => ({ value: id, text: name }))),
    );
  }, []);

  const handleChangeTab = (_event, newTab) => {
    setLoading(true);
    listAllAudits({ tab: newTab, ...filters });
    setTab(newTab);
  };

  const handleFilterSubmit = (values) => {
    setLoading(true);
    setFilters(values);
    listAllAudits({ tab, ...values });
  };

  return (
    <PageFilter
      filterLabel="Audits Approval"
      data={getFilterUI(dcs)}
      initialValue={filters}
      setFilters={handleFilterSubmit}
    >
      <AuditListingUI
        loading={loading}
        tab={tab}
        handleChangeTab={handleChangeTab}
        data={data}
        counts={counts}
        totalCount={totalCount}
        loadMoreData={listAllAudits}
        tabList={AUDIT_APPROVAL_TABS}
        filters={filters}
        isApprover
      />
    </PageFilter>
  );
};

export default AuditApproval;
