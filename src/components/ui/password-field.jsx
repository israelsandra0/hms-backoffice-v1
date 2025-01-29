import { forwardRef, useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const PasswordField = forwardRef(({...props}, ref) => {

    const [passwordVisible, setpasswordVisible] = useState(false)
    

    function togglePassword(){
        setpasswordVisible(!passwordVisible)
    }

    return(
        <div className="flex gap-2">
            <Input type={passwordVisible ? 'text' : 'password'} {...props} ref={ref}  maxLength='50' />
            <Button variant='ghost' className=" ml-[-4rem] hover:bg-0" onClick={togglePassword} type='button'>
                {passwordVisible ? <EyeOffIcon className="h-4" /> : <EyeIcon className="h-4"/>}
            </Button>
        </div>
        
    )
})  
export default PasswordField