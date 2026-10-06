import { useState, useEffect, useCallback, useMemo } from 'react';
import { getReports } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export function useHistory() {
  const { user } = useAuth();
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [cropFilter, setCropFilter] = useState('All');
  const [diseaseFilter, setDiseaseFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReports(cropFilter, diseaseFilter, user?.id || 'demo_farmer_123');
      if (data && data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Unable to load scan reports. Backend may be offline.');
    } finally {
      setIsLoading(false);
    }
  }, [cropFilter, diseaseFilter, user?.id]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Derived filtered data
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Urgency filter
      if (
        urgencyFilter !== 'All' &&
        (item.urgency || '').toLowerCase() !== urgencyFilter.toLowerCase()
      ) {
        return false;
      }

      // Keyword search (disease, crop, advice, GPS)
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matches =
          (item.disease_name || '').toLowerCase().includes(query) ||
          (item.crop_type || '').toLowerCase().includes(query) ||
          (item.treatment_advice || '').toLowerCase().includes(query) ||
          (item.gps_location || '').toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [reports, urgencyFilter, searchKeyword]);

  // Unique list of crops and diseases for dropdown filters
  const uniqueCrops = useMemo(() => {
    const crops = new Set(reports.map((r) => r.crop_type).filter(Boolean));
    return ['All', ...Array.from(crops)];
  }, [reports]);

  const uniqueDiseases = useMemo(() => {
    const diseases = new Set(reports.map((r) => r.disease_name).filter(Boolean));
    return ['All', ...Array.from(diseases)];
  }, [reports]);

  return {
    reports,
    filteredReports,
    isLoading,
    error,
    cropFilter,
    setCropFilter,
    diseaseFilter,
    setDiseaseFilter,
    urgencyFilter,
    setUrgencyFilter,
    searchKeyword,
    setSearchKeyword,
    uniqueCrops,
    uniqueDiseases,
    refreshReports: fetchReports,
  };
}

export default useHistory;
