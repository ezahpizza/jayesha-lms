import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { BookOpen, Bell, FileText } from 'lucide-react';
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

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  batch_id: string | null;
}

interface StudentOverviewProps {
  enrollments: Enrollment[];
  submissions: any[];
  notices: Notice[];
  getStatusBadge: (status: string) => React.ReactNode;
}

export function StudentOverview({ enrollments, submissions, notices, getStatusBadge }: StudentOverviewProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Enrolled Batches"
          value={enrollments.filter(e => e.status === 'approved').length}
          icon={BookOpen}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Submissions"
          value={submissions.length}
          icon={FileText}
          iconColor="text-green-600"
        />
        <StatCard
          title="New Notices"
          value={notices.length}
          icon={Bell}
          iconColor="text-yellow-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2">
                  <h4 className="font-semibold text-sm sm:text-base">{notice.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(notice.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">My Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrollments.slice(0, 3).map((enrollment) => (
                <div key={enrollment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-b-0 space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{enrollment.batches.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {formatDate(enrollment.enrolled_at)}
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
    </>
  );
}
