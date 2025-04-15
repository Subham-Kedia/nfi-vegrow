import { ImageThumb } from 'Components';
import { UploadInput } from 'Components/FormFields';
import { validateRequired } from 'Utilities/formvalidation';

import classes from './style';

const UploadFooter = ({ isUploadMandatory, values, setFieldValue }) => {
  const { imageWrapper } = classes();

  return (
    <section className="text-align-right">
      <div className="margin-vertical">
        <UploadInput
          accept="image/*, application/pdf"
          name="ma_upload"
          multiple={false}
          required={isUploadMandatory}
          validate={isUploadMandatory ? validateRequired : null}
        />
      </div>
      {values.ma_upload && (
        <div className={imageWrapper}>
          <ImageThumb
            file={values.ma_upload[0]}
            url={values.ma_upload}
            style={{ width: '1.5rem', height: '1.5rem' }}
            removeAttachment={() => {
              setFieldValue('ma_upload', null);
            }}
          />
        </div>
      )}
    </section>
  );
};

export default UploadFooter;
