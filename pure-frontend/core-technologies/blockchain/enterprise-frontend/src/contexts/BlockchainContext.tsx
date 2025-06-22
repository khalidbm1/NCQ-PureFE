import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { api } from '../services/api'

interface BlockchainStats {
  chainLength: number
  pendingTransactions: number
  smartContracts: any
  iotDevices: any
  assets: any
  consensus: any
  governance: any
}

interface BlockchainContextType {
  stats: BlockchainStats | null
  isConnected: boolean
  socket: Socket | null
  refreshStats: () => Promise<void>
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export const useBlockchain = () => {
  const context = useContext(BlockchainContext)
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider')
  }
  return context
}

interface BlockchainProviderProps {
  children: React.ReactNode
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<BlockchainStats | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const refreshStats = async () => {
    try {
      const response = await api.get('/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch blockchain stats:', error)
    }
  }

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to blockchain')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from blockchain')
    })

    newSocket.on('blockAdded', (block) => {
      console.log('New block added:', block)
      refreshStats()
    })

    newSocket.on('transactionSubmitted', (transaction) => {
      console.log('New transaction submitted:', transaction)
      refreshStats()
    })

    // Initial stats fetch
    refreshStats()

    // Periodic stats refresh
    const interval = setInterval(refreshStats, 30000) // Every 30 seconds

    return () => {
      newSocket.close()
      clearInterval(interval)
    }
  }, [])

  const value = {
    stats,
    isConnected,
    socket,
    refreshStats,
  }

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  )
}