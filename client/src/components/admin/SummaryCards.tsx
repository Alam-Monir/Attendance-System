
interface Props {
  data: {
    totalEmployees: number;
    totalLeaves: number;
    pendingLeaves: number;
    todayAttendance: number;
  };
}

export default function SummaryCards({ data }: Props) {
  const cards = [
    { title: "Total Employees", value: data.totalEmployees },
    { title: "Today’s Attendance", value: data.todayAttendance },
    { title: "Total Leaves", value: data.totalLeaves },
    { title: "Pending Leaves", value: data.pendingLeaves },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md"
        >
          <h2 className="text-sm text-gray-500 dark:text-gray-400">
            {card.title}
          </h2>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
