import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  Clock, 
  FileText,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  handleEnrollmentActionController, 
  getSubmissionDownloadUrlController 
} from '@/controllers/teacherDashboardController';
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

interface Submission {
  id: string;
  pdf_url: string;
  submitted_at: string;
  batches: Batch;
  users: {
    id: string;
    name: string;
  };
}

interface DashboardOverviewProps {
  batches: Batch[];
  enrollments: Enrollment[];
  submissions: Submission[];
  onEnrollmentAction: () => void;
}

export function DashboardOverview({ 
  batches, 
  enrollments, 
  submissions, 
  onEnrollmentAction 
}: DashboardOverviewProps) {
  const { toast } = useToast();

  const handleEnrollmentAction = async (enrollmentId: string, action: 'approved' | 'rejected') => {
    try {
      await handleEnrollmentActionController(enrollmentId, action);
      toast({
        title: "Success",
        description: `Enrollment ${action} successfully!`,
      });
      onEnrollmentAction();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadSubmission = async (pdfUrl: string) => {
    try {
      const signedUrl = await getSubmissionDownloadUrlController(pdfUrl);
      window.open(signedUrl, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.filter(e => e.status === 'pending').slice(0, 5).map((enrollment) => {
              if (!enrollment.users || !enrollment.batches) {
                return (
                  <div key={enrollment.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-red-500">Invalid enrollment data</p>
                    </div>
                  </div>
                );
              }
              return (
                <div key={enrollment.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{enrollment.users.name}</p>
                    <p className="text-sm text-gray-600">{enrollment.batches.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleEnrollmentAction(enrollment.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEnrollmentAction(enrollment.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.slice(0, 5).map((submission) => {
              if (!submission.users || !submission.batches) {
                return (
                  <div key={submission.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-red-500">Invalid submission data</p>
                    </div>
                  </div>
                );
              }
              return (
                <div key={submission.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{submission.users.name}</p>
                    <p className="text-sm text-gray-600">{submission.batches.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(submission.submitted_at)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadSubmission(submission.pdf_url)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
