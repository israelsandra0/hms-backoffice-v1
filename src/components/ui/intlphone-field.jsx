import { ChevronDown, Search } from "lucide-react";
import { Input } from "./input";
import { forwardRef, useMemo, useState } from "react";
import { usePhoneInput, defaultCountries, FlagImage } from "react-international-phone";


const IntlPhoneField = forwardRef(({ ...props }, ref) => {
    const {
        inputValue,
        phone,
        country,
        setCountry,
        handlePhoneValueChange,
        inputRef,
    } = usePhoneInput({
        defaultCountry: "ng",
        value: props.value || "",
        disableDialCodePrefill: true,
        disableDialCodeAndPrefix: true,
        onChange: ({ phone, inputValue, country }) => {
            // console.log({phone, inputValue, country})
            props.onChange(phone)
        },
    });

    const [visible, setVisible] = useState(false)
    const [searchFilter, setSearchFilter] = useState("");

    function toggle() {
        setVisible(!visible)
    }


    const filteredCountries = useMemo(() => {
        return defaultCountries.filter(([fullName]) => {
            return fullName.toLowerCase().includes(searchFilter.toLowerCase());
        });
    }, [defaultCountries, searchFilter])



    return (
        <>
            <div className="w-full relative">
                <div className="bg-grey flex border border-neutral-200 rounded-[5px]">
                    <div className="bg-white text-[#333333] h-6 px-2 my-auto flex rounded-[5px] gap-2 w-[150px] justify-start items-center" onClick={toggle}>
                        <FlagImage iso2={country.iso2} className="w-6" />
                        <span>+{country.dialCode}</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                    <Input className="border-none" {...props} ref={ref} onChange={handlePhoneValueChange} value={inputValue} />
                </div>

                <div className={`px-4 ${visible ? '' : 'hidden'} bg-white shadow-lg  h-[220px] z-20 overflow-y-scroll rounded-[5px] absolute w-full border border-neutral-200`}  >
                    

                    <div className=" sticky top-0 bg-white shadow-[-1px_8px_10px_-2px_rgba(0,0,0,0.1)] py-4 ">

                        <Search className="text-gray-400 w-4 absolute mt-[10px] ml-4" />
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="border border-b-gray-300 bg-transparent rounded px-4 pl-9 outline-none"
                        />
                    </div>
                    {filteredCountries.map(([fullName, shortName, dialCode]) => (

                        <div
                            key={shortName}
                            className={`flex justify-between cursor-pointer p-2  rounded-[5px] ${shortName == country.iso2 ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => {
                                setCountry(shortName)
                                setSearchFilter("")
                                toggle()
                            }}
                        >
                            <div className="flex  gap-2">
                                <FlagImage iso2={shortName} className="w-6" /> {fullName}
                            </div>

                            <div className="text-gray-500">+{dialCode}</div>

                        </div>

                    ))}
                </div>

            </div>

        </>
    );
});
export default IntlPhoneField;
