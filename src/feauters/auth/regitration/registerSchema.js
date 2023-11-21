import * as yup from 'yup';

const passwordRules = /[a-zA-Z0-9!@#$%^&*]{1,16}$/;

export const registerSchema = yup.object().shape({
  name: yup.string().required('Please enter a name'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Please enter an email'),
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, {
      message:
        'Should include 8-16 characters, 1 letter, 1 number and 1 special character!',
    })
    .required('Please enter a password'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password must match')
    .required('Please confirm a password'),
});
