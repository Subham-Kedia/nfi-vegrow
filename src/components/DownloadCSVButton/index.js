import { useEffect, useState } from 'react';
import { STATUS } from 'Utilities/constants/paymentRequest';
import { getFormattedDateTimeForCSVFile } from 'Utilities/dateUtils';

import { exportCSVFile } from '../../utilities/downloadCSV';
import AppButton from '../AppButton';

const DownloadCSVButton = ({ approvalList, fileTitle, ...rest }) => {
  const [approvalData, setApprovalData] = useState([]);

  useEffect(() => {
    getCsvData();
  }, [approvalList]);

  const getCsvData = () => {
    if (!approvalList?.length) {
      setApprovalData([]);
    }

    let approvalListData = [];
    approvalList?.forEach((item) => {
      const approvarName =
        item?.status === STATUS.APPROVED || item?.status === STATUS.PAID
          ? `${item?.approver_name} ${getFormattedDateTimeForCSVFile(
              item?.approved_date,
            )}`
          : item?.approvers?.map((item) => item?.name);
      const billDate =
        (item?.bill_date &&
          `Bill Date: ${getFormattedDateTimeForCSVFile(item?.bill_date)}`) ||
        '';
      const statuData =
        (item?.status == STATUS.PENDING || item?.status == STATUS.PAID) &&
        item?.customer &&
        `Paid By : ${item?.customer?.name}`;
      const paidDate =
        !item?.customer && getFormattedDateTimeForCSVFile(item?.paid_date);
      const paymentId =
        !item?.customer &&
        item?.zoho_payment_ids?.map((paymentId) => paymentId);
      approvalListData = [
        ...approvalListData,
        {
          id: item?.identifier || '',
          po_id: item?.source_label || '',
          vendor: item?.vendor?.name || '',
          category: item?.category_label || '',
          product_category:
            item?.product_categories?.map((item) => item?.name) || '',
          value:
            (item?.amount &&
              `Rs ${item?.amount} (${item?.payment_request_type_label})`) ||
            '',
          balance:
            (item.outstanding_advance && `Rs ${item.outstanding_advance}`) ||
            '',
          due_date: getFormattedDateTimeForCSVFile(item?.due_date) || '',
          requested:
            `${item?.creator_name} ${getFormattedDateTimeForCSVFile(
              item?.created_date,
            )}` || '',
          approvers: approvarName || '',
          paid:
            `${billDate || ''} ${statuData || ''} ${paidDate || ''} ${
              paymentId || ''
            }` || '',
        },
      ];
    });
    setApprovalData(approvalListData);
  };

  const csvData = {
    title: {
      id: 'PR ID',
      po_id: 'PO ID/ Trip ID',
      vendor: 'Vendor',
      category: 'Category',
      product_category: 'Product Category',
      value: 'Value (Type)',
      balance: 'Balance Advance',
      due_date: 'Due Date',
      requested: 'Requested',
      approvers: 'Approvers',
      paid: 'Paid At',
    },
    fileTitle,
    items: approvalData,
  };
  return (
    <AppButton
      variant="text"
      color="inherit"
      size="medium"
      onClick={() =>
        exportCSVFile(csvData.title, csvData.items, csvData.fileTitle)
      }
      {...rest}
    >
      DOWNLOAD
    </AppButton>
  );
};

export default DownloadCSVButton;
