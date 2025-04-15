import { useEffect, useState } from 'react';
import { DialogContentText, Grid, Paper, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, ConfirmationDialog } from 'Components';
import { getInventory } from 'Services/lots';
import { notifyUser } from 'Utilities';

import DiscardDump from './DiscardDump';
import InventoryList from './InventoryList';
import Regrading from './Regrading';
import { ColumnGrid, LeftSection, RightSection } from './styled';

const InventoryPage = () => {
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [showSelection, setShowSelection] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const { dcId } = useSiteValue();

  const loadInventory = () => {
    getInventory({ dc_id: dcId }).then((res) => {
      if (res?.items) {
        setInventory(res.items || []);
        setShowSelection(null);
      }
    });
  };

  const toggleCancelConfirmDialog = () => {
    setCancelConfirm(!cancelConfirm);
  };

  const cancelCurrentAction = () => {
    setSelectedInventory([]);
    setShowSelection(null);
    toggleCancelConfirmDialog();
    notifyUser('Action cancelled', 'warning');
  };

  const getInventoryReport = () => {
    if (!inventory.length) {
      notifyUser('No Items in Inventory', 'error');
      return;
    }
    window.open(
      `${API.CRMUrl}/nfi/packaging_items/download_stock_report.csv?dc_id=${dcId}`,
    );
  };

  useEffect(() => {
    loadInventory();
  }, [dcId]);

  return (
    <PageLayout
      title="Inventory"
      showSelectDC
      titleComponent={
        <>
          {showSelection === 'regrading' && (
            <AppButton
              onClick={() => {
                toggleCancelConfirmDialog();
              }}
            >
              Cancel Regrading
            </AppButton>
          )}
          {showSelection === 'dump' && (
            <AppButton
              onClick={() => {
                toggleCancelConfirmDialog();
              }}
            >
              Cancel Discard Dump
            </AppButton>
          )}
        </>
      }
    >
      <PageLayout.Body flexDirection="row">
        <LeftSection>
          <Paper style={{ flex: 1, padding: '4px' }}>
            <InventoryList
              selectedInventory={selectedInventory}
              setSelectedInventory={setSelectedInventory}
              showSelection={showSelection}
              inventory={inventory}
            />
          </Paper>
        </LeftSection>
        <RightSection>
          <Paper
            style={{
              flexDirection: 'column',
              display: 'flex',
              flex: 1,
              padding: '10px',
            }}
          >
            {!showSelection && (
              <ColumnGrid
                container
                spacing={2}
                style={{
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingTop: '20%',
                }}
              >
                <Typography
                  variant="subtitle2"
                  component="div"
                  className="disabled-text"
                >
                  Click on what you want to do with the inventory.
                </Typography>
                <Grid item>
                  <AppButton
                    size="medium"
                    style={{ width: '32ch' }}
                    onClick={() => setShowSelection('regrading')}
                  >
                    Regrade
                  </AppButton>
                </Grid>
                <Grid item>
                  <AppButton
                    size="medium"
                    style={{ width: '32ch' }}
                    onClick={() => setShowSelection('dump')}
                  >
                    Discard Dump
                  </AppButton>
                </Grid>
                <Grid item>
                  <AppButton
                    size="medium"
                    style={{ width: '32ch' }}
                    onClick={() => getInventoryReport()}
                  >
                    Download Stock Report
                  </AppButton>
                </Grid>
              </ColumnGrid>
            )}
            {showSelection === 'regrading' && (
              <Regrading
                selectedInventoryIds={selectedInventory}
                setSelectedInventory={setSelectedInventory}
                setShowSelection={setShowSelection}
                inventory={inventory}
                loadInventory={loadInventory}
                toggleCancelConfirmDialog={toggleCancelConfirmDialog}
              />
            )}
            {showSelection === 'dump' && (
              <DiscardDump
                selectedInventoryIds={selectedInventory}
                setSelectedInventory={setSelectedInventory}
                setShowSelection={setShowSelection}
                inventory={inventory}
                loadInventory={loadInventory}
                toggleCancelConfirmDialog={toggleCancelConfirmDialog}
              />
            )}
          </Paper>
        </RightSection>
        <ConfirmationDialog
          title="Cancel Confirmation"
          open={cancelConfirm}
          onConfirm={cancelCurrentAction}
          onCancel={toggleCancelConfirmDialog}
        >
          <DialogContentText>
            Are you sure you want to cancel and move out of this page?
          </DialogContentText>
        </ConfirmationDialog>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default InventoryPage;
