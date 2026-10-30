'use client';

import Select from 'react-select'

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
                                <span className="text-neutral-800 ml-1">
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
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary: 'black',
                        primary25: '#ffe4e6'
                    }
                })}
            />
        </div>
    );
}

export default CountrySelect;