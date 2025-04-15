import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import PageLayout from 'App/PageLayout';
import { AppButton, AppLoader } from 'Components';
import PageFilter from 'Components/PageFilter';
import CustomPagination from 'Components/Pagination';
import { getPackagingBoms } from 'Services/packagingBom';

import PackagingBomAddEdit from './PackagingBomAddEdit';
import PackagingBomList from './PackagingBomList';
import { LeftSection, RightSection } from './styled';

const PAGE_SIZE = 25;

const PackagingBom = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [packagingBoms, setPackagingBoms] = useState([]);
  const [selectedPackagingBomId, setSelectedPackagingBomId] = useState(null);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);

  const loadPackagingBoms = ({
    page: pageChanged = 1,
    filter: currentFilter = {},
    resetSelection = false,
  } = {}) => {
    setLoading(true);
    const pageFilter = pageChanged
      ? { offset: (pageChanged - 1) * PAGE_SIZE }
      : { offset: 0 };
    getPackagingBoms({ limit: PAGE_SIZE, ...pageFilter, ...currentFilter })
      .then((res) => {
        if (res?.items) {
          setPackagingBoms(res.items || []);
          setTotalCount(Math.ceil(res?.total_count / PAGE_SIZE) || 0);
        }
        if (resetSelection) {
          setSelectedPackagingBomId(null);
          navigate('');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPackagingBoms({ page: 1, filter: filters });
  }, [page]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    setPackagingBoms([]);
    setSelectedPackagingBomId(null);
  };

  const submitFilter = ({ id = null }) => {
    const currentFilter = id ? { id } : {};
    setFilters(currentFilter);
    loadPackagingBoms({ page: 1, filter: currentFilter });
  };

  return (
    <PageFilter
      titleComponent={
        <AppButton
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedPackagingBomId(null);
            navigate('add');
          }}
        >
          Add PackagingBom
        </AppButton>
      }
      initialValues={{
        id: '',
        // products: [],
      }}
      data={[
        {
          type: 'fieldInput',
          name: 'id',
          label: 'BOM ID',
          placeholder: 'Enter BOM ID',
          style: { width: '150px', marginTop: 0 },
        },
        // {
        //   type: 'fieldCombo',
        //   name: 'product_categories',
        //   label: 'Select Categories',
        //   multiple: true,
        //   placeholder: 'Select Categories',
        //   options: dropDownValues.products,
        // },
      ]}
      filterLabel="Packaging BOMs"
      setFilters={(value) => submitFilter(value)}
    >
      <PageLayout.Body flexDirection="row">
        <LeftSection>
          {loading ? (
            <AppLoader />
          ) : (
            <>
              <PackagingBomList
                packagingBoms={packagingBoms}
                selectedPackagingBomId={selectedPackagingBomId}
                setSelectedPackagingBomId={setSelectedPackagingBomId}
              />
              {totalCount ? (
                <CustomPagination
                  count={totalCount}
                  page={page}
                  shape="rounded"
                  onChange={handleChangePage}
                  justify="center"
                />
              ) : (
                <></>
              )}
            </>
          )}
        </LeftSection>
        <RightSection>
          <Routes>
            <Route
              path="add"
              element={
                <PackagingBomAddEdit
                  edit
                  loadPackagingBoms={loadPackagingBoms}
                />
              }
            />
            <Route
              path=":id/edit"
              element={
                <PackagingBomAddEdit
                  edit
                  loadPackagingBoms={loadPackagingBoms}
                />
              }
            />
            <Route
              path=":id"
              element={
                <PackagingBomAddEdit
                  edit={false}
                  loadPackagingBoms={loadPackagingBoms}
                />
              }
            />
            <Route path="*">
              <Typography
                variant="h6"
                component="h6"
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  flex: 1,
                }}
              >
                Select OR Add Packaging BOM
              </Typography>
            </Route>
          </Routes>
        </RightSection>
      </PageLayout.Body>
    </PageFilter>
  );
};

export default PackagingBom;
