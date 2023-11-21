import Axios from 'axios';
import _ from 'lodash';
import config from '../../config';

export const getItemData = async (itemId) => {
  try {
    const response = await Axios.get(
      `${config.apiBaseUrl}/api/v1/collections/get-item-data/${itemId}`
    );
    const data = response.data.item;

    const newItem = {
      item: {
        id: data.id,
        itemName: data.itemName,
        tags: _.join(data.tags, ' '),
        likes: [...data.likes.map((item) => item.fromUser)],
      },
      collectionName: response.data.item.collection.collectionName,
    };

    data.optional_field_values.forEach((optField) => {
      newItem.item[optField.fieldName] = optField.value;
    });
    return newItem;
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
      id: 'text',
      itemName: 'text',
      tags: 'text',
    };
    data.typesAndNames.forEach((el) => {
      newTypes[el.fieldName] = el.fieldType;
    });
    return newTypes;
  } catch (err) {
    console.error(err);
  }
};
