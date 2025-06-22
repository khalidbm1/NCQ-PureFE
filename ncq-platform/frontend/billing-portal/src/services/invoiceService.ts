import api from './api'
import { Invoice, InvoiceFilters, ApiResponse } from '../types'

class InvoiceService {
  async getInvoices(filters?: InvoiceFilters): Promise<ApiResponse<Invoice[]>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    return api.get<ApiResponse<Invoice[]>>(`/billing/invoices?${params.toString()}`)
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return api.get<Invoice>(`/billing/invoices/${id}`)
  }

  async downloadInvoice(id: string): Promise<void> {
    const invoice = await this.getInvoiceById(id)
    await api.download(`/billing/invoices/${id}/download`, `invoice-${invoice.invoiceNumber}.pdf`)
  }

  async payInvoice(id: string, paymentMethodId: string): Promise<Invoice> {
    return api.post<Invoice>(`/billing/invoices/${id}/pay`, { paymentMethodId })
  }

  async getUpcomingInvoice(): Promise<Invoice | null> {
    try {
      return await api.get<Invoice>('/billing/invoices/upcoming')
    } catch (error) {
      return null
    }
  }

  async retryPayment(id: string): Promise<Invoice> {
    return api.post<Invoice>(`/billing/invoices/${id}/retry`)
  }

  async voidInvoice(id: string): Promise<Invoice> {
    return api.post<Invoice>(`/billing/invoices/${id}/void`)
  }

  async getInvoiceStats(): Promise<{
    totalPaid: number
    totalPending: number
    totalOverdue: number
    averageInvoiceAmount: number
  }> {
    return api.get('/billing/invoices/stats')
  }
}

export default new InvoiceService()