'use client';

import React from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface CalendarProps {
    value: Range;
    onChange: (value: RangeKeyDict) => void;
    disabledDates?: Date[]
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    disabledDates
}) => {
    return (
        <div>
            <DateRange 
                rangeColors={["#262626"]}
                ranges={[value]}
                date={new Date()}
                onChange={onChange}
                direction="vertical"
                // Two months at once: a stay that crosses a month boundary is
                // selected without paging, and the whole range stays visible.
                // With one month the library jumps back to the start month
                // after the second click, which looks like the pick failed.
                months={2}
                showDateDisplay={false}
                minDate={new Date()}
                disabledDates={disabledDates}
            />
        </div>
    );
}

export default Calendar