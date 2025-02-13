
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const PopulationStats = ({ stateData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="bg-primary/10">
        <CardHeader>
          <CardTitle>Total Population</CardTitle>
          <CardDescription>Current census data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stateData?.population}</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/10">
        <CardHeader>
          <CardTitle>Male Population</CardTitle>
          <CardDescription>Current census data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stateData?.male}</p>
        </CardContent>
      </Card>

      <Card className="bg-pink-500/10">
        <CardHeader>
          <CardTitle>Female Population</CardTitle>
          <CardDescription>Current census data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stateData?.female}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PopulationStats;
