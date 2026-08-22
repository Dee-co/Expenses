"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Homepage(){
  const router = useRouter();
  useEffect(()=>{
    const accessToken = localStorage.getItem("accessToken")
    if(accessToken){
      router.replace("/finance")
    }else{
      router.replace("/auth/signin")
    }
  },[])
}