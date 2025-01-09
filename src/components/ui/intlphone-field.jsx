import { ChevronDown, Search } from "lucide-react";
import { Input } from "./input";
import { forwardRef, useState } from "react";
import {  usePhoneInput, defaultCountries, FlagImage } from "react-international-phone";


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

    // Filter countries based on the searchFilter
    const filteredCountries = defaultCountries.filter(([fullName]) => {
        return fullName.toLowerCase().includes(searchFilter.toLowerCase());
    });


    return (
        <>
            <div className="w-full relative">
                <div className="bg-grey flex p-1 border border-neutral-200 rounded-[5px]">
                    <div className="bg-white text-[#333333] px-2 flex rounded-[5px] gap-2 w-[150px] justify-start items-center" onClick={toggle}>
                        <FlagImage iso2={country.iso2}  className="w-6" />
                        <span>+{country.dialCode}</span>  
                        <ChevronDown className="w-6 h-6" />
                    </div>
                    <Input className="border-none" {...props} ref={ref} onChange={handlePhoneValueChange} value={inputValue}/>
                </div>

                <div className={`px-4 ${visible ? '' : 'hidden'} bg-white shadow-lg  h-[220px] overflow-y-scroll rounded-[5px] absolute w-full border border-neutral-200`}>
                    
                    <div className=" sticky top-0 bg-white shadow-[-1px_4px_2px_-2px_rgba(0,0,0,0.1)] pl-4 py-4 ">

                        <Search className="text-gray-300 w-4 absolute mt-[10px] ml-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="border border-b-gray-300 pl-9 rounded px-4 py-2 w-[300px] outline-none"
                        />
                    </div>
                    {filteredCountries.map(([fullName, shortName, dialCode]) =>(

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
