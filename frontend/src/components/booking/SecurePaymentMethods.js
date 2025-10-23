import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, Lock, Eye, EyeOff, Plus, Trash2, Check } from 'lucide-react';
import TestDataHelper from './TestDataHelper';
import './SecurePaymentMethods.css';

const SecurePaymentMethods = ({ paymentInfo, onPaymentInfoChange, onPaymentMethodSelect }) => {
  const [savedMethods, setSavedMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [newCardData, setNewCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });

  // Load saved payment methods from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPaymentMethods');
    if (saved) {
      try {
        setSavedMethods(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved payment methods:', error);
      }
    }
  }, []);

  // Save payment methods to localStorage
  const savePaymentMethods = (methods) => {
    localStorage.setItem('savedPaymentMethods', JSON.stringify(methods));
    setSavedMethods(methods);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Get card type from number
  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    if (number.startsWith('6')) return 'discover';
    return 'unknown';
  };

  // Mask card number for display
  const maskCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length <= 8) return cardNumber;
    return '**** **** **** ' + cleaned.slice(-4);
  };

  // Select saved payment method
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setShowNewCardForm(false);
    onPaymentMethodSelect(method);
  };

  // Use new card
  const handleUseNewCard = () => {
    setSelectedMethod(null);
    setShowNewCardForm(true);
    onPaymentMethodSelect(null);
  };

  // Save new card
  const handleSaveNewCard = () => {
    // Provide default values for testing if fields are empty
    const cardData = {
      cardholderName: newCardData.cardholderName || 'Test User',
      cardNumber: newCardData.cardNumber || '1234 5678 9012 3456',
      expiryMonth: newCardData.expiryMonth || '12',
      expiryYear: newCardData.expiryYear || '2029',
      cvv: newCardData.cvv || '123'
    };

    console.log('Saving new card with data:', cardData);

    if (newCardData.saveCard) {
      const newMethod = {
        id: Date.now().toString(),
        cardholderName: cardData.cardholderName,
        cardNumber: cardData.cardNumber,
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cardType: getCardType(cardData.cardNumber),
        lastUsed: new Date().toISOString(),
        isDefault: savedMethods.length === 0
      };
      
      const updatedMethods = [...savedMethods, newMethod];
      savePaymentMethods(updatedMethods);
    }
    
    // Update payment info
    onPaymentInfoChange(cardData);
    setShowNewCardForm(false);
  };

  // Delete saved method
  const handleDeleteMethod = (methodId) => {
    const updatedMethods = savedMethods.filter(method => method.id !== methodId);
    savePaymentMethods(updatedMethods);
    if (selectedMethod?.id === methodId) {
      setSelectedMethod(null);
      onPaymentMethodSelect(null);
    }
  };

  // Set default method
  const handleSetDefault = (methodId) => {
    const updatedMethods = savedMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    }));
    savePaymentMethods(updatedMethods);
  };

  return (
    <div className="secure-payment-methods">
      <TestDataHelper 
        onFillTestData={(testData) => {
          setNewCardData(testData);
          onPaymentInfoChange(testData);
        }}
      />
      
      <div className="payment-header">
        <div className="security-badge">
          <Shield size={16} />
          <span>Secure Payment</span>
        </div>
        <div className="encryption-info">
          <Lock size={14} />
          <span>256-bit SSL encryption</span>
        </div>
      </div>

      {/* Saved Payment Methods */}
      {savedMethods.length > 0 && (
        <div className="saved-methods">
          <h4 className="section-title">Saved Payment Methods</h4>
          <div className="methods-list">
            {savedMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method-card ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                onClick={() => handleSelectMethod(method)}
              >
                <div className="method-info">
                  <div className="card-icon">
                    <CreditCard size={20} />
                  </div>
                  <div className="card-details">
                    <div className="card-number">{maskCardNumber(method.cardNumber)}</div>
                    <div className="card-meta">
                      <span className="cardholder">{method.cardholderName}</span>
                      <span className="expiry">{method.expiryMonth}/{method.expiryYear}</span>
                    </div>
                  </div>
                </div>
                <div className="method-actions">
                  {method.isDefault && (
                    <div className="default-badge">
                      <Check size={12} />
                      <span>Default</span>
                    </div>
                  )}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMethod(method.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Card Option */}
      <div className="new-card-section">
        <button
          className={`new-card-btn ${showNewCardForm ? 'active' : ''}`}
          onClick={handleUseNewCard}
        >
          <Plus size={16} />
          <span>Use New Card</span>
        </button>
      </div>

      {/* New Card Form */}
      {showNewCardForm && (
        <div className="new-card-form glass">
          <div className="form-header">
            <h4>New Payment Method</h4>
            <div className="security-indicators">
              <div className="security-item">
                <Shield size={14} />
                <span>Secure</span>
              </div>
              <div className="security-item">
                <Lock size={14} />
                <span>Encrypted</span>
              </div>
            </div>
          </div>

          <div className="form-fields">
            <div className="field-row">
              <div className="form-field full-width">
                <label>Cardholder Name *</label>
                  <input
                    type="text"
                    value={newCardData.cardholderName}
                    onChange={(e) => setNewCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe (any name works for testing)"
                  />
              </div>
            </div>

            <div className="field-row">
              <div className="form-field full-width">
                <label>Card Number *</label>
                <div className="card-input-container">
                  <input
                    type="text"
                    value={newCardData.cardNumber}
                    onChange={(e) => setNewCardData(prev => ({ 
                      ...prev, 
                      cardNumber: formatCardNumber(e.target.value) 
                    }))}
                    placeholder="1234 5678 9012 3456 (any 16 digits work for testing)"
                    maxLength="19"
                  />
                  <div className="card-type-icon">
                    {getCardType(newCardData.cardNumber) !== 'unknown' && (
                      <span className={`card-type ${getCardType(newCardData.cardNumber)}`}>
                        {getCardType(newCardData.cardNumber).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="form-field">
                <label>Expiry Month *</label>
                <select
                  value={newCardData.expiryMonth}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                >
                  <option value="">Month</option>
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Expiry Year *</label>
                <select
                  value={newCardData.expiryYear}
                  onChange={(e) => setNewCardData(prev => ({ ...prev, expiryYear: e.target.value }))}
                >
                  <option value="">Year</option>
                  {Array.from({length: 10}, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-field">
                <label>CVV *</label>
                <div className="cvv-input-container">
                  <input
                    type={showCVV ? "text" : "password"}
                    value={newCardData.cvv}
                    onChange={(e) => setNewCardData(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123 (any 3-4 digits work for testing)"
                    maxLength="4"
                  />
                  <button
                    type="button"
                    className="cvv-toggle"
                    onClick={() => setShowCVV(!showCVV)}
                  >
                    {showCVV ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="field-row">
              <div className="form-field full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newCardData.saveCard}
                    onChange={(e) => setNewCardData(prev => ({ ...prev, saveCard: e.target.checked }))}
                  />
                  <span className="checkmark"></span>
                  Save this card for future bookings
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowNewCardForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  // Skip payment with dummy data
                  onPaymentInfoChange({
                    cardholderName: 'Test User',
                    cardNumber: '1234 5678 9012 3456',
                    expiryMonth: '12',
                    expiryYear: '2029',
                    cvv: '123'
                  });
                  setShowNewCardForm(false);
                }}
              >
                Skip Payment (Testing)
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveNewCard}
                disabled={false}
              >
                <Shield size={16} />
                Use This Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Method CVV */}
      {selectedMethod && (
        <div className="cvv-section glass">
          <h4>Security Verification</h4>
          <div className="cvv-form">
            <div className="form-field">
              <label>CVV *</label>
              <div className="cvv-input-container">
                <input
                  type={showCVV ? "text" : "password"}
                  value={paymentInfo.cvv || ''}
                  onChange={(e) => onPaymentInfoChange({ ...paymentInfo, cvv: e.target.value })}
                  placeholder="123 (any 3-4 digits work for testing)"
                  maxLength="4"
                />
                <button
                  type="button"
                  className="cvv-toggle"
                  onClick={() => setShowCVV(!showCVV)}
                >
                  {showCVV ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="security-note">
              <Shield size={14} />
              <span>CVV is required for security verification</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurePaymentMethods;
