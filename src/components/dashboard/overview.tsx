import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 132,
  },
  {
    name: "Fév",
    total: 145,
  },
  {
    name: "Mar",
    total: 164,
  },
  {
    name: "Avr",
    total: 121,
  },
  {
    name: "Mai",
    total: 148,
  },
  {
    name: "Juin",
    total: 156,
  },
  {
    name: "Juil",
    total: 118,
  },
  {
    name: "Août",
    total: 110,
  },
  {
    name: "Sep",
    total: 142,
  },
  {
    name: "Oct",
    total: 152,
  },
  {
    name: "Nov",
    total: 138,
  },
  {
    name: "Déc",
    total: 124,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
