import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Paper,
} from '@mui/material'
import {
  Add,
  CreditCard,
  Delete,
  Star,
  StarBorder,
} from '@mui/icons-material'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { AppDispatch, RootState } from '../store'
import {
  fetchPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from '../store/slices/paymentSlice'
import paymentService from '../services/paymentService'

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
}

const AddPaymentMethodForm: React.FC<{
  onSuccess: () => void
  onCancel: () => void
}> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create setup intent
      const { clientSecret } = await paymentService.createSetupIntent()

      // Confirm setup intent
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        setError(error.message || 'Failed to add payment method')
      } else if (setupIntent?.payment_method) {
        // Add payment method to backend
        await dispatch(addPaymentMethod({
          stripePaymentMethodId: setupIntent.payment_method.id,
        })).unwrap()
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Card Details
        </Typography>
        <CardElement options={cardElementOptions} />
      </Paper>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </Box>
    </Box>
  )
}

const PaymentMethods: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { paymentMethods, loading, error } = useSelector(
    (state: RootState) => state.payments
  )

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchPaymentMethods())
  }, [dispatch])

  const handleSetDefault = async (id: string) => {
    try {
      await dispatch(setDefaultPaymentMethod(id)).unwrap()
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removePaymentMethod(id)).unwrap()
      setDeleteConfirm(null)
    } catch (error) {
      // Error handled by Redux slice
    }
  }

  const handleAddSuccess = () => {
    setShowAddDialog(false)
    dispatch(fetchPaymentMethods())
  }

  const getCardBrand = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'Visa'
      case 'mastercard':
        return 'Mastercard'
      case 'amex':
        return 'American Express'
      case 'discover':
        return 'Discover'
      default:
        return brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  }

  if (loading && paymentMethods.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Payment Methods
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddDialog(true)}
        >
          Add Payment Method
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CreditCard sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Payment Methods
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Add a payment method to ensure uninterrupted service and easy billing.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
            >
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} sm={6} md={4} key={method.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="h6">
                        {method.type === 'card' ? getCardBrand(method.brand || '') : method.type}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      {method.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                    </Box>
                  </Box>

                  {method.type === 'card' && (
                    <Typography variant="body1" gutterBottom>
                      •••• •••• •••• {method.last4}
                    </Typography>
                  )}

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Expires: {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Added: {new Date(method.createdAt).toLocaleDateString()}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <IconButton
                      onClick={() => handleSetDefault(method.id)}
                      disabled={method.isDefault}
                      title={method.isDefault ? 'Already default' : 'Set as default'}
                    >
                      {method.isDefault ? <Star color="primary" /> : <StarBorder />}
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteConfirm(method.id)}
                      color="error"
                      title="Delete payment method"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Elements stripe={paymentService.getStripe()}>
            <AddPaymentMethodForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddDialog(false)}
            />
          </Elements>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Payment Method</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment method? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PaymentMethods