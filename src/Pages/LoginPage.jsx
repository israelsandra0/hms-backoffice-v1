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
import { encode } from "@/functions"





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

    //navigate when clicked
    // const navigate = useNavigate();

    // alert error message
    const [errorMessage, setErrorMessage] = useState("")

    //for disabling button after first click
    const [disabledButton, setDisabledButton] = useState(false)

    
    //getting the user access token from the response then passing it as a parameter
    async function getAuthUser(token){ 
        console.log("access token: ", token)

        try {
            const res = await fetch(`${BACKEND_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass JWT via Authorization header
                },  
            })


            const response = await res.json()
            console.log(response)
            localStorage.setItem(USER_DATA_KEY, encode(JSON.stringify(response.data))) 

            
            // console.log(data)
        }catch(error){
            console.log(error)
        }finally{
            console.log('done')
        }   
      

    }

    // async function login(userInput) {
    //     //error mgs clears for new one && comes before another submission
    //     setErrorMessage()


    //     try {
    //         //added the disabled button
    //         setDisabledButton(true)
    //         const res = await fetch('https://dummyjson.com/auth/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 username: userInput.username,
    //                 password: userInput.password,
    //             })
    //         })
        
    //         //waits for api response and returns as json_string
    //         const data = await res.json()

    //         //response status that displays error message 
    //         if (res.status === 400 ){
    //             setDisabledButton(false)
    //             return setErrorMessage(data.message)
    //         }

    //         //user data storage and page navigation
    //         localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(data));

    //         //passed the access token as an arguement to access the token from the data
    //         await getAuthUser(data.accessToken)     
            

                  
    //         // navigate("/Dashboard")
    //         setTimeout(() =>  window.location.href = '/dashboard', 100)
    //         // setTimeout(() =>  navigate("/Dashboard"), 100)
         
    //         console.log(data)
            
    //     }catch(error){
    //         setDisabledButton(false)
    //         console.log(error)
    //     }finally{
    //         console.log('done')
    //     }
        
    // }
     

    
    //  if (res.status === 400 ){
    //             setDisabledButton(false)
    //             return setErrorMessage(data.message)
    //         }

    // if(isPending) return 'loading ...'
    // if(error) return 'loading ...'
    
    
    //using refetch allows to trigger the useQuery manually
    
    // const username = document.querySelector('#inpPlain')
    // const $inpEncoded = document.querySelector('#inpEncoded');

    // function bytesToBase64(bytes) {
    //     const binString = Array.from(bytes, (byte) =>
    //         String.fromCodePoint(byte),
    //     ).join("");
    //     return btoa(binString);
    // }

    // function secretReplace(plain) {
    //     return plain
    //         .replace(/[a]/g, '?x_')
    //         .replace(/[m]/g, '?n_')
    //         .replace(/[z]/g, '?a_')
    // }
    // function encode(text) {
    //     // replace carriage returns and new line feeds
    //     text = text.replace(/[\r\n]/g, '', new TextEncoder().encode(text))
        
    //     // base64 encode
    //     const base64Encoded = bytesToBase64(Uint8Array.from(text, (m) => m.codePointAt(0)))
    //     console.log('Here: ', {base64Encoded})
    //     localStorage.setItem('dataKey', JSON.stringify(base64Encoded));

    //     // replace a, b, c
    //     const replaced = secretReplace(base64Encoded)

    //     // return string
    //     return replaced
    // }
    

    // const value = username.trim()

    // if (!value.length) alert("enter value to encode")

    // $inpEncoded.textContent = encode();


    const {refetch} = useQuery({
        enabled: false, //disables it from executing immediately 
        queryKey: ['login'],
        queryFn: async () => {
            const userInput = getValues() //hook form function to get user input data
            console.log('working', {userInput})


            //getting user device details
            let parser = new UAParser(window.navigator.userAgent) // you need to pass the user-agent for nodejs
            let parserResults = parser.getResult();
            console.log(parserResults);

            setErrorMessage()
            
            setDisabledButton(true)

           try{
                const res = await fetch(`${BACKEND_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: userInput.username, 
                        password: userInput.password,
                        deviceDetails:{
                                "deviceName": !parserResults?.device?.name ? 'unknown' : `${parserResults.device.vendor} - ${parserResults.device.model} (${parserResults.device.type}) ` ,
                                "os": `${parserResults.os.name} ${parserResults.os.version}`,
                                "browserName": `${parserResults.browser.name} ${parserResults.browser.version}`
                            }
                        })
                })
                if(res.status === 400 ){
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

                // Call your function to get the authenticated user
                //passed the access token as an argument to access the token from the data
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
    // function getDeviceInfo() {
    //     const userAgent = navigator.userAgent;

    //     let deviceName = "Unknown Device";

    //     // Check user agent for specific devices
    //     if (/android/i.test(userAgent)) {
    //         deviceName = "Android Device";
    //     } else if (/iPhone/i.test(userAgent)) {
    //         deviceName = "iPhone";
    //     } else if (/iPad/i.test(userAgent)) {
    //         deviceName = "iPad";
    //     } else if (/Macintosh/i.test(userAgent)) {
    //         deviceName = "Mac";
    //     } else if (/Windows/i.test(userAgent)) {
    //         deviceName = "Windows Device";
    //     } else if (/Linux/i.test(userAgent)) {
    //         deviceName = "Linux Device";
    //     }

    //     return console.log(deviceName)
    // }

    



  return (
    <>
        <div className="grid place-items-center gap-12 mt-8"> 
            {/* add the body containing the alert error mgs */}
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




        // fetch('https://dummyjson.com/auth/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
                
        //         username: '',
        //         password: '',
        //         // expiresInMins: 30, // optional, defaults to 60
        //     }),
        //     // credentials: 'include' // Include cookies (e.g., accessToken) in the request
        // })
        // .then(res => {
        //     console.log(res.status)
        //     res.json()
        // })
        // .then((data) => console.log(data))
        // .catch((error) => console.log(error))
        // .finally(() => console.log('done'))


// export function Profile(){

//     const [userData, setUserData] = useState('')
//     const handleInputChange = (e) => {
//         setUserData(e.target.value);
//     };
    
//     return (
//         <Dashboard user={userData}/>
//     )
// }




