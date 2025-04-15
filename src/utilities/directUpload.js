
import { DirectUpload } from 'activestorage';
import { getUserData } from 'Utilities/localStorage';

export default function imageUpload(file, props = false, field = false, previewField = false) {
  const user = getUserData();
  if (!file?.type) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    if (props) {
      props.change(previewField, 'random');
    }
    const upload = new DirectUpload(
      file,
      `${API.supplyChainService}/rails/active_storage/direct_uploads`,
      {
        directUploadWillCreateBlobWithXHR: xhr => {
          // Put my JWT token in the auth header here
          xhr.setRequestHeader('Authorization', user.token);
          // Send progress upload updates
          // xhr.upload.addEventListener('progress', event => this.directUploadProgress(event));
        }
      }
    )

    return upload.create((error, blob) => {
      if (error) {
        reject({ error });
      } else {
        if (props) {
          props.change(field, blob.signed_id);
          props.change(previewField, blob.service_url);
        }
        resolve({ data: { ...blob, link: blob.service_url } });
      }
    })
  })
}