import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription} from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import { useState } from "react"
import { AUTH_DATA_KEY, USER_DATA_KEY } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import { UAParser } from "ua-parser-js"
import { BACKEND_URL } from "@/constants"
import { encode, get, post } from "@/functions"






export default function LoginPage() {

    //yup builder for input error msg
    const yupBuild = yup.object({
        username: yup.string().required('username is required'),
        password: yup.string().required('password is required').min(5).max(20)
    })

    //destructured hook form 
    const {register, handleSubmit, formState: {errors}, getValues} = useForm({
        defaultValues: {username: '', password: ''},
        resolver: yupResolver(yupBuild)
    })  

    // alert error message
    const [errorMessage, setErrorMessage] = useState("")

    //for disabling button after first click
    const [disabledButton, setDisabledButton] = useState(false)




    async function getAuthUser(){ 

        try {
            const response = await get(`${BACKEND_URL}/auth/me`)

            const {data} = await response.json()
            console.log('res', data)

            localStorage.setItem(USER_DATA_KEY, encode(JSON.stringify(data))) 

        }catch(error){
            console.log(error)
        }finally{
            console.log('done')
        }
    } 
 
   
    

    const {refetch} = useQuery({
        enabled: false,                                          //disables it from executing immediately 
        queryKey: ['login'],
        queryFn: async () => {
            const userInput = getValues()                        //hook form function to get user input data
            console.log('working', {userInput})


            //getting user device details
            let parser = new UAParser(window.navigator.userAgent) 
            let parserResults = parser.getResult();
            console.log(parserResults);

            setErrorMessage()
            
            setDisabledButton(true)

            try{

                const loginData = {
                    username: userInput.username, 
                    password: userInput.password,
                    deviceDetails:{
                        "deviceName": !parserResults?.device?.name ? 'unknown' : `${parserResults.device.vendor} - ${parserResults.device.model} (${parserResults.device.type}) ` ,
                        "os": `${parserResults.os.name} ${parserResults.os.version}`,
                        "browserName": `${parserResults.browser.name} ${parserResults.browser.version}`
                    }
                }

                const res = await post(`${BACKEND_URL}/auth/login`, loginData)
                
                if(res.status === 400 || res.status === 404 ){
                    setDisabledButton(false)
                    setErrorMessage('Invalid credentials')
                    return {}
                }   
                if(res.status === 500 ){
                    setDisabledButton(false)
                    setErrorMessage('An error occurred, please try again')
                    return {}
                }   
                const responseData = await res.json();
                console.log("fetched data:", responseData)

                
                localStorage.setItem(AUTH_DATA_KEY, encode(JSON.stringify(responseData)));
                
                
                await getAuthUser(responseData.accessToken);

                
                // navigate("/Dashboard")
                setTimeout(() =>  window.location.href = '/dashboard', 100)
                // setTimeout(() =>  navigate("/Dashboard"), 100)
                
                setDisabledButton(false)
                return responseData;

            }catch(error){
                console.log(error)
            }           
        }
    })
   


  return (
    <>
        <div className="grid place-items-center gap-12 mt-8"> 
            {!!errorMessage?.length && <Alert className="alert text-red-900 border-0 h-full w-[320px]  bg-[#fee]" >
                <AlertDescription>
                    {errorMessage}
                </AlertDescription>
                        
            </Alert>}

            <Card className="w-[350px] static shadow-2xl rounded-[15px] p-4">
                <CardHeader>
                    <CardTitle className=" text-center mb-2">Log In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(refetch)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                {/* registers the username as a data */}
                                <Input  {...register('username')} placeholder="Username" id="inpPlain"/>
                                <p  className="text-red-700">{errors.username?.message}</p>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Input type="password" {...register('password')} placeholder="Password" />
                                <p  className="text-red-700">{errors.password?.message}</p>
                            </div>

                        </div><br />
                        <Button variant="outline" disabled={!!disabledButton} type='submit' className=" bg-gray-500 text-white">{disabledButton ? 'Submitting...' : 'Log In'}</Button>
                        
                    </form>
                </CardContent>
                
            </Card>
        </div>
            
    </>
  )

}




