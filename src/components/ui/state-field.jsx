import React, { forwardRef, useState } from 'react';

const states = [
    {name: "Abia" },
    {name: "Imo" },
    {name: "Adamawa" },
    {name: "Akwaibom" },
    {name: "Bauchi" },
    {name: "Benue" },
    {name: "Cross River" },
    {name: "Delta" },
    {name: "Ebonyi" },
    {name: "Lagos" },
    {name: "Nassarawa" },
    {name: "Ogun" },
    {name: "Plateau" }
]



const StateField = forwardRef(({ ...props }, ref) => {
    const [selectedState, setSelectedState] = useState(states[0]);


    // Handle change in states selection
    const stateChange = (event) => {
        const stateName = event.target.value;
        const state = states.find(n => n.name === stateName);
        setSelectedState(state);
    };

    return (
        

        <select id="state" value={selectedState.name} onChange={stateChange}  {...props} ref={ref} className='focus:outline-none w-full rounded-[5px] h-10 bg-[#F2F2F5] border border-neutral-200' >
            <option value="">Select one</option>
            {states.map((state, index) => (
                <option key={index} value={state.name} >
                    {state.name}
                </option>
            ))}
        </select>

    );
});

export default StateField;
