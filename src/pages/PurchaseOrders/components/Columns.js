import {
  CloudDownloadOutlined,
  Delete,
  EditOutlined,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';
import { AppButton } from 'Components';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { purchaseOrderTypeLabel } from '../constant';
import {
  isDraft,
  isGrnClosed,
  isPendingApproval,
  isRejected,
  isShipmentAdditionAllowed,
} from '../utils';

export const COLUMNS = [
  {
    header: {
      label: 'PO Number/Date',
    },
    key: 'id',
    props: { md: 1, xs: 12 },
    render: (
      { id = '', status = '', purchase_date = '' },
      {
        toggleConfirmDialog = () => {},
        toggleUndoCloseConfirmDialog = () => {},
        handlePOClick = () => {},
        styleClass,
      },
    ) => {
      const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        handlePOClick(id);
      };

      return (
        <>
          <LibraryText>{getFormattedDate(purchase_date || '')}</LibraryText>
          <AppButton
            variant="text"
            size="medium"
            className={styleClass.identifierFont}
            onClick={handleClick}
          >
            PO {id || ''}
          </AppButton>
          {!isPendingApproval(status) &&
            !isRejected(status) &&
            !isDraft(status) &&
            (!isGrnClosed(status) ? (
              <AppButton
                disabled={isGrnClosed(status)}
                variant="outlined"
                aria-label="Tracking Url"
                target="_blank"
                data-id={id}
                onClick={() => toggleConfirmDialog(id)}
              >
                PO CLOSE
              </AppButton>
            ) : (
              <AppButton
                disabled={!isGrnClosed(status)}
                variant="outlined"
                aria-label="Tracking Url"
                target="_blank"
                data-id={id}
                onClick={() => toggleUndoCloseConfirmDialog(id)}
              >
                UNDO PO CLOSE
              </AppButton>
            ))}
        </>
      );
    },
  },
  {
    header: {
      label: 'PO Type',
    },
    key: 'po_type',
    props: { md: 1, xs: 12 },
    render: ({ po_type }) => (
      <LibraryText variant="body1">
        {purchaseOrderTypeLabel[po_type]}
      </LibraryText>
    ),
  },
  {
    header: {
      label: 'Vendor',
    },
    key: 'vendor',
    props: { md: 1, xs: 12 },
    render: ({ partner: { name = '' } = {} }) => name,
  },
  {
    header: {
      label: 'User Details',
    },
    key: 'user',
    props: { md: 2, xs: 12 },
    render: ({
      user = '',
      approver = '',
      status = '',
      created_date = '',
      approved_date = '',
      rejected_date = '',
    }) => (
      <LibraryGrid container>
        <LibraryText variant="body2">Created By: {user}</LibraryText>
        <LibraryText variant="caption">
          {getFormattedDateTime(created_date)}
        </LibraryText>
        {!isPendingApproval(status) && !isDraft(status) && (
          <>
            <LibraryText variant="body2">
              {isRejected(status) ? 'Rejected' : 'Approved'} By: {approver}
            </LibraryText>
            <LibraryText variant="caption">
              {isRejected(status)
                ? getFormattedDateTime(rejected_date)
                : getFormattedDateTime(approved_date)}
            </LibraryText>
          </>
        )}
      </LibraryGrid>
    ),
  },
  {
    header: {
      label: 'Items/Services',
    },
    props: { md: 2, xs: 12 },
    render: ({ purchase_items = [] }) =>
      purchase_items?.map(({ id = '', packaging_item, service_type }) => (
        <LibraryText variant="body2" key={id}>
          {/* TODO: Subhankur to remove optional chaining in service_type?.name as either of packaging or service will always exist
          It is kept becuase there is data flaw. Need to check how it got created */}
          {packaging_item?.item_code || service_type?.name || ''}
        </LibraryText>
      )),
  },
];

export const SHIPMENT_PR_COLUMNS = [
  {
    header: {
      label: 'Shipments/Payment Request',
    },
    key: 'delivery_ location',
    props: { md: 2, xs: 12 },
    render: (data, { handleShipmentModal = () => {}, styleClass }) => {
      const { status, po_type, non_fruit_shipments, id, pr_count } = data;
      return (
        <>
          <div>
            {non_fruit_shipments
              ?.sort((a, b) => b.received_time - a.received_time)
              ?.map((shipment, index, elements) => {
                const styleObj =
                  shipment.received_time && !elements[index + 1]?.received_time
                    ? styleClass.shipmentBgFont
                    : styleClass.shipmentFont;

                return (
                  <AppButton
                    variant="text"
                    size="medium"
                    key={shipment.id}
                    className={styleObj}
                    onClick={handleShipmentModal(data, shipment?.id || '')}
                  >
                    {shipment.received_time
                      ? shipment?.identifier.replace('SHIP', 'GRN')
                      : shipment?.identifier}
                  </AppButton>
                );
              })}
          </div>

          {!isShipmentAdditionAllowed(status, po_type) ? null : (
            <AppButton
              variant="text"
              size="medium"
              onClick={handleShipmentModal(data)}
              className={styleClass.topMargin}
            >
              Add Shipment
            </AppButton>
          )}

          <div>
            <LibraryText variant="h8">
              <Link href={`/app/purchase-order/${id}/payment-requests/list`}>
                Payment Requests({`${pr_count || 0}`})
              </Link>
            </LibraryText>
          </div>
        </>
      );
    },
  },
];

export const ACTION_COLUMNS = [
  {
    header: {
      label: 'Actions/Remark',
    },
    key: 'actions',
    props: { md: 2, xs: 12 },
    render: (
      { id = '', status = '', approver = '', rejected_reason = '' },
      {
        downloadPDF = () => {},
        toggleDeleteConfirmDialog = () => {},
        styleClass,
      },
    ) => (
      <LibraryGrid container direction="column">
        <LibraryGrid item>
          {isPendingApproval(status) && (
            <LibraryGrid container direction="column" justifyContent="center">
              <LibraryGrid container alignItems="center">
                <RemoveCircleIcon color="primary" />
                <LibraryText variant="subtitle2" color="primary">
                  Awaiting approval
                </LibraryText>
              </LibraryGrid>
              <LibraryText variant="caption" component="div">
                approval by: {approver}
              </LibraryText>
            </LibraryGrid>
          )}
          {isRejected(status) && (
            <LibraryGrid container direction="column">
              <LibraryGrid container direction="row">
                <RemoveCircleIcon color="secondary" />
                <LibraryText variant="subtitle2" color="secondary">
                  Rejected
                </LibraryText>
              </LibraryGrid>
              {rejected_reason && (
                <LibraryGrid container direction="row">
                  <LibraryText
                    variant="caption"
                    className={styleClass.bgPadding}
                  >
                    {rejected_reason}
                  </LibraryText>
                </LibraryGrid>
              )}
            </LibraryGrid>
          )}
        </LibraryGrid>
        <LibraryGrid item>
          {(isDraft(status) || isRejected(status)) && (
            <IconButton href={`/app/purchase-order/edit/${id}`}>
              <EditOutlined data-cy="nfi.poEdit" />
            </IconButton>
          )}
          {isDraft(status) && (
            <IconButton onClick={() => toggleDeleteConfirmDialog(id)}>
              <Delete data-cy="nfi.poDelete" />
            </IconButton>
          )}
          {!isDraft(status) && (
            <IconButton onClick={() => downloadPDF(id)}>
              <CloudDownloadOutlined />
            </IconButton>
          )}
        </LibraryGrid>
      </LibraryGrid>
    ),
  },
];
