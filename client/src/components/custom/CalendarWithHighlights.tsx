import { parseISO } from "date-fns";
import { Calendar } from "../ui/calendar";

interface Props {
  highlightDates: string[]; 
}

export default function CalendarWithHighlights({ highlightDates }: Props) {
  const markedDays = highlightDates.map((date) => parseISO(date));

  return (
    <Calendar
      mode="single"
      selected={undefined}
      modifiers={{ present: markedDays }}
      modifiersClassNames={{
        present: "bg-green-400 text-white rounded-full",
      }}
    />
  );
}
