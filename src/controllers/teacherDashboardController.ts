import { supabase } from '@/integrations/supabase/client';

// Type definitions
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
  } | null;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  batch_id: string | null;
  created_at: string;
}

// Existing fetch functions
export async function fetchBatches(setBatches: (batches: any[]) => void) {
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('start_date', { ascending: true });
    if (error) throw error;
    setBatches(data || []);
  } catch (error) {
    console.error('Error fetching batches:', error);
  }
}

export async function fetchEnrollments(setEnrollments: (enrollments: any[]) => void, profile: any) {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`*, batches:batch_id (*), users:student_id (*)`)
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    setEnrollments(data || []);
    if ((data?.length ?? 0) === 0 && profile?.role === 'teacher') {
      console.warn('No enrollments found. This may be due to RLS policy.');
    }
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
}

export async function fetchNotices(setNotices: (notices: any[]) => void) {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select(`*, batches:batch_id (*)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    setNotices(data || []);
  } catch (error) {
    console.error('Error fetching notices:', error);
  }
}

export async function fetchSubmissions(setSubmissions: (submissions: any[]) => void) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`*, batches:batch_id (*), users:student_id (*)`)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    setSubmissions(data || []);
  } catch (error) {
    console.error('Error fetching submissions:', error);
  }
}

// Student Management Functions
export function groupStudentsByBatch(enrollments: Enrollment[]) {
  return enrollments.reduce((acc, enrollment) => {
    const batchId = enrollment.batches.id;
    if (!acc[batchId]) {
      acc[batchId] = {
        batch: enrollment.batches,
        students: []
      };
    }
    acc[batchId].students.push(enrollment);
    return acc;
  }, {} as Record<string, { batch: Batch; students: Enrollment[] }>);
}

export function extractStudentListFromEnrollments(students: Enrollment[]): { id: string; name: string; phone_number: string }[] {
  return students
    .filter(enrollment => enrollment.users)
    .map(enrollment => ({
      id: enrollment.users!.id,
      name: enrollment.users!.name,
      phone_number: enrollment.users!.phone_number
    }));
}

// Notice Management Functions
export async function createNotice(
  notice: { title: string; content: string; batch_id: string | null },
  onSuccess: () => void,
  onError: (message: string) => void
) {
  try {
    const { error } = await supabase
      .from('notices')
      .insert([notice]);

    if (error) throw error;
    onSuccess();
  } catch (error: any) {
    onError(error.message);
  }
}

export async function updateNotice(
  notice: { id: string; title: string; content: string; batch_id: string | null },
  onSuccess: () => void,
  onError: (message: string) => void
) {
  try {
    const { error } = await supabase
      .from('notices')
      .update({ 
        title: notice.title, 
        content: notice.content, 
        batch_id: notice.batch_id 
      })
      .eq('id', notice.id);

    if (error) throw error;
    onSuccess();
  } catch (error: any) {
    onError(error.message);
  }
}

export async function deleteNotice(
  noticeId: string,
  onSuccess: () => void,
  onError: (message: string) => void
) {
  try {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', noticeId);

    if (error) throw error;
    onSuccess();
  } catch (error: any) {
    onError(error.message);
  }
}

// Batch Management
export async function createBatch(newBatch, onSuccess, onError) {
  try {
    const { error } = await supabase.from('batches').insert([newBatch]);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function updateBatch(editingBatch, onSuccess, onError) {
  try {
    const { error } = await supabase.from('batches').update(editingBatch).eq('id', editingBatch.id);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function deleteBatch(batchId, onSuccess, onError) {
  try {
    const { error } = await supabase.from('batches').delete().eq('id', batchId);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function fetchBatchStudents(batchId, setStudents, setLoading) {
  setLoading(true);
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, users:student_id (id, name, phone_number)')
    .eq('batch_id', batchId)
    .eq('status', 'approved');
  setStudents(data?.map(e => e.users).filter(Boolean) || []);
  setLoading(false);
}

// Enrollment Management
export async function updateEnrollmentStatus(
  enrollmentId, action, onSuccess, onError
) {
  try {
    const { error } = await supabase.from('enrollments').update({ status: action }).eq('id', enrollmentId);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

// Submission Management
export async function getSubmissionDownloadUrlController(pdfUrl) {
  const filePath = pdfUrl.startsWith('submissions/') ? pdfUrl.slice('submissions/'.length) : pdfUrl;
  const { data, error } = await supabase.storage.from('submissions').createSignedUrl(filePath, 60);
  if (error) throw error;
  if (!data?.signedUrl) throw new Error('No signed URL returned.');
  return data.signedUrl;
}

export async function deleteEnrollment(
  enrollmentId: string
) {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', enrollmentId);
  if (error) throw error;
}

export async function approveOrRejectEnrollment(
  enrollmentId: string,
  status: 'approved' | 'rejected',
  onSuccess: () => void,
  onError: (msg: string) => void,
  onRefresh?: () => void
) {
  try {
    const { error } = await supabase
      .from('enrollments')
      .update({ status })
      .eq('id', enrollmentId);
    if (error) throw error;
    onSuccess();
    if (onRefresh) onRefresh();
  } catch (error: any) {
    onError(error.message);
  }
}

export async function removeEnrollment(
  enrollmentId: string,
  onSuccess: () => void,
  onError: (msg: string) => void,
  onRefresh?: () => void
) {
  try {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId);
    if (error) throw error;
    onSuccess();
    if (onRefresh) onRefresh();
  } catch (error: any) {
    onError(error.message);
  }
}
