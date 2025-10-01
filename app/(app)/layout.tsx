import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import AuthProvider from "@/context/AuthProvider";
import NavBarComp from "@/components/app/Navbar";
import FooterComp from "@/components/app/footer";
import TopContactComp from "@/components/app/TopNav";
import { auth } from "@/auth";

 

export const metadata: Metadata = {
  title: "Yandas Collection",
  description: "for the best",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  return (
    <>
      <TopContactComp />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <NavBarComp />
        {children}
      </div>

      <FooterComp />

    </>
  );
}
