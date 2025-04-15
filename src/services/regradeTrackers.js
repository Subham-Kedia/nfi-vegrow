import { supplyChainService } from 'Services/base';

export const getRegradeTrackers = (params) => {
  return supplyChainService.get(`regrade_trackers.json`, {
    params,
  });
};

export const regradeTrackerById = (id) => {
  return supplyChainService.get(`regrade_trackers/${id}.json`);
}
