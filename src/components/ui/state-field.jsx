import React, { forwardRef } from "react";

const StateField = forwardRef(({ options, onChange, value, ...props }, ref) => {

    const stateChange = (event) => {
        const selectedValue = event.target.value;
        onChange(selectedValue); 
    };

    return (
        <div>
            <select
                id="state"
                value={value}  
                onChange={stateChange}
                ref={ref} 
                {...props}
                className="focus:outline-none w-full rounded-[5px] h-10 bg-[#F2F2F5] border border-neutral-200"
            >
                <option value="">Select a state</option>
                {options?.length > 0 && options.map(({stateName}, index) => (
                    <option key={index} value={stateName}>
                        {stateName}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default StateField;
