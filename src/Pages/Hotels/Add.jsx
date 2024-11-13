import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button_link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { post } from "@/functions";
import { BACKEND_URL } from "@/constants";

export default function Add() {
  //yup builder for input error msg
  const yupBuild = yup.object({
    name: yup.string().required("name is required"),
    email: yup.string().required("email is required").email(),
    website: yup.string().required("website is required").url().nullable(),
  });

  //destructured hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: { name: "", email: "", website: "" },
    resolver: yupResolver(yupBuild),
  });

  const [disabledButton, setDisabledButton] = useState(false);

  const { refetch } = useQuery({
    enabled: false,
    queryKey: ["hotels"],
    queryFn: async () => {
      const hotelInput = getValues();

      setDisabledButton(true);

      try {
        const hotelData = {
          name: hotelInput.name,
          email: hotelInput.email,
          website: hotelInput.website,
        };

        const res = await post(`${BACKEND_URL}/hotels/store`, hotelData);
        console.log(res);

        if (res.status.toString().startsWith(4)) {
          setDisabledButton(false);
          // setErrorMessage('invalid credentials')

          return null;
        }
        if (res.status === 500) {
          setDisabledButton(false);
          // setErrorMessage('An error occurred, please try again')
          return null;
        }
        const responseData = await res.json();

        setTimeout(() => (window.location.href = "/hotels"), 100);

        setDisabledButton(true);
        return responseData;
      } catch (error) {
        console.log(error);
      }
    },
  });

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
          <form
            onSubmit={handleSubmit(refetch)}
            className="hotelForm w-4/5 text-left"
          >
            <div className="ml-4">
              <div className="p-2">
                <label htmlFor="name">Name of hotel</label>
                <br />
                <Input
                  {...register("name")}
                  id="name"
                  className=" outline-none text-black "
                />
                <p className="text-red-700">{errors.name?.message}</p>
              </div>

              <div className="p-2">
                <label htmlFor="email">Email</label>
                <br />
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  className=" outline-none text-black "
                />
                <p className="text-red-700">{errors.email?.message}</p>
              </div>

              <div className="p-2">
                <label htmlFor="website">Website</label>
                <br />
                <Input
                  {...register("website")}
                  id="website"
                  className=" outline-none text-black"
                />
                <p className="text-red-700">{errors.website?.message}</p>
              </div>
            </div>

            <Button
              disabled={!!disabledButton}
              className=" mt-12 ml-6"
              type="submit"
            >
              {disabledButton ? "Submitting..." : "submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
