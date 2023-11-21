import React from 'react';

const Alert = ({ error }) => {
  return (
    <div>
      {error && (
        <div className="alert alert-light" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Alert;
