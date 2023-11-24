import React from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { loginSchema } from './loginSchema';
import '../../../css/formInput.css';
import Alert from '../../../components/Alert';

const LoginForm = (props) => {
  const { t } = useTranslation();

  const onSubmit = async (values, actions) => {
    props.handleSubmit(values);
    actions.resetForm();
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: loginSchema,
      onSubmit,
    });

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>{t('welcome')}</h1>

      <Alert error={props.error} />

      <label htmlFor="email">{t('email')}</label>
      <input
        value={values.email}
        onChange={handleChange}
        id="email"
        type="email"
        placeholder={t('enter_email')}
        onBlur={handleBlur}
      />
      {errors.email && touched.email && (
        <div style={{ color: 'red' }}>{errors.email}</div>
      )}

      <label htmlFor="password">{t('password')}</label>
      <input
        value={values.password}
        onChange={handleChange}
        id="password"
        type="password"
        placeholder={t('enter_password')}
        onBlur={handleBlur}
      />
      {errors.password && touched.password && (
        <div style={{ color: 'red' }}>{errors.password}</div>
      )}

      <Box sx={{ pt: 1 }}>
        <Button type="submit" variant="contained">
          {t('Log_in')}
        </Button>
      </Box>

      <h6>
        {t('not_account')}
        <a href="/registration">{` ${t('sign_in')}`}</a>
      </h6>
    </form>
  );
};

export default LoginForm;
