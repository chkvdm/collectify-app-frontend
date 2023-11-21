import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Loader from '../../components/Loader';
import UsersTable from './UsersTable';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {loading ? <Loader /> : <UsersTable {...{ setLoading }} />}
    </QueryClientProvider>
  );
};

export default AdminPanel;
