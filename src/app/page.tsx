import { HouseRadialChart } from "@/components/charts/HouseRadialChart";
import ChartAreaInteractive from "@/components/charts/ChartAreaInteractive";

export default function Page() {
  return (
    <main className="p-6 space-y-6">
      <ChartAreaInteractive />
      <div className="grid gap-6 md:grid-cols-2">
        <HouseRadialChart title="Casas Vazias" value={45} colorVar="hsl(var(--chart-1))" />
        <HouseRadialChart title="Casas Ocupadas" value={78} colorVar="hsl(var(--chart-2))" />
      </div>
    </main>
  );
}
