import Axios from 'axios';
import _ from 'lodash';

import config from '../../config';

export const getItemData = async (collectionId) => {
  try {
    const response = await Axios.get(
      `${config.apiBaseUrl}/api/v1/collections/collection-item-data/${collectionId}`
    );
    const transformedObject = [];
    response.data.items.forEach((item) => {
      const newItem = {
        id: item.id,
        itemName: item.itemName,
        tags: _.join(item.tags, ' '),
      };
      item.optional_field_values.forEach((optField) => {
        newItem[optField.fieldName] = optField.value;
      });
      transformedObject.push(newItem);
    });
    return transformedObject;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const allTypes = async (collectionId) => {
  try {
    const response = await Axios.get(
      `${config.apiBaseUrl}/api/v1/collections/collection-item-header/${collectionId}`
    );
    const data = response.data;
    const newTypes = {
      id: 'string',
      itemName: 'string',
      tags: 'string',
    };
    data.typesAndNames.forEach((el) => {
      newTypes[el.fieldName] = el.fieldType;
    });
    return newTypes;
  } catch (err) {
    console.error(err);
  }
};
