import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { Box, Menu, MenuItem, Paper, Typography } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import { AppButton, AppLoader, ConfirmationDialog } from 'Components';
import { notifyUser } from 'Utilities';

import BOMAPI from '../service';
import { BomStatusBox } from '../styled';

import { PackagingBomForm } from './components/PackagingBomForm';

const BOMAddEdit = ({ packagingTypes = [{}], loadBOMList }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { bomId = '' } = params;

  const [isLoading, setLoading] = useState(false);
  const [bomData, setBomData] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const open = Boolean(anchorEl);
  const isViewFlow = bomId && !location.pathname.includes('edit') && !isCloning;

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (bomId) {
      setLoading(true);
      BOMAPI.getBomDetail(bomId || '')
        .then((data) => {
          setBomData({
            ...data,
            secondary_items:
              data.secondary_items.length > 0 ? data.secondary_items : [{}],
          });
        })
        .finally(() => setLoading(false));
    } else {
      setBomData();
    }
  }, [bomId]);

  const handleClone = () => {
    setIsCloning(true);
    const clonedData = {
      ...bomData,
      bom_id: '',
      is_disabled: false,
    };
    setBomData(clonedData);
    navigate('/app/bom/add', { state: { clonedData } });
    setIsCloning(false);
  };

  const navigateEditFlow = () => navigate(`/app/bom/${bomId}/edit`);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBOMEnableStatus = () => {
    BOMAPI.handleBOMStatus(bomId, !bomData.is_disabled)
      .then((res) => {
        notifyUser(
          `Packaging BOM ${bomData.is_disabled ? 'enabled' : 'disabled'} successfully.`,
        );
        setBomData(res);
        handleClose();
      })
      .catch((err) => console.log(err))
      .finally(() => setDisableConfirm(false));
  };

  const toggleConfirmDialog = () => {
    setDisableConfirm(!disableConfirm);
  };

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <Paper style={{ padding: '1rem' }}>
      {bomData ? (
        <Box
          display="flex"
          alignItems="center"
          fontWeight="bold"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            {bomData.bom_id}{' '}
            <BomStatusBox enabled={!bomData?.is_disabled}>
              {bomData?.is_disabled ? 'INACTIVE' : 'ACTIVE'}
            </BomStatusBox>
          </Box>
          <Box display="flex" gap="1rem" alignItems="center">
            <AppButton size="small" onClick={handleClone}>
              Clone
            </AppButton>
            <AppButton
              size="small"
              onClick={navigateEditFlow}
              disabled={bomData.is_disabled || bomData.is_partner_material}
            >
              Edit
            </AppButton>
            {!bomData.is_partner_material && (
              <MoreVertSharpIcon
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={toggleConfirmDialog}>
                {bomData.is_disabled ? 'Enable' : 'Disable'} BOM
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      ) : (
        <Typography
          variant="h6"
          color="textPrimary"
          style={{ fontWeight: 'bold' }}
        >
          {isCloning ? 'Clone Packaging BOM' : 'Add Packaging BOM'}
        </Typography>
      )}
      <PackagingBomForm
        bomData={bomData}
        loadBOMList={loadBOMList}
        packagingTypes={packagingTypes}
        isViewFlow={isViewFlow}
        isCloning={isCloning}
      />
      <ConfirmationDialog
        title={`Confirm ${bomData?.is_disabled ? 'Enable' : 'Disable'} Packaging BOM`}
        open={disableConfirm}
        onConfirm={handleBOMEnableStatus}
        onCancel={toggleConfirmDialog}
        confirmText="Yes"
      >
        <DialogContentText>
          Are you sure you want to {bomData?.is_disabled ? 'enable' : 'disable'}{' '}
          {bomData?.bom_id}?
        </DialogContentText>
      </ConfirmationDialog>
    </Paper>
  );
};

export default BOMAddEdit;
