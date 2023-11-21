import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Formik, Form, Field, FieldArray } from 'formik';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import collectionCreateSchema from './collectionCreateSchema';
import Alert from '../../components/Alert';
import PreviewImage from './PreviewImage';
import Loader from '../../components/Loader';
import config from '../../config';

// const themes = [
//   'Nature',
//   'Vintage',
//   'Tech',
//   'Fashion',
//   'Travel',
//   'Books',
//   'Foodie',
//   'Art',
//   'Music',
//   'Sports',
//   'Other',
// ];

// const types = ['date', 'checkbox', 'number', 'string', 'text'];

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
        <div>
          <h1>{t('create_new_collection')}</h1>
          <Alert error={props.error} />
          <Formik
            initialValues={{
              name: '',
              theme: themes[0]?.theme,
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
                <div>
                  <label htmlFor="name">{t('collection_name')}</label>
                  <input
                    id="name"
                    placeholder={t('name_placeholder')}
                    type="text"
                    value={props.values.name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  {props.errors.name && props.touched.name && (
                    <div style={{ color: 'red' }}>{props.errors.name}</div>
                  )}

                  <label htmlFor="theme">{t('theme')}</label>
                  <select
                    id="theme"
                    value={props.values.theme}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  >
                    {themes.map((theme) => {
                      return (
                        <option key={theme.id} value={theme.theme}>
                          {theme.theme}
                        </option>
                      );
                    })}
                  </select>
                  {props.errors.theme && props.touched.theme && (
                    <div style={{ color: 'red' }}>{props.errors.theme}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="description">{t('description')}</label>
                  <textarea
                    id="description"
                    value={props.values.description}
                    onChange={props.handleChange}
                    placeholder={t('description_placeholder')}
                    style={{ height: '100px', width: '300px' }}
                    onBlur={props.handleBlur}
                  ></textarea>
                  {props.errors.description && props.touched.description && (
                    <div style={{ color: 'red' }}>
                      {props.errors.description}
                    </div>
                  )}
                </div>
                <div>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
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
                    <div>
                      <PreviewImage target={{ files: [props.values.image] }} />
                      <Button variant="outlined" color="error">
                        <DeleteForeverIcon
                          onClick={() => props.setFieldValue('image', '')}
                        />
                      </Button>
                    </div>
                  )}
                  {props.errors.image && props.touched.image && (
                    <div style={{ color: 'red' }}>{props.errors.image}</div>
                  )}
                </div>

                <FieldArray
                  name="optionalFields"
                  render={(arrayHelpers) => (
                    <div>
                      {props.values.optionalFields.map((field, index) => (
                        <div key={index}>
                          <Field name={`optionalFields.${index}.name`}>
                            {({ field, meta }) => (
                              <div>
                                <label htmlFor="fieldName">
                                  {t('field_name')}
                                </label>
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
                              </div>
                            )}
                          </Field>
                          <Field name={`optionalFields.${index}.type`}>
                            {({ field, meta }) => (
                              <div>
                                <label htmlFor="fieldType">
                                  {t('field_type')}
                                </label>
                                <select
                                  id="fieldType"
                                  value={field.value}
                                  {...field}
                                >
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
                              </div>
                            )}
                          </Field>
                          <Button variant="outlined" color="error">
                            <DeleteForeverIcon
                              onClick={() => arrayHelpers.remove(index)}
                            />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="contained"
                        onClick={() =>
                          arrayHelpers.push({ name: '', type: types[0]?.type })
                        }
                      >
                        {t('add_item_fields')}
                      </Button>
                      <Button type="submit" variant="contained">
                        {t('submit')}
                      </Button>
                    </div>
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
