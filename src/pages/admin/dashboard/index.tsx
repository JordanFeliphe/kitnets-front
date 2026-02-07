import ChartAreaInteractive from "./components/ChartAreaInteractive";
import { DashboardCard } from "./components/DashboardCard";
import { useDashboardData } from "./hooks/useDashboard";
import { Skeleton } from "@/app/shared/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border bg-card p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))
        ) : (
          dashboardData?.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              variant={card.variant}
              icon={card.icon}
              trend={card.trend}
            />
          ))
        )}
      </div>
      <div className="space-y-6">
        <ChartAreaInteractive />
      </div>
    </div>
  )
}
