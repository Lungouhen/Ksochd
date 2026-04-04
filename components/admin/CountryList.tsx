import { Card } from "./shared/Card";

const countries = [
  { flag: "🇻🇳", name: "Vietnam", visitors: 45 },
  { flag: "🇺🇸", name: "United States", visitors: 34 },
  { flag: "🇧🇩", name: "Bangladesh", visitors: 19 },
];

export function CountryList() {
  return (
    <Card title="Top Countries" description="Visitors by country">
      <ul className="space-y-3">
        {countries.map((country) => (
          <li
            key={country.name}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2"
          >
            <div className="flex items-center gap-3 text-sm text-white">
              <span className="text-lg">{country.flag}</span>
              <span>{country.name}</span>
            </div>
            <span className="text-sm font-semibold text-emerald-200">
              {country.visitors}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
