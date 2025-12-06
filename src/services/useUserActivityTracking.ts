import { useQuery } from '@tanstack/react-query';
import { UserActivityRecord } from '../types/mindmesh';
import { MOCK_ACTIVITY_RECORDS } from '../mocks/mockData';
// import { supabase } from '../config/supabaseClient';
const fetchUserActivity = async (): Promise<UserActivityRecord[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app:
  // const { data, error } = await supabase.from('activity_log').select('*');
  // if (error) throw error;
  // return data as UserActivityRecord[];

  return MOCK_ACTIVITY_RECORDS as UserActivityRecord[];
};

export const useFetchUserActivity = () => {
  return useQuery<UserActivityRecord[], Error>({
    queryKey: ['userActivityRecords'],
    queryFn: fetchUserActivity,
  });
};