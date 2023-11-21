import { useMemo, useState, useEffect } from 'react';
import { Box, Button, Checkbox, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/Loader';
import { getItemData, allTypes } from './makeData';
import config from '../../config';

const token = localStorage.getItem('collectify:token') || false;
let userInfo;
if (token) userInfo = decodeToken(token);

const ItemsTable = (props) => {
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [types, setTypes] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function fetchTypes() {
      const fetchedTypes = await allTypes(props.collectionId);
      setTypes(fetchedTypes);
      setLoading(false);
    }
    fetchTypes();
  }, [props.collectionId]);

  useEffect(() => {
    setLoading(true);
    async function renderField() {
      const visibility = Object.entries(types).reduce((acc, [key, value]) => {
        if (value !== 'string' && value !== 'date') {
          return { ...acc, [key]: false };
        }
        return acc;
      }, {});
      setColumnVisibility(visibility);
      setLoading(false);
    }
    renderField();
  }, [types]);

  const columns = useMemo(() => {
    return Object.entries(types).map(([k, v]) => {
      if (k === 'id') {
        return {
          accessorKey: 'id',
          header: 'id',
          enableEditing: false,
          enableHiding: false,
          size: 220,
        };
      }
      if (k === 'itemName') {
        return {
          accessorKey: 'itemName',
          header: 'name',
          enableHiding: false,
          size: 'auto',
          muiEditTextFieldProps: {
            required: true,
            defaultValue: k,
            error: !!validationErrors?.[k],
            helperText: validationErrors?.[k],
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                [k]: undefined,
              }),
          },
        };
      }
      if (k === 'tags') {
        return {
          accessorKey: 'tags',
          header: 'tags',
          size: 'auto',
          muiEditTextFieldProps: {
            required: true,
            defaultValue: k,
            error: !!validationErrors?.[k],
            helperText: validationErrors?.[k],
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                [k]: undefined,
              }),
          },
        };
      }
      if (v === 'date') {
        return {
          accessorKey: k,
          header: k,
          size: 'auto',
          editVariant: 'date',
          muiEditTextFieldProps: {
            required: true,
            type: 'date',
            defaultValue: k,
            error: !!validationErrors?.[k],
            helperText: validationErrors?.[k],
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                [k]: undefined,
              }),
          },
        };
      }
      if (v === 'number') {
        return {
          accessorKey: k,
          header: k,
          size: 'auto',
          editVariant: 'number',
          muiEditTextFieldProps: {
            required: true,
            type: 'number',
            defaultValue: k,
            error: !!validationErrors?.[k],
            helperText: validationErrors?.[k],
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                [k]: undefined,
              }),
          },
        };
      }
      if (v === 'checkbox') {
        return {
          accessorKey: k,
          header: k,
          size: 'auto',
          editVariant: 'select',
          editSelectOptions: ['yes', 'no'],
          muiEditTextFieldProps: {
            required: true,
            defaultValue: k,
            error: !!validationErrors?.[k],
            helperText: validationErrors?.[k],
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                [k]: undefined,
              }),
          },
          Cell: ({ cell }) => {
            const cellValue = cell.getValue();
            if (cellValue === 'yes') {
              return <Checkbox disabled checked={true} />;
            }
            return <Checkbox disabled checked={false} />;
          },
        };
      }
      if (v === 'string' || v === 'text') {
        return {
          accessorKey: k,
          header: k,
          size: 'auto',
          editVariant: 'text',
          muiEditTextFieldProps: {
            required: true,
            type: 'text',
            defaultValue: k,
            error: !!validationErrors?.[k],
            helperText: validationErrors?.[k],
            onFocus: () =>
              setValidationErrors({
                ...validationErrors,
                [k]: undefined,
              }),
          },
        };
      }
      return null;
    });
  }, [types, validationErrors]);

  //call CREATE hook Item
  const { mutateAsync: createItem, isPending: isCreatingItem } = useCreateItem(
    props.collectionId
  );
  //call READ hook
  const {
    data: fetchedItems = [],
    isError: isLoadingItemsError,
    isFetching: isFetchingItems,
    isLoading: isLoadingItems,
  } = useGetItems(props.collectionId);
  //call UPDATE hook
  const { mutateAsync: updateItem, isPending: isUpdatingItem } =
    useUpdateItem();
  //call DELETE hook
  const { mutateAsync: deleteItem, isPending: isDeletingItem } =
    useDeleteItem();

  //CREATE action
  const handleCreateItem = async ({ values, table }) => {
    const newValidationErrors = validateItem(values);
    if (
      Object.values(newValidationErrors).some((error) => {
        return error;
      })
    ) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createItem(values);
    table.setCreatingRow(null);
  };

  //UPDATE action
  const handleSaveItem = async ({ values, table }) => {
    const newValidationErrors = validateItem(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateItem(values);
    table.setEditingRow(null);
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    const options = {
      message: 'Delete item?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteItem(row.original.id),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      keyCodeForClose: [8, 32],
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypress: () => {},
      onKeypressEscape: () => {},
      overlayClassName: 'overlay-custom-class-name',
    };
    confirmAlert(options);
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedItems,
    onColumnVisibilityChange: setColumnVisibility,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingItemsError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateItem,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveItem,
    renderRowActions: ({ row, table }) => (
      <div>
        {userInfo?.id === props.userId || token?.role === 'admin' ? (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => openDeleteConfirmModal(row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="secondary"
                onClick={() => table.setEditingRow(row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="show">
              <IconButton
                color="primary"
                onClick={() => navigate(`./item/${row.id}`)}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box>
            <Tooltip title="show">
              <IconButton
                color="primary"
                onClick={() => navigate(`./item/${row.id}`)}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <div>
        {userInfo?.id === props.userId || token?.role === 'admin' ? (
          <Button
            variant="contained"
            onClick={() => {
              table.setCreatingRow(true);
            }}
          >
            Create New Item
          </Button>
        ) : (
          <Box></Box>
        )}
      </div>
    ),
    state: {
      isLoading: isLoadingItems,
      isSaving: isCreatingItem || isUpdatingItem || isDeletingItem,
      showAlertBanner: isLoadingItemsError,
      showProgressBars: isFetchingItems,
      columnVisibility: columnVisibility,
    },
  });

  // const columnVirtualizerInstanceRef = useRef(null); // что-то для горизонтального скрола

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <MaterialReactTable
          table={table}
          // columnVirtualizerInstanceRef={columnVirtualizerInstanceRef}
          // columnVirtualizerOptions={{ overscan: 4 }}
          enableColumnVirtualization
          enableColumnPinning
        />
      )}
    </div>
  );
};

//CREATE hook
function useCreateItem(collectionId) {
  const queryClient = useQueryClient();
  // const { collectionId } = useParams();
  return useMutation({
    mutationFn: async (item) => {
      const newItem = async () => {
        const token = localStorage.getItem('collectify:token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        try {
          const response = await Axios.post(
            `${config.apiBaseUrl}/api/v1/collections/new-item/${collectionId}`,
            {
              item,
            },
            {
              headers,
            }
          );
          return response.data;
        } catch (err) {
          console.error(err);
          throw err;
        }
      };
      const result = await newItem();
      return result;
    },
    onMutate: (newItemInfo) => {
      queryClient.setQueryData(['items'], (prevItems) => [
        ...prevItems,
        {
          ...newItemInfo,
        },
      ]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}

// READ hook
function useGetItems(collectionId) {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      return await getItemData(collectionId);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook
function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item) => {
      const update = async () => {
        const token = localStorage.getItem('collectify:token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        try {
          const response = await Axios.put(
            `${config.apiBaseUrl}/api/v1/collections/item-update`,
            {
              item,
            },
            {
              headers,
            }
          );
          return response.data;
        } catch (err) {
          console.error(err);
          throw err;
        }
      };
      const result = await update();
      return result;
    },
    onMutate: (newItemInfo) => {
      queryClient.setQueryData(['items'], (prevItems) =>
        prevItems?.map((prevItem) =>
          prevItem.id === newItemInfo.id ? newItemInfo : prevItem
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  });
}

//DELETE hook
function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId) => {
      const deleteItem = async () => {
        const token = localStorage.getItem('collectify:token');
        try {
          const response = Axios.delete(
            `${config.apiBaseUrl}/api/v1/collections/delete-item`,
            {
              headers: { Authorization: `Bearer ${token}` },
              validateStatus: function (status) {
                return status < 500;
              },
              data: {
                id: itemId,
              },
            }
          );
          return response.data;
        } catch (err) {
          console.error(err);
          throw err;
        }
      };
      const result = await deleteItem();
      return result;
    },
    onMutate: (userId) => {
      queryClient.setQueryData(['items'], (prevItems) =>
        prevItems?.filter((item) => item.id !== userId)
      );
    },
  });
}

const validateRequired = (value) => !!value.length;
const validateTags = (tags) =>
  !!tags.length &&
  tags.toLowerCase().match(/^#[a-zA-Z0-9]+(?: \s*#[a-zA-Z0-9]+)*$/);

function validateItem(item) {
  const errors = Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key,
      key === 'id'
        ? ''
        : key === 'tags'
        ? validateTags(value)
          ? ''
          : 'Invalid tags format. ex: #foo #bar'
        : !validateRequired(value)
        ? `Field is Required, ${key}`
        : '',
    ])
  );
  return errors;
}

const queryClient = new QueryClient();

const Items = (props) => (
  <QueryClientProvider client={queryClient}>
    <ItemsTable {...props} />
  </QueryClientProvider>
);

export default Items;
