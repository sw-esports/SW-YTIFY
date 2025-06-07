import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="alert alert-error mt-4">
      <FiAlertCircle className="h-5 w-5" />
      <div>
        <h3 className="font-semibold">Download Failed</h3>
        <div className="text-sm">{error}</div>
      </div>
    </div>
  );
};

export default ErrorMessage;
