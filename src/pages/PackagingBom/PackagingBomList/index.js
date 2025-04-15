import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import Table from 'Components/Table';

const COLUMNS = [
  {
    key: 'bom_id',
    header: 'Packaging BOM ID',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'bom_name',
    header: 'BOM Name',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'product_categories',
    header: 'Fruit Category',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    render: ({ data = [] }) => {
      return (
        <Typography variant="caption" component="div" color="textPrimary">
          {data?.join(',')}
        </Typography>
      );
    },
  },
];

const PackagingBomList = ({
  selectedPackagingBomId,
  setSelectedPackagingBomId,
  packagingBoms,
}) => {
  const navigate = useNavigate();
  const onClickRow = (row) => {
    setSelectedPackagingBomId(row.id);
    navigate(row.id);
  };

  return (
    <>
      {packagingBoms?.length !== 0 ? (
        <Table
          size="medium"
          sticky
          hover
          columns={COLUMNS}
          data={packagingBoms}
          dataKey="id"
          className="packaging-bom"
          rowProps={(rowData) => ({
            onClick: () => onClickRow(rowData),
            className:
              selectedPackagingBomId === rowData.id
                ? 'table-row selected'
                : 'table-row',
          })}
        />
      ) : (
        <Typography
          variant="h6"
          component="h6"
          style={{ textAlign: 'center', alignSelf: 'center', flex: 1 }}
        >
          No Packaging Boms Available
        </Typography>
      )}
    </>
  );
};

export default PackagingBomList;
