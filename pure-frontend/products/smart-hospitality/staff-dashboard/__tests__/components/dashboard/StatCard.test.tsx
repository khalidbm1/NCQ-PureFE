import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/dashboard/StatCard'

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Total Revenue',
    value: '$12,345',
    change: 12.5,
    icon: 'dollar',
  }

  it('renders title and value correctly', () => {
    render(<StatCard {...defaultProps} />)
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$12,345')).toBeInTheDocument()
  })

  it('shows positive change with correct styling', () => {
    render(<StatCard {...defaultProps} />)
    
    const changeElement = screen.getByText('+12.5%')
    expect(changeElement).toBeInTheDocument()
    expect(changeElement).toHaveClass('text-green-600')
  })

  it('shows negative change with correct styling', () => {
    render(<StatCard {...defaultProps} change={-5.2} />)
    
    const changeElement = screen.getByText('-5.2%')
    expect(changeElement).toBeInTheDocument()
    expect(changeElement).toHaveClass('text-red-600')
  })

  it('shows no change indicator when change is 0', () => {
    render(<StatCard {...defaultProps} change={0} />)
    
    const changeElement = screen.getByText('0%')
    expect(changeElement).toBeInTheDocument()
    expect(changeElement).toHaveClass('text-gray-600')
  })

  it('renders loading state', () => {
    render(<StatCard {...defaultProps} loading />)
    
    expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument()
    expect(screen.getByTestId('stat-card-skeleton')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<StatCard {...defaultProps} className="custom-class" />)
    
    const card = screen.getByTestId('stat-card')
    expect(card).toHaveClass('custom-class')
  })

  it('handles missing change value', () => {
    const { change, ...propsWithoutChange } = defaultProps
    render(<StatCard {...propsWithoutChange} />)
    
    expect(screen.queryByText('%')).not.toBeInTheDocument()
  })

  it('formats large numbers correctly', () => {
    render(<StatCard {...defaultProps} value={1234567} format="number" />)
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<StatCard {...defaultProps} subtitle="Last 30 days" />)
    
    expect(screen.getByText('Last 30 days')).toBeInTheDocument()
  })
})