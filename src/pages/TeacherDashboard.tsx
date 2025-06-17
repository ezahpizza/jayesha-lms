import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { ResponsiveTabs, ResponsiveTabsContent, ResponsiveTabsList, ResponsiveTabsTrigger } from '@/components/ui/responsive-tabs';
import { DashboardOverview } from '@/components/teacher/DashboardOverview';
import { BatchManagement } from '@/components/teacher/BatchManagement';
import { EnrollmentManagement } from '@/components/teacher/EnrollmentManagement';
import { NoticeManagement } from '@/components/teacher/NoticeManagement';
import { SubmissionManagement } from '@/components/teacher/SubmissionManagement';
import { StudentManagement } from '@/components/teacher/StudentManagement';
import { fetchBatches, fetchEnrollments, fetchNotices, fetchSubmissions } from '@/controllers/teacherDashboardController';
import { supabase } from '@/integrations/supabase/client';

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

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  batch_id: string | null;
  batches?: Batch;
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

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchData();
    setupRealtimeListeners();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchBatches(setBatches),
      fetchEnrollments(setEnrollments, profile),
      fetchNotices(setNotices),
      fetchSubmissions(setSubmissions)
    ]);
  };

  const handleRefreshBatches = () => fetchBatches(setBatches);
  const handleRefreshEnrollments = () => fetchEnrollments(setEnrollments, profile);
  const handleRefreshNotices = () => fetchNotices(setNotices);
  const handleRefreshSubmissions = () => fetchSubmissions(setSubmissions);

  const setupRealtimeListeners = () => {
    const enrollmentsChannel = supabase
      .channel('teacher-enrollments')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'enrollments' },
        () => fetchEnrollments(setEnrollments, profile)
      )
      .subscribe();

    const submissionsChannel = supabase
      .channel('teacher-submissions')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        () => fetchSubmissions(setSubmissions)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(submissionsChannel);
    };
  };

  return (
    <div className="overflow-x-hidden">
      <DashboardHeader 
        title="Teacher Dashboard" 
        subtitle={`Welcome back, ${profile?.name && profile.name.trim() ? profile.name : 'Teacher'}!`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <ResponsiveTabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ResponsiveTabsList 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <ResponsiveTabsTrigger value="overview">Overview</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="batches">Batches</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="enrollments">Enrollments</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="notices">Notices</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="submissions">Submissions</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="students">Students</ResponsiveTabsTrigger>
          </ResponsiveTabsList>

          <ResponsiveTabsContent value="overview">
            <DashboardOverview 
              batches={batches}
              enrollments={enrollments}
              submissions={submissions}
              onEnrollmentAction={handleRefreshEnrollments}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="batches">
            <BatchManagement 
              batches={batches}
              onRefresh={handleRefreshBatches}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="enrollments">
            <EnrollmentManagement 
              enrollments={enrollments}
              onRefresh={handleRefreshEnrollments}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="notices">
            <NoticeManagement 
              notices={notices}
              batches={batches}
              onRefresh={handleRefreshNotices}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="submissions">
            <SubmissionManagement submissions={submissions} />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="students">
            <StudentManagement enrollments={enrollments} onRefresh={handleRefreshEnrollments} />
          </ResponsiveTabsContent>
        </ResponsiveTabs>
      </div>
    </div>
  );
}
