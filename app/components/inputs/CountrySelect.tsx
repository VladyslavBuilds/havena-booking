'use client';

import Select from 'react-select'
import { useTheme } from 'next-themes';

import useCountries from '@/app/hooks/useCountries';

// SVG country flags (class "fi fi-xx"); emoji flags are not rendered on Windows.
import 'flag-icons/css/flag-icons.min.css';

export type CountrySelectValue = {
    code: string;          // ISO 3166-1 alpha-2, lower case (flag icon)
    label: string;
    latlng: [number, number];
    region: string;
    value: string;         // ISO 3166-1 alpha-3, stored in the database
}

interface CountrySelectProps {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
    value,
    onChange
}) => {
    const { getAll } = useCountries();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <div>
            <Select 
                placeholder="Anywhere"
                isClearable
                options={getAll()}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
                formatOptionLabel={(option: CountrySelectValue) => (
                    <div className='flex flex-row items-center gap-3'>
                            {/* SVG flag from flag-icons; emoji flags are not rendered on Windows */}
                            <span
                                className={`fi fi-${option.code} rounded-sm shadow-sm`}
                                aria-hidden="true"
                            />
                            <div>
                                {option.label},
                                <span className="text-neutral-800 dark:text-neutral-100 ml-1">
                                    {option.region}
                                </span>
                            </div>
                    </div>
                )}
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg'
                }}
                // react-select draws itself from these colours, so dark mode
                // is handled here instead of with Tailwind classes.
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary: isDark ? 'white' : 'black',        // focus ring, selected option
                        primary25: isDark ? '#3f3f46' : '#ffe4e6',  // hovered option
                        neutral0: isDark ? '#171717' : 'white',     // control and menu background
                        neutral20: isDark ? '#525252' : '#e5e5e5',  // border
                        neutral30: isDark ? '#737373' : '#a3a3a3',  // border on hover
                        neutral50: isDark ? '#a3a3a3' : '#737373',  // placeholder
                        neutral80: isDark ? '#f5f5f5' : '#262626',  // text
                    }
                })}
            />
        </div>
    );
}

export default CountrySelect;