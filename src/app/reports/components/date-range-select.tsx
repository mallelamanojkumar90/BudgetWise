"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateRangeKey = '7d' | '30d' | 'this-month' | 'last-month' | '90d';

const dateRanges: { key: DateRangeKey, label: string }[] = [
    { key: '7d', label: 'Last 7 days' },
    { key: '30d', label: 'Last 30 days' },
    { key: 'this-month', label: 'This Month' },
    { key: 'last-month', label: 'Last Month' },
    { key: '90d', label: 'Last 90 days' },
];

interface DateRangeSelectProps {
  value: DateRangeKey;
  onValueChange: (value: DateRangeKey) => void;
  className?: string;
}

export function DateRangeSelect({ value, onValueChange, className }: DateRangeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className || "w-[180px]"}>
        <SelectValue placeholder="Select a date range" />
      </SelectTrigger>
      <SelectContent>
        {dateRanges.map((range) => (
          <SelectItem key={range.key} value={range.key}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
