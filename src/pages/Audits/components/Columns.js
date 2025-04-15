import { Link as RouterLink } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Link } from '@mui/material';
import { getFormattedDateTimeForCSVFile } from 'Utilities/dateUtils';
import { LibraryText } from 'vg-library/core';

import { AUDIT_STATUS } from '../constants';
import { getTextAndPathName } from '../utils';

export const getAuditColumns = (status, isApprover) => [
  {
    header: { label: 'Id' },
    props: { md: 1, xs: 12 },
    render: ({ id, status }) => (
      <Box display="flex" gap={1}>
        {id}
        {status === AUDIT_STATUS.COMPLETED && (
          <Link
            href={`${API.supplyChainService}nfi/inventory_audits/${id}/report.pdf`}
            target="_blank"
          >
            <DownloadIcon />
          </Link>
        )}
      </Box>
    ),
  },
  {
    header: { label: 'Timestamp' },
    props: { md: 1, xs: 12 },
    render: ({ updated_at_epoch }) => (
      <LibraryText>
        {getFormattedDateTimeForCSVFile(updated_at_epoch)}
      </LibraryText>
    ),
  },
  {
    header: { label: 'Auditor' },
    props: { md: 1, xs: 12 },
    render: ({ created_by: { name } }) => {
      return <LibraryText>{name}</LibraryText>;
    },
  },
  {
    header: { label: 'Dc' },
    props: { md: 1, xs: 12 },
    render: ({ dc: { name } }) => {
      return <LibraryText>{name}</LibraryText>;
    },
  },
  ...(status === AUDIT_STATUS.REJECTED || status === AUDIT_STATUS.COMPLETED
    ? [
        {
          header: { label: 'Approver' },
          props: { md: 1, xs: 12 },
          render: ({ approver }) => {
            return <LibraryText>{approver?.name}</LibraryText>;
          },
        },
      ]
    : []),
  {
    header: { label: 'Audit type' },
    key: 'audit_type',
    props: { md: 1, xs: 12 },
  },
  {
    header: { label: 'Auditor Remarks' },
    key: 'remarks',
    props: { md: 1.5, xs: 12 },
  },
  ...(status === AUDIT_STATUS.REJECTED || status === AUDIT_STATUS.COMPLETED
    ? [
        {
          header: { label: 'Approver Remarks' },
          key: 'approver_remarks',
          props: { md: 1.5, xs: 12 },
        },
      ]
    : []),
  {
    header: { label: 'Actions' },
    props: { md: 1, xs: 12 },
    render: ({ id }) => {
      const { text, pathname } = getTextAndPathName(status, id, isApprover);
      return (
        <Link color="primary" component={RouterLink} to={{ pathname }}>
          {text}
        </Link>
      );
    },
  },
];
