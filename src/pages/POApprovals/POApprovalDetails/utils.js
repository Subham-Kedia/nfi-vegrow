// refresh inventory data only if the last stored value was before 30 secs
export const shouldRefreshLocalInventoryData = (inventoryInfo) => {
  if (!inventoryInfo) return true;

  const currentTimeStamp = +new Date();

  const timeGapInSeconds =
    (currentTimeStamp - inventoryInfo.lastUpdatedTimeStamp) / 1000;

  return timeGapInSeconds > 30;
};

export const getTotalInTransitQty = (data) => {
  return data.reduce((res, { intransit_quantity }) => {
    res += +intransit_quantity || 0;
    return res;
  }, 0);
};
