import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button_link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'

export default function Add() {
    return (
        <>
            <div>
                <ButtonLink to="/hotels">← Back</ButtonLink>
            </div>

            <Card className="w-4/5 text-center ">
                <CardHeader>
                    <CardTitle>ADD HOTEL</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action="" className="w-4/5 text-left">
                        <div className='ml-4'>
                            <div className="p-2">
                                <label for="name">Name of hotel</label><br />
                                <Input id="name" className=" outline-none text-black " /><br />
                            </div>

                            <div className="p-2">
                                <label for="email">Email</label><br />
                                <Input type='email' id="email" className=" outline-none text-black " /><br />
                            </div>

                            <div className="p-2">
                                <label for="website">Website</label><br />
                                <Input id="website" className=" outline-none text-black" /><br />
                            </div>
                        </div>

                        <Button className=" mt-12 ml-6" type='submit'>Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

