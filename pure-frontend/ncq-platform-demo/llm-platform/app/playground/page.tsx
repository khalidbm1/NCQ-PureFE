'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PlaygroundPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/dashboard/sandbox')
  }, [router])
  
  return null
}