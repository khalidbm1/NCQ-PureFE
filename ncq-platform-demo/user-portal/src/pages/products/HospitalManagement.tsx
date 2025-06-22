import { useState } from 'react'
import { 
  Activity, Users, Calendar, Pill, FileText, Bed, 
  DollarSign, AlertCircle, Clock, UserPlus, Heart,
  Stethoscope, Syringe, Clipboard, TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { toast } from 'sonner'

// Mock data
const stats = {
  totalPatients: 1248,
  activePatients: 342,
  todayAppointments: 28,
  availableBeds: 45,
  occupancyRate: 78,
  staffOnDuty: 89,
  pendingBills: 23,
  emergencyCases: 3
}

const recentPatients = [
  { id: 1, name: 'Ahmed Al-Rashid', age: 45, condition: 'Hypertension', status: 'stable', room: 'A-204' },
  { id: 2, name: 'Fatima Hassan', age: 32, condition: 'Post-Surgery', status: 'recovering', room: 'B-112' },
  { id: 3, name: 'Mohammed Ali', age: 67, condition: 'Diabetes', status: 'critical', room: 'ICU-3' },
  { id: 4, name: 'Sarah Abdullah', age: 28, condition: 'Maternity', status: 'stable', room: 'M-301' },
  { id: 5, name: 'Omar Khalid', age: 52, condition: 'Cardiac', status: 'monitoring', room: 'C-205' }
]

const todayAppointments = [
  { id: 1, time: '09:00', patient: 'Aisha Rahman', doctor: 'Dr. Ahmed Nasser', type: 'Consultation', status: 'completed' },
  { id: 2, time: '09:30', patient: 'Khalid Ibrahim', doctor: 'Dr. Fatima Ali', type: 'Follow-up', status: 'completed' },
  { id: 3, time: '10:00', patient: 'Noor Al-Sayed', doctor: 'Dr. Hassan Omar', type: 'Surgery', status: 'in-progress' },
  { id: 4, time: '11:00', patient: 'Yasmin Abdulla', doctor: 'Dr. Ahmed Nasser', type: 'Check-up', status: 'waiting' },
  { id: 5, time: '14:00', patient: 'Ali Mohammed', doctor: 'Dr. Sarah Khan', type: 'Emergency', status: 'scheduled' }
]

const departments = [
  { name: 'Emergency', patients: 12, staff: 8, status: 'busy' },
  { name: 'Surgery', patients: 6, staff: 12, status: 'normal' },
  { name: 'Pediatrics', patients: 18, staff: 6, status: 'busy' },
  { name: 'Cardiology', patients: 9, staff: 5, status: 'normal' },
  { name: 'Maternity', patients: 14, staff: 7, status: 'normal' }
]

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: any
  trend?: number
  color?: string
}

const MetricCard = ({ title, value, description, icon: Icon, trend, color = 'text-primary' }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend !== undefined && (
        <div className="flex items-center mt-1">
          <TrendingUp className={`h-3 w-3 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        </div>
      )}
    </CardContent>
  </Card>
)

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { color: string; bg: string }> = {
    stable: { color: 'text-green-700', bg: 'bg-green-100' },
    critical: { color: 'text-red-700', bg: 'bg-red-100' },
    recovering: { color: 'text-blue-700', bg: 'bg-blue-100' },
    monitoring: { color: 'text-orange-700', bg: 'bg-orange-100' },
    completed: { color: 'text-green-700', bg: 'bg-green-100' },
    'in-progress': { color: 'text-blue-700', bg: 'bg-blue-100' },
    waiting: { color: 'text-yellow-700', bg: 'bg-yellow-100' },
    scheduled: { color: 'text-gray-700', bg: 'bg-gray-100' }
  }
  
  const variant = variants[status] || variants.stable
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variant.bg} ${variant.color}`}>
      {status}
    </span>
  )
}

export default function HospitalManagement() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const handleAdmitPatient = () => {
    toast.success('New patient admission form opened')
  }

  const handleScheduleAppointment = () => {
    toast.success('Appointment scheduling opened')
  }

  const handleEmergencyAlert = () => {
    toast.error('Emergency alert sent to all available staff')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hospital Management</h1>
          <p className="text-muted-foreground">
            Comprehensive healthcare management system
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAdmitPatient}>
            <UserPlus className="w-4 h-4 mr-2" />
            Admit Patient
          </Button>
          <Button variant="outline" onClick={handleScheduleAppointment}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="destructive" onClick={handleEmergencyAlert}>
            <AlertCircle className="w-4 h-4 mr-2" />
            Emergency
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          description="All registered patients"
          icon={Users}
          trend={5}
          color="text-blue-500"
        />
        <MetricCard
          title="Active Cases"
          value={stats.activePatients}
          description="Currently admitted"
          icon={Activity}
          trend={-2}
          color="text-green-500"
        />
        <MetricCard
          title="Available Beds"
          value={`${stats.availableBeds} / 200`}
          description={`${stats.occupancyRate}% occupancy`}
          icon={Bed}
          color="text-orange-500"
        />
        <MetricCard
          title="Staff on Duty"
          value={stats.staffOnDuty}
          description="Doctors & nurses"
          icon={Stethoscope}
          trend={3}
          color="text-purple-500"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Emergency Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Emergency Department</span>
                  <Badge variant="destructive">
                    {stats.emergencyCases} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Wait Time</span>
                    <span className="font-medium">23 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available ER Beds</span>
                    <span className="font-medium">3 / 12</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Emergency department at 75% capacity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Pill className="w-4 h-4 mr-2" />
                    Pharmacy
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Syringe className="w-4 h-4 mr-2" />
                    Lab Results
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Medical Records
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Patients */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                Latest patient admissions and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Age: {patient.age} | {patient.condition} | Room: {patient.room}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={patient.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                View and manage all patient records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Full patient management interface would be displayed here
                </p>
                <Button className="mt-4">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>
                {todayAppointments.length} appointments scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{appointment.time.split(':')[0]}</p>
                        <p className="text-sm text-muted-foreground">{appointment.time.split(':')[1]}</p>
                      </div>
                      <div className="border-l pl-4">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor} • {appointment.type}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Card key={dept.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Patients</span>
                      <span className="font-medium">{dept.patients}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Staff</span>
                      <span className="font-medium">{dept.staff}</span>
                    </div>
                    <div className="pt-2">
                      <Badge variant={dept.status === 'busy' ? 'destructive' : 'default'}>
                        {dept.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}