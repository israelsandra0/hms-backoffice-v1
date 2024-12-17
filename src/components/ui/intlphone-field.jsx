import { ChevronDown } from "lucide-react";
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

    function toggle() {
        setVisible(!visible)
    }

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

                <div className={`p-4 ${visible ? '' : 'hidden'} bg-white shadow-lg  h-[200px] overflow-y-scroll rounded-[5px] absolute w-full border border-neutral-200`}>
                    {defaultCountries.map(([fullName, shortName, dialCode]) =>(

                        <div 
                            key={shortName} 
                            className={`flex justify-between cursor-pointer p-2  rounded-[5px] ${shortName == country.iso2 ? 'bg-blue-100' : 'hover:bg-gray-100'}`}  
                            onClick={() => {
                                setCountry(shortName) 
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
