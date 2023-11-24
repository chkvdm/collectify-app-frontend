import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Formik, Form, Field, FieldArray } from 'formik';
import InputLabel from '@mui/material/InputLabel';
import { TextareaAutosize } from '@mui/base';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import collectionCreateSchema from './collectionCreateSchema';
import Alert from '../../components/Alert';
import PreviewImage from './PreviewImage';
import Loader from '../../components/Loader';
import config from '../../config';
import '../../css/formInput.css';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CreateCollectionForm = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    setLoading(true);
    try {
      Axios.get(`${config.apiBaseUrl}/api/v1/collections/themes`).then(
        (response) => {
          setThemes(response.data.themes || []);
          setLoading(false);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      Axios.get(`${config.apiBaseUrl}/api/v1/collections/types`).then(
        (response) => {
          setTypes(response.data.types || []);
          setLoading(false);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="collection-form">
          <h1>{t('create_new_collection')}</h1>
          <Alert error={props.error} />
          <Formik
            initialValues={{
              name: '',
              theme: '',
              image: '',
              description: '',
              optionalFields: [],
            }}
            validationSchema={collectionCreateSchema}
            onSubmit={(values, actions) => {
              props.handleSubmit(values);
              actions.resetForm();
            }}
          >
            {(props) => (
              <Form>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ mr: 2 }}>
                    <InputLabel htmlFor="name">
                      {t('collection_name')}
                    </InputLabel>
                    <Field
                      id="name"
                      type="text"
                      name="name"
                      placeholder={t('name_placeholder')}
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.errors.name && props.touched.name && (
                      <div style={{ color: 'red' }}>{props.errors.name}</div>
                    )}
                  </Box>
                  <Box sx={{ mr: 2 }}>
                    <InputLabel htmlFor="theme">{t('theme')}</InputLabel>
                    <Field
                      id="theme"
                      as="select"
                      name="theme"
                      value={props.values.theme}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      <option value="" disabled="disabled">
                        {t('theme_select')}
                      </option>
                      {themes.map((theme) => {
                        return (
                          <option key={theme.id} value={theme.theme}>
                            {theme.theme}
                          </option>
                        );
                      })}
                    </Field>
                    {props.errors.theme && props.touched.theme && (
                      <div style={{ color: 'red' }}>{props.errors.theme}</div>
                    )}
                  </Box>
                </Box>
                <Box>
                  <InputLabel htmlFor="description">
                    {t('description')}
                  </InputLabel>
                  <TextareaAutosize
                    id="description"
                    value={props.values.description}
                    onChange={props.handleChange}
                    placeholder={t('description_placeholder')}
                    style={{ height: '100px', width: '476px' }}
                    onBlur={props.handleBlur}
                  />
                  {props.errors.description && props.touched.description && (
                    <div style={{ color: 'red' }}>
                      {props.errors.description}
                    </div>
                  )}
                </Box>
                <Box>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2 }}
                  >
                    {t('upload_image')}
                    <VisuallyHiddenInput
                      onChange={(e) =>
                        props.setFieldValue('image', e.target.files[0])
                      }
                      id="image"
                      type="file"
                    />
                  </Button>
                  {props.values.image && (
                    <Box sx={{ display: 'flex', mt: 2 }}>
                      <PreviewImage target={{ files: [props.values.image] }} />
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ width: 30, height: 30 }}
                      >
                        <DeleteForeverIcon
                          onClick={() => props.setFieldValue('image', '')}
                        />
                      </Button>
                    </Box>
                  )}
                  {props.errors.image && props.touched.image && (
                    <div style={{ color: 'red' }}>{props.errors.image}</div>
                  )}
                </Box>
                <FieldArray
                  name="optionalFields"
                  render={(arrayHelpers) => (
                    <Box>
                      {props.values.optionalFields.map((field, index) => (
                        <Box key={index} sx={{ display: 'flex' }}>
                          <Field name={`optionalFields.${index}.name`}>
                            {({ field, meta }) => (
                              <Box sx={{ mr: 2 }}>
                                <InputLabel htmlFor="fieldName">
                                  {t('field_name')}
                                </InputLabel>
                                <input
                                  id="fieldName"
                                  placeholder={t('field_name_placeholder')}
                                  type="text"
                                  {...field}
                                />
                                {meta.touched && meta.error && (
                                  <div style={{ color: 'red' }}>
                                    {meta.error}
                                  </div>
                                )}
                              </Box>
                            )}
                          </Field>
                          <Field name={`optionalFields.${index}.type`}>
                            {({ field, meta }) => (
                              <Box sx={{ mr: 2 }}>
                                <InputLabel htmlFor="fieldType">
                                  {t('field_type')}
                                </InputLabel>
                                <select
                                  id="fieldType"
                                  value={field.value}
                                  {...field}
                                >
                                  <option value="" disabled="disabled">
                                    {t('type_select')}
                                  </option>
                                  {types.map((type) => {
                                    return (
                                      <option key={type.id} value={type.type}>
                                        {type.type}
                                      </option>
                                    );
                                  })}
                                </select>
                                {meta.touched && meta.error && (
                                  <div style={{ color: 'red' }}>
                                    {meta.error}
                                  </div>
                                )}
                              </Box>
                            )}
                          </Field>
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ width: 30, height: 30, mt: 6 }}
                          >
                            <DeleteForeverIcon
                              onClick={() => arrayHelpers.remove(index)}
                            />
                          </Button>
                        </Box>
                      ))}
                      <Box>
                        <Button
                          variant="contained"
                          onClick={() =>
                            arrayHelpers.push({ name: '', type: '' })
                          }
                          sx={{ mt: 2, mr: 2 }}
                        >
                          {t('add_item_fields')}
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mt: 2, mr: 2 }}
                          color="success"
                        >
                          {t('submit')}
                        </Button>
                      </Box>
                    </Box>
                  )}
                />
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CreateCollectionForm;
