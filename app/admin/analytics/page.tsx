import { BrowserPie } from "@/components/admin/BrowserPie";
import { CountryList } from "@/components/admin/CountryList";
import { VisitorsChart } from "@/components/admin/VisitorsChart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VisitorsChart />
        </div>
        <BrowserPie />
      </div>
      <CountryList />
    </div>
  );
}
