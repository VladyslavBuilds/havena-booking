import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
    value: country.cca3,
    label: country.name.common,
    // Two-letter code for the flag icon (emoji flags don't render on Windows)
    code: country.cca2.toLowerCase(),
    latlng: country.latlng,
    region: country.region
}));

// Defined once at module level so the functions keep the same identity
// between renders and can safely be used in hook dependency arrays.
const getAll = () => formattedCountries;

const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value)
}

const useCountries = () => {
    return {
        getAll,
        getByValue
    }
};

export default useCountries;
