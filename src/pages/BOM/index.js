import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Paper, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PageLayout from 'App/PageLayout';
import {
  AppLoader,
  CreateAllowed,
  CustomPagination,
  CustomTable,
  PageFilter,
} from 'Components';
import Sm from 'Components/Responsive/Sm';

import useFruitCategoriesList from '../../hooks/useFruitCategoryList';
import { getPackagingItem } from '../../services/lots';

import BOMAddEdit from './BOMAddEdit';
import BOMAPI from './service';
import { LeftSection, RightSection } from './styled';
import { COLUMNS, PAGE_SIZE, statusMap, statusOptions } from './constants';
import { RESOURCES } from 'Utilities/constants';

const BOM = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(statusMap.ACTIVE);
  const [bomData, setBomData] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(1);
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [fruitCategories, getFruitCategories] = useFruitCategoriesList();

  const loadBOMList = (
    { filter = filters, newPage = page } = { filter: filters, newPage: page },
  ) => {
    setLoading(true);
    BOMAPI.listOfBom({
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...filter,
    })
      .then(
        ({
          items = [],
          total_count = 0,
          active_bom_count,
          inactive_bom_count,
        }) => {
          setBomData(items);
          setCounts({
            [statusMap.ACTIVE]: active_bom_count,
            [statusMap.INACTIVE]: inactive_bom_count,
          });
          setTotalCount(Math.ceil(total_count / PAGE_SIZE) || 0);
        },
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllDropDownValues = () => {
    getPackagingItem({ for_bom: true }).then(
      ({ items: packaging_types } = {}) => {
        setPackagingTypes(packaging_types);
      },
    );
  };

  useEffect(() => {
    getAllDropDownValues();
  }, []);

  useEffect(() => {
    loadBOMList();
    navigate(location.pathname);
  }, []);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    loadBOMList({ newPage, filter: { ...filters } });
  };

  const backHandler = () => {};

  const onClickRow = ({ id = '' }) => {
    navigate(`${id}`);
  };

  const tableData = () => bomData || [];

  const renderLeftSection = () => {
    if (loading) return <AppLoader />;

    if (!tableData().length) {
      return (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Typography variant="h5" gutterBottom>
            No Data Available
          </Typography>
        </Grid>
      );
    }

    return (
      <Paper style={{ height: '83%' }}>
        <CustomTable
          size="medium"
          sticky
          hover="true"
          columns={COLUMNS}
          data={tableData}
          dataKey="id"
          className="transfer-table"
          totalRows={0}
          rowProps={(rowData) => ({
            onClick: () => onClickRow(rowData),
          })}
        />
        {bomData.length > 0 && (
          <CustomPagination
            count={totalCount}
            page={page}
            shape="rounded"
            onChange={handleChangePage}
          />
        )}
      </Paper>
    );
  };

  const onFilterSubmit = ({ packaging_item_ids = [], ...restValues }) => {
    const queryValues = {
      ...restValues,
      ...(packaging_item_ids.length
        ? {
            packaging_item_ids:
              packaging_item_ids.map(({ id = '' }) => id) || null,
          }
        : {}),
      fruit_category_id: restValues.fruit_category?.id,
      q: restValues?.q,
    };
    if (queryValues.fruit_category) delete queryValues.fruit_category;

    if (restValues.is_disabled?.value == null) {
      delete queryValues.is_disabled;
    }

    setFilters((filterValues) => ({ ...filterValues, ...queryValues }));
    loadBOMList({
      filter: { ...filters, ...queryValues, is_disabled: Boolean(tab) },
    });
  };

  const handleChangeTab = (_event, value) => {
    setTab(value);
    setPage(1);
    loadBOMList({ filter: { ...filters, is_disabled: Boolean(value) } });
  };

  const renderTabs = () => {
    return (
      <Tabs
        value={tab}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        style={{ marginBottom: '0.2rem' }}
      >
        {statusOptions.map(({ value = 0, label = '' }) => (
          <Tab
            label={`${label || ''} (${counts[value] || 0})`}
            key={value}
            value={value}
          />
        ))}
      </Tabs>
    );
  };

  return (
    <PageFilter
      filterLabel="Manage Packaging BOMs"
      initialValues={{ fruit_category: null }}
      titleComponent={
        <CreateAllowed
          resource={RESOURCES.PACKAGING_BOM}
          label="Packaging BOM"
          buttonProps={{
            onClick: () => {
              navigate(`add`);
            },
          }}
        />
      }
      data={[
        {
          type: 'fieldCombo',
          name: 'fruit_category',
          label: 'Fruit Category',
          placeholder: 'Select Fruit Category',
          style: { width: '200px', marginTop: 0 },
          onChangeInput: (value) => getFruitCategories(value),
          options: fruitCategories || [],
        },
        {
          type: 'fieldInput',
          name: 'q',
          label: 'Search BOM',
          placeholder: 'Enter BOM',
          style: { width: '200px', marginTop: 0 },
        },
      ]}
      setFilters={onFilterSubmit}
    >
      <PageLayout.Body flexDirection="row">
        <Sm
          backHandler={backHandler}
          rightSection={() => (
            <RightSection>
              <CreateAllowed>
                {() => (
                  <Routes>
                    <Route
                      path="add"
                      element={
                        <BOMAddEdit
                          packagingTypes={packagingTypes}
                          fruitCategory={filters.fruit_category}
                          loadBOMList={loadBOMList}
                        />
                      }
                    />
                    <Route
                      path=":bomId/edit"
                      element={
                        <BOMAddEdit
                          packagingTypes={packagingTypes}
                          loadBOMList={loadBOMList}
                        />
                      }
                    />
                    <Route
                      path=":bomId"
                      element={
                        <BOMAddEdit
                          packagingTypes={packagingTypes}
                          loadBOMList={loadBOMList}
                        />
                      }
                    />
                    <Route
                      path="*"
                      element={
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
                      }
                    />
                  </Routes>
                )}
              </CreateAllowed>
            </RightSection>
          )}
          leftSection={() => (
            <LeftSection>
              {renderTabs()}
              {renderLeftSection()}
            </LeftSection>
          )}
        />
      </PageLayout.Body>
    </PageFilter>
  );
};

export default BOM;
