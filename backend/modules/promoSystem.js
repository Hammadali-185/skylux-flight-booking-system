const crypto = require('crypto');

// In-memory storage for promo codes and gift cards (in production, use database)
const promoCodes = new Map();
const giftCards = new Map();
const usageHistory = new Map();

// Initialize some sample promo codes
const initializePromoCodes = () => {
  const samplePromoCodes = [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minAmount: 100,
      maxDiscount: 200,
      description: 'Welcome 10% off',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      usageLimit: 1000,
      usedCount: 0,
      isActive: true,
      applicableClasses: ['economy', 'premium', 'business', 'first'],
      applicableRoutes: ['all']
    },
    {
      code: 'SAVE50',
      type: 'fixed',
      value: 50,
      minAmount: 200,
      maxDiscount: 50,
      description: 'Save $50',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      usageLimit: 500,
      usedCount: 0,
      isActive: true,
      applicableClasses: ['economy', 'premium'],
      applicableRoutes: ['all']
    },
    {
      code: 'LUXURY20',
      type: 'percentage',
      value: 20,
      minAmount: 1000,
      maxDiscount: 500,
      description: 'Luxury 20% off',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      applicableClasses: ['business', 'first'],
      applicableRoutes: ['all']
    },
    {
      code: 'FIRSTCLASS',
      type: 'percentage',
      value: 15,
      minAmount: 2000,
      maxDiscount: 1000,
      description: 'First Class 15% off',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      usageLimit: 50,
      usedCount: 0,
      isActive: true,
      applicableClasses: ['first'],
      applicableRoutes: ['all']
    }
  ];

  samplePromoCodes.forEach(promo => {
    promoCodes.set(promo.code, promo);
  });
};

// Initialize sample data
initializePromoCodes();

