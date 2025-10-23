import React from 'react';
import { Zap } from 'lucide-react';
import './TestDataHelper.css';

const TestDataHelper = ({ onFillTestData }) => {
  const fillTestData = () => {
    const testData = {
      cardholderName: 'John Doe',
      cardNumber: '1234 5678 9012 3456',
      expiryMonth: '12',
      expiryYear: '2029',
      cvv: '123'
    };
    onFillTestData(testData);
  };

  return (
    <div className="test-data-helper">
      <div className="test-data-header">
        <Zap size={16} />
        <span>Testing Mode</span>
      </div>
      <p className="test-data-description">
        For testing purposes, you can use any dummy data. Click below to auto-fill test data:
      </p>
      <button 
        className="test-data-btn"
        onClick={fillTestData}
      >
        Fill Test Data
      </button>
      <div className="test-data-examples">
        <strong>Or use any of these:</strong>
        <ul>
          <li>Card Number: Any 16 digits (e.g., 1234 5678 9012 3456)</li>
          <li>Name: Any name (e.g., John Doe, Jane Smith)</li>
          <li>Expiry: Any future date (e.g., 12/2029)</li>
          <li>CVV: Any 3-4 digits (e.g., 123, 4567)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDataHelper;
