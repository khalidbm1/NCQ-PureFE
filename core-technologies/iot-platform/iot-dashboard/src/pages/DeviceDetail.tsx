import { useParams } from 'react-router-dom'

export default function DeviceDetail() {
  const { deviceId } = useParams()
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Device Details</h1>
      <p>Device ID: {deviceId}</p>
    </div>
  )
}