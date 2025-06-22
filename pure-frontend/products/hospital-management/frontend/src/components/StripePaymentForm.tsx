import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Paper,
} from '@mui/material';
import paymentService from '../services/payment';
// Component provides NCQ Payment Gateway integration with Stripe-compatible interface

interface StripePaymentFormProps {
  onPaymentMethodCreated: (paymentMethodId: string) => void;
  loading?: boolean;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  onPaymentMethodCreated,
  loading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  const cardElementRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);

  useEffect(() => {
    if (!paymentService.isInitialized()) {
      setError('Payment system is not available. Please try again later.');
      return;
    }

    const elements = paymentService.createElements();
    elementsRef.current = elements;

    const cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    cardElement.mount('#card-element');
    cardElementRef.current = cardElement;

    cardElement.on('change', (event: any) => {
      setCardComplete(event.complete);
      if (event.error) {
        setError(event.error.message);
      } else {
        setError(null);
      }
    });

    return () => {
      if (cardElement) {
        cardElement.destroy();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardElementRef.current || !cardComplete) {
      setError('Please enter valid card details');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const paymentMethod = await paymentService.createPaymentMethod(
        cardElementRef.current,
        billingDetails
      );
      
      onPaymentMethodCreated(paymentMethod.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred processing your payment');
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = () => {
    return (
      cardComplete &&
      billingDetails.name &&
      billingDetails.email &&
      billingDetails.address.line1 &&
      billingDetails.address.city &&
      billingDetails.address.state &&
      billingDetails.address.postal_code
    );
  };

  if (!paymentService.isInitialized()) {
    return (
      <Alert severity="error">
        Payment system is not available. Please try again later.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Card Information
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <div id="card-element" />
          </Paper>
        </Box>

        <TextField
          fullWidth
          label="Name on Card"
          value={billingDetails.name}
          onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
          required
          disabled={processing || loading}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={billingDetails.email}
          onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
          required
          disabled={processing || loading}
        />

        <Typography variant="subtitle2" gutterBottom>
          Billing Address
        </Typography>

        <TextField
          fullWidth
          label="Address"
          value={billingDetails.address.line1}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            address: { ...billingDetails.address, line1: e.target.value }
          })}
          required
          disabled={processing || loading}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="City"
            value={billingDetails.address.city}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, city: e.target.value }
            })}
            required
            disabled={processing || loading}
          />
          <TextField
            fullWidth
            label="State"
            value={billingDetails.address.state}
            onChange={(e) => setBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, state: e.target.value }
            })}
            required
            disabled={processing || loading}
          />
        </Stack>

        <TextField
          fullWidth
          label="ZIP Code"
          value={billingDetails.address.postal_code}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            address: { ...billingDetails.address, postal_code: e.target.value }
          })}
          required
          disabled={processing || loading}
        />

        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        <input
          type="submit"
          style={{ display: 'none' }}
          disabled={!isFormValid() || processing || loading}
        />
      </Stack>
    </form>
  );
};

export default StripePaymentForm;