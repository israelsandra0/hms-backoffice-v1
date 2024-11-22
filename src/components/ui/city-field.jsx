import React, { forwardRef, useState } from 'react';
import Select from 'react-select'
import { Input } from './input';

const cities = [
    { name: "ago" },
    { name: "isolo" },
    { name: "okota" },
    { name: "amuwo" },
    { name: "ojota" },
]

const CityField = forwardRef(({ ...props }, ref) => {
    const [selectedCity, setSelectedCity] = useState(cities[0]);


    // Handle change in cities selection
    const cityChange = (event) => {
        const cityName = event.target.value;
        const city = cities.find(n => n.name === cityName);
        setSelectedCity(city);
    };

    return (
        
       

        <select id="city" value={selectedCity.name} onChange={cityChange}  {...props} ref={ref} className='focus:outline-none bg-[#F2F2F5] border w-full rounded-[5px] h-10 border-neutral-200' >
            <option value="">Select one</option>
            {cities.map((city, index) => (
                <option key={index} value={city.name} >
                    {city.name}
                </option>
            ))}
        </select>

    );
});

export default CityField;


{/* <Select id='city' >
    <SelectTrigger className='bg-[#F2F2F5] rounded-[0.3rem] h-6'>
        <SelectValue placeholder="Ikeja" />
    </SelectTrigger>
    <SelectContent >
        <SelectGroup>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
            <SelectItem value="west">
                Western European Summer Time (WEST)
            </SelectItem>
            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
            <SelectItem value="ist_indonesia">
                Indonesia Central Standard Time (WITA)
            </SelectItem>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value="awst">
                Australian Western Standard Time (AWST)
            </SelectItem>
            <SelectItem value="acst">
                Australian Central Standard Time (ACST)
            </SelectItem>
            <SelectItem value="aest">
                Australian Eastern Standard Time (AEST)
            </SelectItem>
            <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value="art">Argentina Time (ART)</SelectItem>
            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
        </SelectGroup>
    </SelectContent>
</Select> */}
