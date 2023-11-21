import * as yup from 'yup';

const validFileExtensions = {
  image: ['jpg', 'png', 'jpeg'],
};

function isValidFileType(fileName, fileType) {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
  );
}

const MAX_FILE_SIZE = 1024000;

const collectionCreateSchema = yup.object().shape({
  name: yup.string().required('Please enter a name'),
  theme: yup.string().required('Please choose a theme'),
  description: yup
    .string()
    .min(50)
    .max(1000)
    .required('Please enter a description'),
  image: yup
    .mixed()
    .test('is-valid-type', 'Not a valid image type', (value) => {
      if (value) {
        return isValidFileType(value && value.name.toLowerCase(), 'image');
      }
      return true;
    })
    .test('is-valid-size', 'Max allowed size is 1024KB', (value) => {
      if (value) {
        return value && value.size <= MAX_FILE_SIZE;
      }
      return true;
    }),
  optionalFields: yup.array().of(
    yup.object().shape({
      name: yup.string().min(1).max(20).required('Please enter a field name'),
      type: yup.string().required('Please enter a field type'),
    })
  ),
});

export default collectionCreateSchema;
