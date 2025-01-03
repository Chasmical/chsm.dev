const dateFormat: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
const timeFormat: Intl.DateTimeFormatOptions = { timeZone: "UTC" };

export interface DateTimeProps {
  dateTime: Date | string;
  format: "date" | "time";
  itemProp?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DateTime({ dateTime, format, ...props }: DateTimeProps) {
  if (typeof dateTime === "string") dateTime = new Date(dateTime);
  const iso = dateTime.toISOString();

  return (
    <time dateTime={iso} title={iso.replace("T", " ").replace(/\.\d{3}Z/, " UTC")} {...props}>
      {format === "date"
        ? dateTime.toLocaleDateString("en-US", dateFormat)
        : dateTime.toLocaleTimeString("en-US", timeFormat)}
    </time>
  );
}
