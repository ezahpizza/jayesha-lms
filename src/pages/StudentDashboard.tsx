import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileCompletion } from '@/components/ProfileCompletion';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { ResponsiveTabs, ResponsiveTabsContent, ResponsiveTabsList, ResponsiveTabsTrigger } from '@/components/ui/responsive-tabs';
import { StudentOverview } from '@/components/student/StudentOverview';
import { StudentBatches } from '@/components/student/StudentBatches';
import { StudentNotices } from '@/components/student/StudentNotices';
import { StudentHomework } from '@/components/student/StudentHomework';
import { StudentSubmissions } from '@/components/student/StudentSubmissions';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchBatches, fetchEnrollments, fetchNotices, fetchSubmissions, handleEnrollmentRequest, handleFileUpload } from '@/controllers/studentDashboardController';
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
}

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  batch_id: string | null;
}

interface Submission {
  id: string;
  pdf_url: string;
  submitted_at: string;
  batches: Batch;
}

export default function StudentDashboard() {
  const { profile, isProfileComplete, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isProfileComplete) {
      setShowProfileCompletion(true);
      return;
    }
    if (profile?.id) {
      fetchBatches(setBatches);
      fetchEnrollments(profile, setEnrollments);
      fetchNotices(profile, setNotices);
      fetchSubmissions(profile, setSubmissions);
      // Set up real-time listeners
      const enrollmentsChannel = supabase
        .channel('enrollments-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'enrollments', filter: `student_id=eq.${profile.id}` },
          () => fetchEnrollments(profile, setEnrollments)
        )
        .subscribe();
      const noticesChannel = supabase
        .channel('notices-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'notices' },
          () => fetchNotices(profile, setNotices)
        )
        .subscribe();
      const submissionsChannel = supabase
        .channel('submissions-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'submissions', filter: `student_id=eq.${profile.id}` },
          () => fetchSubmissions(profile, setSubmissions)
        )
        .subscribe();
      return () => {
        supabase.removeChannel(enrollmentsChannel);
        supabase.removeChannel(noticesChannel);
        supabase.removeChannel(submissionsChannel);
      };
    }
  }, [profile?.id, isProfileComplete]);

  const handleProfileComplete = async () => {
    await refreshProfile();
    setShowProfileCompletion(false);
  };

  const handleEnrollmentRequestWrapper = (batchId: string) => handleEnrollmentRequest(profile, isProfileComplete, batchId, setShowProfileCompletion, toast);
  const handleFileUploadWrapper = () => handleFileUpload(profile, selectedFile, selectedBatchId, setUploading, setSelectedFile, setSelectedBatchId, toast);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (showProfileCompletion) {
    return <ProfileCompletion onComplete={handleProfileComplete} />;
  }

  const enrolledBatchIds = enrollments
    .filter(e => e.status === 'approved')
    .map(e => e.batches.id);
  const availableBatches = batches.filter(batch => 
    !enrollments.some(e => e.batches.id === batch.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DashboardHeader 
        title="Student Dashboard" 
        subtitle={`Welcome back, ${profile?.name && profile.name.trim() ? profile.name : 'Student'}!`}
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
            <ResponsiveTabsTrigger value="notices">Notices</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="homework">Homework</ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="submissions">Submissions</ResponsiveTabsTrigger>
          </ResponsiveTabsList>

          <ResponsiveTabsContent value="overview">
            <StudentOverview 
              enrollments={enrollments}
              submissions={submissions}
              notices={notices}
              getStatusBadge={getStatusBadge}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="batches">
            <StudentBatches 
              availableBatches={availableBatches}
              enrollments={enrollments}
              handleEnrollmentRequest={handleEnrollmentRequestWrapper}
              getStatusBadge={getStatusBadge}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="notices">
            <StudentNotices notices={notices} />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="homework">
            <StudentHomework 
              enrollments={enrollments}
              selectedBatchId={selectedBatchId}
              setSelectedBatchId={setSelectedBatchId}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              uploading={uploading}
              handleFileUpload={handleFileUploadWrapper}
            />
          </ResponsiveTabsContent>

          <ResponsiveTabsContent value="submissions">
            <StudentSubmissions submissions={submissions} />
          </ResponsiveTabsContent>
        </ResponsiveTabs>
      </div>
    </div>
  );
}
