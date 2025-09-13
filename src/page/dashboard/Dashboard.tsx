import { useState, useEffect } from 'react';
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useAuth } from '@/contexts/AuthContext';
import data from "@/app/dashboard/data.json";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <SectionCards loading={loading} />
      <div className="space-y-6">
        <ChartAreaInteractive />
        <DataTable data={data} />
      </div>
    </div>
  )
}
