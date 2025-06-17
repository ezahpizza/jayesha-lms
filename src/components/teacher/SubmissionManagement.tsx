import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSubmissionDownloadUrlController } from '@/controllers/teacherDashboardController';
import { formatDate } from '@/lib/utils';

interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
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

interface SubmissionManagementProps {
  submissions: Submission[];
}

export function SubmissionManagement({ submissions }: SubmissionManagementProps) {
  const { toast } = useToast();

  const handleDownload = async (pdfUrl: string) => {
    try {
      const signedUrl = await getSubmissionDownloadUrlController(pdfUrl);
      window.open(signedUrl, '_blank');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to download file', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{submission.users.name}</h3>
                <p className="text-sm text-gray-600">{submission.batches.name}</p>
                <p className="text-xs text-gray-500">
                  Submitted: {formatDate(submission.submitted_at)}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => handleDownload(submission.pdf_url)}
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
