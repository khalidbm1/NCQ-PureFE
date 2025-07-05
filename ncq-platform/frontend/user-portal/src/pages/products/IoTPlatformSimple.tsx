import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function IoTPlatformSimple() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">IoT Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>Total active devices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,247</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Points</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.5M</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Overall status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">98.5%</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
          <CardDescription>Monitor and control your IoT devices</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Device list and controls would go here...</p>
        </CardContent>
      </Card>
    </div>
  );
}