import React from 'react';
import { CloudDownloadOutlined, EditOutlined } from '@mui/icons-material';
import { Grid, IconButton, Link } from '@mui/material';
import { AppButton, Text } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import { toFixedNumber } from 'Utilities';
import {
  LOCAL_STORAGE_KEYS,
  MATERIAL_ASSIGNMENT_TABS,
} from 'Utilities/constants/MaterialAssignment';
import { getFormattedDateTime } from 'Utilities/dateUtils';

import {
  DownloadIcon,
  MAIdentifier,
  RecievingIdentifier,
  RecievingText,
} from '../style';
import { getTrimmedMA } from '../utils';

const actions = ({
  isToBeAllotedState,
  isPartialReturnedState,
  id,
  downloadPDF,
  downloadReceivingPDF,
  maId,
  setShowAcknowledgement,
  downloadLink,
  receivings,
}) => {
  if (isToBeAllotedState) {
    return (
      <>
        <IconButton
          href={`/app/${RouteTransformer.getMaterialAssignmentEditLink(id)}`}
        >
          <EditOutlined />
        </IconButton>
        <IconButton onClick={() => downloadPDF(id)}>
          <CloudDownloadOutlined />
        </IconButton>
        <AppButton
          size="medium"
          onClick={() => {
            maId.current = id;
            setShowAcknowledgement(true);
          }}
        >
          Upload
        </AppButton>
      </>
    );
  }
  if (isPartialReturnedState) {
    const icons = receivings.map(({ id }) => (
      <DownloadIcon key={id} onClick={() => downloadReceivingPDF(id)}>
        <CloudDownloadOutlined />
      </DownloadIcon>
    ));
    return icons;
  }

  if (downloadLink) {
    return (
      <IconButton href={downloadLink} target="_blank">
        <CloudDownloadOutlined />
      </IconButton>
    );
  }
};

export const COLUMNS = [
  {
    key: 'id',
    header: {
      label: 'MA ID',
    },
    props: { md: 1, xs: 12 },
    render: (
      { id = '', identifier = '', status = '', partner: { name } = {} },
      { toggleConfirmDialog = () => {}, closeMaData },
    ) => (
      <>
        <MAIdentifier color="primary">{identifier}</MAIdentifier>
        {status === MATERIAL_ASSIGNMENT_TABS.PARTIAL_RETURN.value && (
          <AppButton
            variant="outlined"
            size="medium"
            onClick={() => {
              closeMaData.current = { identifier, name };
              toggleConfirmDialog(id);
            }}
          >
            CLOSE MA
          </AppButton>
        )}
      </>
    ),
  },
  {
    key: 'vendor',
    header: {
      label: 'Vendor',
    },
    props: { md: 1, xs: 12 },
    render: ({ partner: { name, phone_number } = {} }) => (
      <Text variant="body1" className="word-wrap">
        {name}-{phone_number}
      </Text>
    ),
  },
  {
    key: 'user',
    header: {
      label: 'User Details',
    },
    props: { md: 1, xs: 12 },
    render: ({
      user = '',
      approver = '',
      status = '',
      created_date = '',
      approved_date = '',
    }) => (
      <Grid container>
        <Text variant="body2">Requested By: {user}</Text>
        <Text variant="caption">{getFormattedDateTime(created_date)}</Text>
        {status !== MATERIAL_ASSIGNMENT_TABS.TO_BE_ALLOTED.value && (
          <>
            <Text variant="body2">Issued By: {approver}</Text>
            <Text variant="caption">{getFormattedDateTime(approved_date)}</Text>
          </>
        )}
      </Grid>
    ),
  },
  {
    key: 'item_code',
    header: {
      label: 'Item Assigned',
    },
    props: { md: 2, xs: 12 },
    render: (
      { material_assignment_items = [], id },
      { expandedItems, toggleExpandableItemsList },
    ) => {
      const handleShowMore = (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleExpandableItemsList(id);
      };

      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        handleShowMore,
        keyName: 'nfi_packaging_item',
        addExpansionBtn: true,
      });

      return (
        <Grid>
          {maItems.map((item, index) => {
            // item.nfi_packaging_item will be used to access the Show More.. or Show Less..
            // which is returned by the getTrimmedMA util
            const value = item.nfi_packaging_item;
            const displayValue = React.isValidElement(value)
              ? value
              : value.item_code;
            return (
              <Text variant="body1" key={index}>
                {displayValue}
              </Text>
            );
          })}
        </Grid>
      );
    },
  },
  {
    key: 'quantity',
    header: {
      label: 'Assigned Quantity',
    },
    props: { md: 1, xs: 12 },
    render: ({ material_assignment_items = [], id }, { expandedItems }) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        keyName: 'quantity',
      });
      return (
        <Grid>
          {maItems.map((item, index) => (
            <Text variant="body1" key={index}>
              {item.quantity}
            </Text>
          ))}
        </Grid>
      );
    },
  },
];

