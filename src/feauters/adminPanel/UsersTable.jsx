import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import { usersData, role, status } from './makeData';
import config from '../../config';

const UsersTable = (props) => {
  const [editedUsers, setEditedUsers] = useState({});

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 300,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableEditing: false,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableEditing: false,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        editVariant: 'select',
        editSelectOptions: role,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) =>
            setEditedUsers({
              ...editedUsers,
              [row.id]: { ...row.original, role: event.target.value },
            }),
        }),
      },

      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        editSelectOptions: status,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          onChange: (event) =>
            setEditedUsers({
              ...editedUsers,
              [row.id]: { ...row.original, status: event.target.value },
            }),
        }),
      },
    ],
    [editedUsers]
  );

  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();

  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    useUpdateUsers();

  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //UPDATE action
  const handleSaveUsers = async () => {
    props.setLoading(true);
    const token = localStorage.getItem('collectify:token');
    const userInfo = decodeToken(token);
    if (
      editedUsers[userInfo.id] &&
      (editedUsers[userInfo.id]?.status !== 'active' ||
        editedUsers[userInfo.id]?.role !== 'admin')
    ) {
      navigate('/');
      await updateUsers(Object.values(editedUsers));
      localStorage.removeItem('collectify:token');
      localStorage.setItem('collectify:logged_in', 'NOT_LOGGED_IN');
      setEditedUsers({});
      navigate(0);
    }
    await updateUsers(Object.values(editedUsers));
    setEditedUsers({});
    props.setLoading(false);
  };

  //DELETE action
  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      props.setLoading(true);
      const token = localStorage.getItem('collectify:token');
      const userInfo = decodeToken(token);
      if (row.original.id === userInfo.id) {
        navigate('/');
        await deleteUser(row.original.id);
        localStorage.removeItem('collectify:token');
        localStorage.setItem('collectify:logged_in', 'NOT_LOGGED_IN');
        navigate(0);
      }
      await deleteUser(row.original.id);
      props.setLoading(false);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row',
    editDisplayMode: 'cell',
    enableEditing: true,
    enableRowActions: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
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

    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="show">
          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/admin-panel/users/user/account/${row.id}`)
            }
          >
            <PreviewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveUsers}
          disabled={Object.keys(editedUsers).length === 0}
        >
          {isUpdatingUsers ? <CircularProgress size={25} /> : 'Save'}
        </Button>
      </Box>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//READ hook (get users from api)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await usersData();
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (users) => {
      const update = async () => {
        const token = localStorage.getItem('collectify:token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        try {
          await Axios.put(
            `${config.apiBaseUrl}/api/v1/admin/users`,
            { users },
            { headers }
          );
        } catch (err) {
          console.error(err);
          throw err;
        }
      };

      const result = await update();
      return result;
    },
    onMutate: (newUsers) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((user) => {
          const newUser = newUsers.find((u) => u.id === user.id);
          return newUser ? newUser : user;
        })
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

//DELETE hook
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const deleteItem = async () => {
        const token = localStorage.getItem('collectify:token');
        try {
          await Axios.delete(`${config.apiBaseUrl}/api/v1/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: function (status) {
              return status < 500;
            },
            data: {
              id: userId,
            },
          });
        } catch (err) {
          console.error(err);
          throw err;
        }
      };
      await deleteItem();
    },
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export default UsersTable;
