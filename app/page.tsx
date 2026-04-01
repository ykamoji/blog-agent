"use client";

// import Image from 'next/image'
// import Link from 'next/link'
import Root from "@/app/pages/Root";
import Providers from "@/app/utils/Providers";

export default function Home() {
  return (
       <Providers>
          <Root/>
       </Providers>
  )
}
