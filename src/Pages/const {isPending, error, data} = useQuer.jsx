const {isPending, error, data} = useQuery({
        queryKey: [''],
        queryFn: async (userInput) => {
            //error mgs clears for new one && comes before another submission
            setErrorMessage()
            
            setDisabledButton(true)
            const res = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userInput.username,
                    password: userInput.password,
                })
            })
            const responseData = await res.json()
            if(res.status === 400 ){
                setDisabledButton(false)
                // return  error.message + 'invalid credentials'
                return setErrorMessage(error.message)
            }
            if(isPending) return 'loading ...'
            
            //user data storage and page navigation
            localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(responseData));
            
            //passed the access token as an argument to access the token from the data
            await getAuthUser(responseData.accessToken)  
            
            // navigate("/Dashboard")
            setTimeout(() =>  window.location.href = '/dashboard', 100)
            // setTimeout(() =>  navigate("/Dashboard"), 100)
            
            console.log(responseData)
            // return await res.json()
        }
        setDisabledButton(false)

})