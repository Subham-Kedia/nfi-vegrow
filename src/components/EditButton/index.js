import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

import AppButton from '../AppButton';

const EditButton = ({ href, isEditable, handleEdit, children }) => {
  if (isEditable && children) {
    return children;
  }
  return isEditable && href ? (
    <Icon href={href} />
  ) : isEditable ? (
    <Btn handleEdit={handleEdit} />
  ) : (
    <></>
  );
};

const Icon = ({ href }) => {
  return (
    <IconButton aria-label="Edit" href={href}>
      <EditIcon />
    </IconButton>
  );
};

const Btn = ({ handleEdit }) => {
  return (
    <AppButton onClick={handleEdit} className="margin-horizontal">
      Edit
    </AppButton>
  );
};

export default EditButton;
