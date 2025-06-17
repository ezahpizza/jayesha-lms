import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

export async function fetchEnrollments(profile: any, setEnrollments: (enrollments: any[]) => void) {
  if (!profile?.id) return;
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`*, batches:batch_id (*)`)
      .eq('student_id', profile.id)
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    setEnrollments(data || []);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
}

export async function fetchNotices(profile: any, setNotices: (notices: any[]) => void) {
  if (!profile?.id) return;
  try {
    const { data: enrolledBatches } = await supabase
      .from('enrollments')
      .select('batch_id')
      .eq('student_id', profile.id)
      .eq('status', 'approved');
    const batchIds = enrolledBatches?.map((e: any) => e.batch_id) || [];
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .or(`batch_id.is.null,batch_id.in.(${batchIds.join(',')})`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    setNotices(data || []);
  } catch (error) {
    console.error('Error fetching notices:', error);
  }
}

export async function fetchSubmissions(profile: any, setSubmissions: (submissions: any[]) => void) {
  if (!profile?.id) return;
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`*, batches:batch_id (*)`)
      .eq('student_id', profile.id)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    setSubmissions(data || []);
  } catch (error) {
    console.error('Error fetching submissions:', error);
  }
}

export async function handleEnrollmentRequest(profile: any, isProfileComplete: boolean, batchId: string, setShowProfileCompletion: (show: boolean) => void, toast: any) {
  if (!profile?.id) return;
  if (!isProfileComplete) {
    toast({
      title: 'Complete Your Profile',
      description: 'Please complete your profile before enrolling in batches.',
      variant: 'destructive',
    });
    setShowProfileCompletion(true);
    return;
  }
  try {
    const { error } = await supabase
      .from('enrollments')
      .insert({
        student_id: profile.id,
        batch_id: batchId,
        status: 'pending',
      });
    if (error) {
      if (error.message.includes('violates row-level security policy')) {
        toast({
          title: 'Complete Your Profile',
          description: 'Please complete your profile before enrolling in batches.',
          variant: 'destructive',
        });
        setShowProfileCompletion(true);
        return;
      }
      throw error;
    }
    toast({
      title: 'Success',
      description: 'Enrollment request submitted successfully!',
    });
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  }
}

export async function handleFileUpload(profile: any, selectedFile: File | null, selectedBatchId: string, setUploading: (uploading: boolean) => void, setSelectedFile: (file: File | null) => void, setSelectedBatchId: (id: string) => void, toast: any) {
  if (!selectedFile || !selectedBatchId || !profile?.id) return;
  setUploading(true);
  try {
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${profile.id}/${selectedBatchId}/${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(fileName, selectedFile);
    if (uploadError) throw uploadError;
    const { error: insertError } = await supabase
      .from('submissions')
      .insert({
        student_id: profile.id,
        batch_id: selectedBatchId,
        pdf_url: uploadData.path,
      });
    if (insertError) throw insertError;
    toast({
      title: 'Success',
      description: 'Homework submitted successfully!',
    });
    setSelectedFile(null);
    setSelectedBatchId('');
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  } finally {
    setUploading(false);
  }
}
