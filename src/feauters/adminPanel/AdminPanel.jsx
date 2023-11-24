import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Loader from '../../components/Loader';
import UsersTable from './UsersTable';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = new QueryClient();

  return (
    <div className="main-container">
      <div className="container">
        <QueryClientProvider client={queryClient}>
          {loading ? <Loader /> : <UsersTable {...{ setLoading }} />}
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default AdminPanel;
