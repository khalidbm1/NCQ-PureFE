import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUsers, FiCalendar, FiActivity, FiFileText,
  FiDollarSign, FiClock, FiUserPlus, FiAlertCircle,
  FiTrendingUp, FiHeart, FiThermometer, FiDroplet
} from 'react-icons/fi'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import toast from 'react-hot-toast'

// Mock data
const patientStats = {
  total: 1234,
  admitted: 156,
  outpatient: 89,
  emergency: 12,
}

const appointments = [
  { id: 1, patient: 'Ahmad Hassan', doctor: 'Dr. Sarah Ahmed', time: '09:00 AM', type: 'Consultation', status: 'confirmed' },
  { id: 2, patient: 'Fatima Ali', doctor: 'Dr. Mohammed Khan', time: '10:30 AM', type: 'Follow-up', status: 'waiting' },
  { id: 3, patient: 'Omar Khalid', doctor: 'Dr. Layla Ibrahim', time: '11:00 AM', type: 'Surgery', status: 'in-progress' },
  { id: 4, patient: 'Noura Salem', doctor: 'Dr. Ahmed Yousef', time: '02:00 PM', type: 'Check-up', status: 'confirmed' },
]

const bedOccupancy = [
  { department: 'ICU', total: 20, occupied: 18, available: 2 },
  { department: 'General Ward', total: 100, occupied: 78, available: 22 },
  { department: 'Pediatrics', total: 30, occupied: 24, available: 6 },
  { department: 'Maternity', total: 25, occupied: 19, available: 6 },
  { department: 'Emergency', total: 15, occupied: 12, available: 3 },
]

const vitalSigns = [
  { time: '06:00', heartRate: 72, bloodPressure: 120, temperature: 36.8, oxygen: 98 },
  { time: '08:00', heartRate: 75, bloodPressure: 118, temperature: 36.9, oxygen: 97 },
  { time: '10:00', heartRate: 78, bloodPressure: 122, temperature: 37.1, oxygen: 98 },
  { time: '12:00', heartRate: 80, bloodPressure: 125, temperature: 37.0, oxygen: 99 },
  { time: '14:00', heartRate: 76, bloodPressure: 120, temperature: 36.9, oxygen: 98 },
]

const revenueData = [
  { month: 'Jan', revenue: 850000, expenses: 620000 },
  { month: 'Feb', revenue: 920000, expenses: 680000 },
  { month: 'Mar', revenue: 1050000, expenses: 720000 },
  { month: 'Apr', revenue: 980000, expenses: 690000 },
  { month: 'May', revenue: 1120000, expenses: 750000 },
  { month: 'Jun', revenue: 1200000, expenses: 780000 },
]

const HospitalManagement: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null)
  const [showVitals, setShowVitals] = useState(false)

  const admitPatient = () => {
    toast.success('New patient admitted successfully!')
  }

  const scheduleAppointment = () => {
    toast.success('Appointment scheduled for tomorrow at 10:00 AM')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hospital Management System</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive healthcare management platform
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={admitPatient}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
              data-tooltip="Admit a new patient"
            >
              <FiUserPlus />
              <span>Admit Patient</span>
            </button>
            <button
              onClick={scheduleAppointment}
              className="btn-outline px-4 py-2 flex items-center space-x-2"
              data-tooltip="Schedule an appointment"
            >
              <FiCalendar />
              <span>New Appointment</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiUsers className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">+5.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{patientStats.total}</h3>
          <p className="text-sm text-gray-600">Total Patients</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiActivity className="w-8 h-8 text-green-600" />
            <span className="badge-success">{patientStats.admitted}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{patientStats.admitted}</h3>
          <p className="text-sm text-gray-600">Admitted</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiClock className="w-8 h-8 text-purple-600" />
            <span className="badge-primary">{patientStats.outpatient}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{patientStats.outpatient}</h3>
          <p className="text-sm text-gray-600">Outpatients</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
            <span className="badge-danger">{patientStats.emergency}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-4">{patientStats.emergency}</h3>
          <p className="text-sm text-gray-600">Emergency</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => {
                  setSelectedPatient(apt.id)
                  toast.info(`Viewing ${apt.patient}'s appointment`)
                }}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all
                  ${selectedPatient === apt.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{apt.patient}</p>
                    <p className="text-sm text-gray-600">{apt.doctor} • {apt.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{apt.time}</p>
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      ${apt.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${apt.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bed Occupancy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bed Occupancy</h3>
          <div className="space-y-3">
            {bedOccupancy.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{dept.department}</span>
                  <span className="text-gray-600">
                    {dept.occupied}/{dept.total} ({Math.round((dept.occupied / dept.total) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`
                      h-2 rounded-full transition-all
                      ${(dept.occupied / dept.total) > 0.9 ? 'bg-red-500' : ''}
                      ${(dept.occupied / dept.total) > 0.7 && (dept.occupied / dept.total) <= 0.9 ? 'bg-yellow-500' : ''}
                      ${(dept.occupied / dept.total) <= 0.7 ? 'bg-green-500' : ''}
                    `}
                    style={{ width: `${(dept.occupied / dept.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Patient Vitals Monitor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Vitals Monitor</h3>
            <button
              onClick={() => setShowVitals(!showVitals)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showVitals ? 'Hide' : 'Show'} Live Data
            </button>
          </div>
          
          {showVitals ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vitalSigns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" name="Heart Rate" />
                <Line type="monotone" dataKey="oxygen" stroke="#3b82f6" name="O2 Saturation" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <FiHeart className="w-6 h-6 text-red-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">78 bpm</p>
                <p className="text-sm text-gray-600">Heart Rate</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <FiDroplet className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">O2 Saturation</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <FiThermometer className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">36.9°C</p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <FiActivity className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">120/80</p>
                <p className="text-sm text-gray-600">Blood Pressure</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `SAR ${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#86efac" />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#fca5a5" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-sm p-6 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => toast.success('Opening lab results...')}
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors"
          >
            <FiFileText className="w-5 h-5" />
            <span>Lab Results</span>
          </button>
          <button
            onClick={() => toast.success('Generating prescription...')}
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors"
          >
            <FiFileText className="w-5 h-5" />
            <span>Prescription</span>
          </button>
          <button
            onClick={() => toast.success('Processing billing...')}
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors"
          >
            <FiDollarSign className="w-5 h-5" />
            <span>Billing</span>
          </button>
          <button
            onClick={() => toast.success('Opening medical records...')}
            className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors"
          >
            <FiFileText className="w-5 h-5" />
            <span>Records</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default HospitalManagement