// Promo System Functions
const promoSystem = {
  // Validate promo code
  validatePromoCode: (code, bookingDetails = {}) => {
    try {
      const promo = promoCodes.get(code.toUpperCase());
      if (!promo) {
        return {
          isValid: false,
          error: 'Invalid promo code'
        };
      }

      // Check if promo is active
      if (!promo.isActive) {
        return {
          isValid: false,
          error: 'Promo code is not active'
        };
      }

      // Check expiry
      const now = new Date();
      if (now < promo.validFrom || now > promo.validUntil) {
        return {
          isValid: false,
          error: 'Promo code has expired or is not yet valid'
        };
      }

      // Check usage limit
      if (promo.usedCount >= promo.usageLimit) {
        return {
          isValid: false,
          error: 'Promo code usage limit exceeded'
        };
      }

      // Check minimum amount
      if (bookingDetails.totalAmount && bookingDetails.totalAmount < promo.minAmount) {
        return {
          isValid: false,
          error: `Minimum amount of $${promo.minAmount} required for this promo code`
        };
      }

      // Check applicable travel classes
      if (bookingDetails.travelClass && 
          !promo.applicableClasses.includes('all') && 
          !promo.applicableClasses.includes(bookingDetails.travelClass)) {
        return {
          isValid: false,
          error: `Promo code not applicable for ${bookingDetails.travelClass} class`
        };
      }

      // Check applicable routes
      if (bookingDetails.route && 
          !promo.applicableRoutes.includes('all') && 
          !promo.applicableRoutes.includes(bookingDetails.route)) {
        return {
          isValid: false,
          error: 'Promo code not applicable for this route'
        };
      }

      return {
        isValid: true,
        promo: {
          code: promo.code,
          type: promo.type,
          value: promo.value,
          description: promo.description,
          minAmount: promo.minAmount,
          maxDiscount: promo.maxDiscount
        }
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  },

  // Apply promo code
  applyPromoCode: (code, bookingId, totalAmount) => {
    try {
      const validation = promoSystem.validatePromoCode(code, { totalAmount });
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const promo = validation.promo;
      let discount = 0;

      if (promo.type === 'percentage') {
        discount = Math.min((totalAmount * promo.value) / 100, promo.maxDiscount);
      } else if (promo.type === 'fixed') {
        discount = Math.min(promo.value, promo.maxDiscount);
      }

      // Round to 2 decimal places
      discount = Math.round(discount * 100) / 100;

      // Record usage
      const usage = {
        code: promo.code,
        bookingId,
        discount,
        appliedAt: new Date(),
        originalAmount: totalAmount,
        finalAmount: totalAmount - discount
      };

      // Store usage history
      if (!usageHistory.has(bookingId)) {
        usageHistory.set(bookingId, []);
      }
      usageHistory.get(bookingId).push(usage);

      // Update promo code usage count
      const promoData = promoCodes.get(code.toUpperCase());
      if (promoData) {
        promoData.usedCount += 1;
      }

      return {
        success: true,
        discount,
        promoDetails: {
          code: promo.code,
          description: promo.description,
          type: promo.type,
          value: promo.value,
          appliedDiscount: discount
        },
        usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check promo expiry
  checkPromoExpiry: (code) => {
    const promo = promoCodes.get(code.toUpperCase());
    if (!promo) {
      return {
        exists: false,
        error: 'Promo code not found'
      };
    }

    const now = new Date();
    const isExpired = now > promo.validUntil;
    const isNotYetValid = now < promo.validFrom;

    return {
      exists: true,
      isExpired,
      isNotYetValid,
      validFrom: promo.validFrom,
      validUntil: promo.validUntil,
      daysUntilExpiry: isExpired ? 0 : Math.ceil((promo.validUntil - now) / (1000 * 60 * 60 * 24))
    };
  },

  // Get discount amount
  getDiscountAmount: (code, totalFare, bookingDetails = {}) => {
    const validation = promoSystem.validatePromoCode(code, { ...bookingDetails, totalAmount: totalFare });
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        discount: 0
      };
    }

    const promo = validation.promo;
    let discount = 0;

    if (promo.type === 'percentage') {
      discount = Math.min((totalFare * promo.value) / 100, promo.maxDiscount);
    } else if (promo.type === 'fixed') {
      discount = Math.min(promo.value, promo.maxDiscount);
    }

    return {
      success: true,
      discount: Math.round(discount * 100) / 100,
      promoDetails: promo
    };
  },

  // Create new promo code
  createPromoCode: (promoData) => {
    try {
      const {
        code,
        type,
        value,
        minAmount = 0,
        maxDiscount = null,
        description,
        validFrom,
        validUntil,
        usageLimit = 1000,
        applicableClasses = ['all'],
        applicableRoutes = ['all']
      } = promoData;

      // Validate required fields
      if (!code || !type || !value || !description || !validFrom || !validUntil) {
        throw new Error('Missing required fields');
      }

      // Check if code already exists
      if (promoCodes.has(code.toUpperCase())) {
        throw new Error('Promo code already exists');
      }

      const newPromo = {
        code: code.toUpperCase(),
        type,
        value,
        minAmount,
        maxDiscount: maxDiscount || (type === 'fixed' ? value : value * 10),
        description,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        usageLimit,
        usedCount: 0,
        isActive: true,
        applicableClasses,
        applicableRoutes,
        createdAt: new Date()
      };

      promoCodes.set(newPromo.code, newPromo);

      return {
        success: true,
        promo: newPromo
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Gift Card Functions
  generateGiftCard: (amount, purchaserEmail, recipientEmail = null, message = '') => {
    try {
      const giftCardCode = promoSystem.generateGiftCardCode();
      const giftCard = {
        code: giftCardCode,
        originalAmount: amount,
        currentBalance: amount,
        purchaserEmail,
        recipientEmail: recipientEmail || purchaserEmail,
        message,
        isActive: true,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        usageHistory: []
      };

      giftCards.set(giftCardCode, giftCard);

      return {
        success: true,
        giftCard: {
          code: giftCardCode,
          amount,
          recipientEmail: giftCard.recipientEmail,
          expiryDate: giftCard.expiryDate
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate gift card code
  generateGiftCardCode: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'GC';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure code is unique
    if (giftCards.has(code)) {
      return promoSystem.generateGiftCardCode();
    }
    
    return code;
  },

  // Validate gift card
  validateGiftCard: (code) => {
    const giftCard = giftCards.get(code.toUpperCase());
    if (!giftCard) {
      return {
        isValid: false,
        error: 'Invalid gift card code'
      };
    }

    if (!giftCard.isActive) {
      return {
        isValid: false,
        error: 'Gift card is not active'
      };
    }

    if (new Date() > giftCard.expiryDate) {
      return {
        isValid: false,
        error: 'Gift card has expired'
      };
    }

    if (giftCard.currentBalance <= 0) {
      return {
        isValid: false,
        error: 'Gift card has no remaining balance'
      };
    }

    return {
      isValid: true,
      giftCard: {
        code: giftCard.code,
        currentBalance: giftCard.currentBalance,
        originalAmount: giftCard.originalAmount,
        expiryDate: giftCard.expiryDate
      }
    };
  },

  // Apply gift card
  applyGiftCard: (code, bookingId, amount) => {
    try {
      const validation = promoSystem.validateGiftCard(code);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const giftCard = giftCards.get(code.toUpperCase());
      const amountToUse = Math.min(amount, giftCard.currentBalance);

      // Update gift card balance
      giftCard.currentBalance -= amountToUse;

      // Record usage
      const usage = {
        bookingId,
        amountUsed: amountToUse,
        usedAt: new Date(),
        remainingBalance: giftCard.currentBalance
      };

      giftCard.usageHistory.push(usage);

      return {
        success: true,
        amountApplied: amountToUse,
        remainingBalance: giftCard.currentBalance,
        usage
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get gift card balance
  getGiftCardBalance: (code) => {
    const validation = promoSystem.validateGiftCard(code);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    return {
      success: true,
      balance: validation.giftCard.currentBalance,
      originalAmount: validation.giftCard.originalAmount,
      expiryDate: validation.giftCard.expiryDate
    };
  },

  // Get promo code usage statistics
  getPromoUsageStats: (code) => {
    const promo = promoCodes.get(code.toUpperCase());
    if (!promo) {
      return {
        success: false,
        error: 'Promo code not found'
      };
    }

    return {
      success: true,
      stats: {
        code: promo.code,
        description: promo.description,
        usedCount: promo.usedCount,
        usageLimit: promo.usageLimit,
        remainingUses: promo.usageLimit - promo.usedCount,
        usagePercentage: (promo.usedCount / promo.usageLimit) * 100,
        isActive: promo.isActive,
        validFrom: promo.validFrom,
        validUntil: promo.validUntil
      }
    };
  },

  // Get all active promo codes
  getActivePromoCodes: () => {
    const activePromos = [];
    const now = new Date();

    promoCodes.forEach(promo => {
      if (promo.isActive && 
          now >= promo.validFrom && 
          now <= promo.validUntil && 
          promo.usedCount < promo.usageLimit) {
        activePromos.push({
          code: promo.code,
          description: promo.description,
          type: promo.type,
          value: promo.value,
          minAmount: promo.minAmount,
          maxDiscount: promo.maxDiscount,
          validUntil: promo.validUntil,
          remainingUses: promo.usageLimit - promo.usedCount
        });
      }
    });

    return {
      success: true,
      promoCodes: activePromos
    };
  },

  // Deactivate promo code
  deactivatePromoCode: (code) => {
    const promo = promoCodes.get(code.toUpperCase());
    if (!promo) {
      return {
        success: false,
        error: 'Promo code not found'
      };
    }

    promo.isActive = false;
    promo.deactivatedAt = new Date();

    return {
      success: true,
      message: 'Promo code deactivated successfully'
    };
  },

  // Get usage history for booking
  getUsageHistory: (bookingId) => {
    const history = usageHistory.get(bookingId) || [];
    return {
      success: true,
      history
    };
  }
};

module.exports = promoSystem;


