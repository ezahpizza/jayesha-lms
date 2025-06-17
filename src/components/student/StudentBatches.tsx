import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
}

interface Enrollment {
  id: string;
  status: string;
  enrolled_at: string;
  batches: Batch;
}

interface StudentBatchesProps {
  availableBatches: Batch[];
  enrollments: Enrollment[];
  handleEnrollmentRequest: (batchId: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function StudentBatches({ availableBatches, enrollments, handleEnrollmentRequest, getStatusBadge }: StudentBatchesProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Available Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBatches.map((batch) => (
              <Card key={batch.id} className="border-2 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{batch.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{batch.description}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(batch.start_date)}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleEnrollmentRequest(batch.id)}
                      className="w-full sm:w-auto"
                    >
                      Request Enrollment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">My Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">{enrollment.batches.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{enrollment.batches.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested: {formatDate(enrollment.enrolled_at)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(enrollment.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
