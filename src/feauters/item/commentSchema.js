import * as yup from 'yup';

export const basicSchema = yup.object().shape({
  comment: yup.string().min(1).max(500).required('comment can not be empty'),
});
