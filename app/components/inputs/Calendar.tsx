'use client';

import { isAfter, isWithinInterval, startOfToday } from "date-fns";
import { useState } from "react";
import { DayPicker, type DateRange as DayPickerRange } from "react-day-picker";

import "react-day-picker/style.css";

import { DateRangeValue } from "@/app/types";

interface CalendarProps {
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
    // Days that cannot be booked (existing reservations)
    disabledDates?: Date[];
}

// One month at a time. Picking works like on Airbnb: the first click sets
// the check-in, the next click after it sets the check-out, any other click
// starts over. Days of the neighbouring month shown in the grid are
// clickable, so a stay across a month boundary needs no paging, and the
// view stays on the month the user is looking at.
const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    disabledDates = []
}) => {
    const today = startOfToday();
    const selected: DayPickerRange = { from: value.startDate, to: value.endDate };

    // true between the check-in click and the check-out click. The value
    // alone cannot tell "check-in picked" from the initial "today - today".
    const [awaitingCheckOut, setAwaitingCheckOut] = useState(false);

    const handleSelect = (_range: DayPickerRange | undefined, day: Date) => {
        if (awaitingCheckOut && isAfter(day, value.startDate)) {
            const blocked = disabledDates.some((date) =>
                isWithinInterval(date, { start: value.startDate, end: day })
            );

            // A booked day inside the stay: start again from the clicked day
            if (!blocked) {
                setAwaitingCheckOut(false);
                return onChange({ startDate: value.startDate, endDate: day });
            }
        }

        setAwaitingCheckOut(true);
        onChange({ startDate: day, endDate: day });
    };

    return (
        <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={1}
            navLayout="around"
            startMonth={today}
            disabled={[{ before: today }, ...disabledDates]}
            showOutsideDays
            weekStartsOn={1}
            className="havena-calendar"
        />
    );
}

export default Calendar;