export const RECIEVING_COLUMN = [
  {
    header: {
      label: 'Recievings',
    },
    key: 'recieving',
    props: { md: 2, xs: 12 },
    render: ({ status = '', receivings = [], id }) => {
      const { PARTIAL_RETURN, CLOSED, ALLOTED } = MATERIAL_ASSIGNMENT_TABS;

      const isPartialReturnedState = status === PARTIAL_RETURN.value;
      const isClosedState = status === CLOSED.value;
      const isAllottedState = status === ALLOTED.value;

      return (
        <>
          {(isPartialReturnedState || isClosedState) &&
            receivings.map(({ identifier }) => (
              <RecievingIdentifier key={identifier} color="primary">
                {identifier}
              </RecievingIdentifier>
            ))}
          {(isAllottedState || isPartialReturnedState) && (
            <RecievingText
              color="primary"
              marginTop={isPartialReturnedState ? '1rem' : 0}
            >
              <Link
                href={`/app/${RouteTransformer.getCreateReceivingLink(id)}`}
                onClick={() => {
                  localStorage.setItem(
                    LOCAL_STORAGE_KEYS.MA_CURRENT_TAB,
                    status,
                  );
                }}
              >
                ADD RECIEVING
              </Link>
            </RecievingText>
          )}
        </>
      );
    },
  },
];

export const ACTION_COLUMN = [
  {
    key: 'action',
    header: {
      label: 'Action',
    },
    props: { md: 1, xs: 12 },
    render: (
      {
        id,
        status,
        acknowledgement_doc,
        gap_acknowledgement_doc,
        receivings = [],
      },
      {
        setShowAcknowledgement,
        maId,
        downloadPDF = () => {},
        downloadReceivingPDF = () => {},
      },
    ) => {
      const { TO_BE_ALLOTED, CLOSED, PARTIAL_RETURN } =
        MATERIAL_ASSIGNMENT_TABS;

      const isToBeAllotedState = status === TO_BE_ALLOTED.value;
      const isClosedState = status === CLOSED.value;
      const isPartialReturnedState = status === PARTIAL_RETURN.value;

      const downloadLink = isClosedState
        ? gap_acknowledgement_doc
        : acknowledgement_doc;

      return (
        <Grid>
          {actions({
            isToBeAllotedState,
            isPartialReturnedState,
            id,
            downloadPDF,
            downloadReceivingPDF,
            maId,
            setShowAcknowledgement,
            downloadLink,
            receivings,
          })}
        </Grid>
      );
    },
  },
];

export const RATE_COLUMN = [
  {
    header: {
      label: 'Rate',
    },
    key: 'rate',
    props: { md: 1, xs: 12 },
    render: ({ material_assignment_items = [], id }, { expandedItems }) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        keyName: 'effective_rate',
      });
      return (
        <Grid>
          {maItems.map((item, index) => (
            <Text variant="body1" key={index}>
              {item.effective_rate}
            </Text>
          ))}
        </Grid>
      );
    },
  },
];

export const PENDING_QUANTITY = [
  {
    header: {
      label: 'Pending Quantity',
    },
    key: 'rate',
    props: { md: 1, xs: 12 },
    render: ({ material_assignment_items = [], id }, { expandedItems }) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        keyName: 'pending_quantity',
      });

      return (
        <Grid>
          {maItems.map((item, index) => (
            <Text variant="body1" key={index}>
              {toFixedNumber(item.pending_quantity, 2)}
            </Text>
          ))}
        </Grid>
      );
    },
  },
];

export const GAP = [
  {
    header: {
      label: 'Gap',
    },
    key: 'gap',
    props: { md: 1, xs: 12 },
    render: ({ material_assignment_items = [], id }, { expandedItems }) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        keyName: 'pending_quantity',
      });

      return (
        <Grid>
          {maItems.map((item, index) => (
            <Text variant="body1" key={index}>
              {item.pending_quantity}
            </Text>
          ))}
        </Grid>
      );
    },
  },
];
