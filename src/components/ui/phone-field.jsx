import React, { forwardRef, useState } from 'react';
import { Input } from './input';

const countries = [
  { name: 'United States', code: '+1', flag: '🏴' },
  { name: 'Nigeria', code: '+234', flag: '🏁'},
  { name: 'United Kingdom', code: '+44', flag: '⛳' },
  { name: 'Canada', code: '+1', flag: '🏳' },
  { name: 'India', code: '+91', flag: '🚩' },
  { name: 'Australia', code: '+61', flag: '🎌' },
  { name: 'Germany', code: '+49', flag: '🎈' },
  { name: 'France', code: '+33', flag: '✨' }
];

const PhoneField = forwardRef(({...props}, ref) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); 


  // Handle change in country selection
  const countryChange = (event) => {
    const countryCode = event.target.value;
    const country = countries.find(c => c.code === countryCode);
    setSelectedCountry(country); 
  };

  return (
    <div className='flex'>
      
        <select id="country" value={selectedCountry.code} onChange={countryChange} className='focus:outline-none bg-[#F2F2F5] border-r-0 mr-[-2x] border border-neutral-200' >
            {countries.map((country, index) => (
            <option key={index} value={country.code} >
                {country.flag} {country.code}
            </option>
            ))}
        </select>
        <Input id="phone" type="tel"   {...props} ref={ref} className='border-l-0' />
   
    </div>
  );
});

export default PhoneField;




// const PasswordField = forwardRef(({...props}, ref) => {

//     const [passwordVisible, setpasswordVisible] = useState(false)
    

//     function togglePassword(){
//         setpasswordVisible(!passwordVisible)
//     }

//     return(
//         <div className="flex gap-2">
//             <Input type={passwordVisible ? 'text' : 'password'} {...props} ref={ref} />
//         </div>
        
//     )
// })  
// export default PasswordField