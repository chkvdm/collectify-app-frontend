import React from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { registerSchema } from './registerSchema';
import Alert from '../../../components/Alert';

const RegistrationForm = (props) => {
  const { t } = useTranslation();

  const onSubmit = (values, actions) => {
    props.handleSubmit(values);
    actions.resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validationSchema: registerSchema,
      onSubmit,
    });

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>{t('welcome')}</h1>

      <Alert error={props.error} />

      <label htmlFor="name">Name</label>
      <input
        value={values.name}
        onChange={handleChange}
        id="name"
        type="text"
        placeholder="Enter your name..."
        onBlur={handleBlur}
      />
      {errors.name && touched.name && (
        <div style={{ color: 'red' }}>{errors.name}</div>
      )}

      <label htmlFor="email">Email</label>
      <input
        value={values.email}
        onChange={handleChange}
        id="email"
        type="email"
        placeholder="Enter your email..."
        onBlur={handleBlur}
      />
      {errors.email && touched.email && (
        <div style={{ color: 'red' }}>{errors.email}</div>
      )}

      <label htmlFor="password">Password</label>
      <input
        value={values.password}
        onChange={handleChange}
        id="password"
        type="password"
        placeholder="Enter your password..."
        onBlur={handleBlur}
      />
      {errors.password && touched.password && (
        <div style={{ color: 'red' }}>{errors.password}</div>
      )}

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        value={values.confirmPassword}
        onChange={handleChange}
        id="confirmPassword"
        type="password"
        placeholder="Confirm password..."
        onBlur={handleBlur}
      />
      {errors.confirmPassword && touched.confirmPassword && (
        <div style={{ color: 'red' }}>{errors.confirmPassword}</div>
      )}

      <Box sx={{ pt: 1 }}>
        <Button type="submit" variant="contained">
          {t('submit')}
        </Button>
      </Box>

      <h6>
        {` ${t('have_account')}`}
        <a href="/login">{` ${t('log_in')}`}</a>
      </h6>
    </form>
  );
};

export default RegistrationForm;
