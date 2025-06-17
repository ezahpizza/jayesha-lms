import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateEnrollmentStatus } from '@/controllers/teacherDashboardController';
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
  users: {
    id: string;
    name: string;
    phone_number: string;
  };
}

interface EnrollmentManagementProps {
  enrollments: Enrollment[];
  onRefresh: () => void;
}

export function EnrollmentManagement({ enrollments, onRefresh }: EnrollmentManagementProps) {
  const { toast } = useToast();

  const handleEnrollmentAction = (enrollmentId: string, action: 'approved' | 'rejected') => {
    updateEnrollmentStatus(
      enrollmentId,
      action,
      () => {
        toast({ title: 'Success', description: `Enrollment ${action} successfully!` });
        onRefresh();
      },
      (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 text-xs"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 text-xs"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Enrollment Requests</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>No enrollment requests found.</p>
            </div>
          ) : (
            enrollments.map((enrollment) => {
              if (!enrollment.users || !enrollment.batches) {
                console.warn('Invalid enrollment data:', enrollment);
                return (
                  <div key={enrollment.id} className="p-4 border rounded-lg bg-red-50">
                    <h3 className="font-semibold text-red-500 text-sm">Invalid enrollment data</h3>
                    <p className="text-xs text-gray-600 mt-1">Check student_id and batch_id</p>
                  </div>
                );
              }
              return (
                <div key={enrollment.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm sm:text-base">{enrollment.users.name}</h3>
                        <p className="text-sm text-gray-600">{enrollment.batches.name}</p>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                          <p className="text-xs text-gray-500">
                            Phone: {enrollment.users.phone_number}
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested: {formatDate(enrollment.enrolled_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(enrollment.status)}
                      </div>
                    </div>
                    
                    {enrollment.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEnrollmentAction(enrollment.id, 'approved')}
                          className="w-full sm:w-auto"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnrollmentAction(enrollment.id, 'rejected')}
                          className="w-full sm:w-auto"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
