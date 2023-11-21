import React from 'react';
import { Box, Button } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { basicSchema } from './commentSchema';

const CommentForm = (props) => {
  const { t } = useTranslation();

  const onSubmit = (values, actions) => {
    props.handleSubmit(values);
    actions.resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        comment: '',
      },
      validationSchema: basicSchema,
      onSubmit,
    });

  return (
    <form onSubmit={handleSubmit}>
      <TextareaAutosize
        name="comment"
        onChange={handleChange}
        value={values.comment}
        aria-label="minimum height"
        minRows={3}
        placeholder={t('add_comment_placeholder')}
        onBlur={handleBlur}
        style={{ width: 500, padding: '5px' }}
      />
      {errors.comment && touched.comment && (
        <div style={{ color: 'red' }}>{errors.comment}</div>
      )}

      <Box sx={{ pt: 1 }}>
        <Button type="submit" variant="contained">
          {t('comment')}
        </Button>
      </Box>
    </form>
  );
};

export default CommentForm;
