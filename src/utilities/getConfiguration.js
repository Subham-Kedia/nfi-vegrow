import { configuration as addEditMaterialConfiguration } from 'Pages/MaterialAssignment/AddEditMaterial';
import { configuration as recieveMaterialConfiguration } from 'Pages/MaterialAssignment/RecieveMaterial';
import PATH from 'Routes/path';

export const getConfiguration = (path, params) => {
  // slice(5) is used here for removing app/ part
  switch (path.slice(5)) {
    case PATH.RECEIVE_MATERIAL_ASSIGNMENT.URL: {
      return recieveMaterialConfiguration(params.materialId);
    }
    case PATH.ADD_MATERIAL_ASSIGNMENT.URL: {
      return addEditMaterialConfiguration();
    }
    case PATH.EDIT_MATERIAL_ASSIGNMENT.URL: {
      return addEditMaterialConfiguration(params.materialId);
    }
    default:
  }
};
