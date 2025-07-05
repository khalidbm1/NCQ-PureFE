import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function LLMPlatformSimple() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">LLM Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Models</CardTitle>
            <CardDescription>Currently deployed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Requests</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45.2K</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tokens Used</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.1M</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Model Management</CardTitle>
          <CardDescription>Deploy and manage AI models</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Model list and controls would go here...</p>
        </CardContent>
      </Card>
    </div>
  );
}