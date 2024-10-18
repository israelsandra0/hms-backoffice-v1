// import { useForm } from "react-hook-form"
// import { Link } from "react-router-dom";
// import { yupResolver } from "@hookform/resolvers/yup";
// import 'remixicon/fonts/remixicon.css'
// import * as yup from 'yup'

// export default function SignUpPage(){

//     const yupBuild = yup.object({
//         userName: yup.string().required('username is required'),
//         password: yup.string().min(5).required('password is required'),
//         conPassword: yup.string().min(5).required('confirm password is required'),
//         email: yup.string().email('email is invalid').required('email is required')
//     })

//     const formData = useForm({
//         defaultValues:{userName: '',  email: '', password: '', conPassword: ''},
//         resolver: yupResolver(yupBuild)
//     })

//     return(
        
//         <form className="signUpBox" onSubmit={formData.handleSubmit((data) => {console.log(data)})}>
//             <h1 className="text-[1.5rem] mb-4">User SignUp</h1>

//             <input {...formData.register ("userName")} placeholder="Name ..." /> 
//             <p  className="text-red-700">{formData.formState.errors.userName?.message}</p> <br />

//             <input {...formData.register ("email")} placeholder="Email@example.com" /> 
//             <p  className="text-red-700">{formData.formState.errors.email?.message}</p> <br />
          
//             <input type="password" {...formData.register ("password")}placeholder="Password" />
//             <p  className="text-red-700">{formData.formState.errors.password?.message}</p><br />

//             <input type="password" {...formData.register ("conPassword")}placeholder="ConfirmP" />
//             <p  className="text-red-700">{formData.formState.errors.conPassword?.message}</p><br /><br />

//             <button type="submit"className="rounded-[10px] bg-gray-700 py-2 px-8 text-white" >Sign Up</button>
//             <Link to={'/'}>
//                 <button type="submit"className="rounded-[10px] bg-gray-700 py-2 px-8 text-white" >Log In</button>
//             </Link>
//         </form>
    
//     )
// }