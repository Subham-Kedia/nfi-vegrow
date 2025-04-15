import { Link as RouterLink } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Card, CardContent, Link } from '@mui/material';
import { getDateTimeInYYYYMMDD } from 'Utilities/dateUtils';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { AUDIT_STATUS } from '../constants';
import { useStyles } from '../styled';
import { getTextAndPathName } from '../utils';

const CardText = ({ children }) => {
  const { marginBottom } = useStyles();
  return (
    <LibraryText color="textSecondary" className={marginBottom}>
      {children}
    </LibraryText>
  );
};

const AuditCard = ({
  date,
  auditor,
  type,
  status,
  remarks,
  id,
  isApprover,
}) => {
  const { card, cardContent, header, remarksContainer, justifyEnd } =
    useStyles();
  const { text, pathname } = getTextAndPathName(status, id, isApprover);
  return (
    <Card className={card}>
      <CardContent className={cardContent}>
        <LibraryGrid container className={header}>
          <LibraryGrid item xs={10}>
            <CardText variant="subtitle2">{date}</CardText>
          </LibraryGrid>
          <LibraryGrid item xs={2} textAlign="right">
            {status === AUDIT_STATUS.COMPLETED ? (
              <Box display="flex" gap={1} className={justifyEnd}>
                {id}
                <Link
                  href={`${API.supplyChainService}nfi/inventory_audits/${id}/report.pdf`}
                  target="_blank"
                >
                  <DownloadIcon />
                </Link>
              </Box>
            ) : (
              id
            )}
          </LibraryGrid>
        </LibraryGrid>
        <CardText>Auditor: {auditor}</CardText>
        <CardText>Audit type: {type}</CardText>
        <CardText>Status: {status}</CardText>
        <LibraryGrid container className={remarksContainer}>
          <LibraryGrid item xs={10}>
            <LibraryText variant="body2" component="p">
              Remarks: {remarks}
            </LibraryText>
          </LibraryGrid>
          <LibraryGrid item xs={2} textAlign="end">
            <Link
              color="primary"
              component={RouterLink}
              to={{
                pathname,
              }}
            >
              {text}
            </Link>
          </LibraryGrid>
        </LibraryGrid>
      </CardContent>
    </Card>
  );
};

const AuditMainMobile = ({ data, isApprover }) => {
  return data.map((d) => {
    const {
      id,
      audit_type,
      status,
      remarks,
      created_by,
      completed_at_epoch,
      updated_at_epoch,
    } = d;

    const date = completed_at_epoch ?? updated_at_epoch;

    return (
      <AuditCard
        auditor={created_by.name}
        id={id}
        type={audit_type}
        remarks={remarks}
        status={status}
        key={id}
        date={getDateTimeInYYYYMMDD(date)}
        isApprover={isApprover}
      />
    );
  });
};

export default AuditMainMobile;
