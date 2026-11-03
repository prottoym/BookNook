
// import Hero from "@/components/Hero";
// import Image from "next/image";

// export default function Home() {
//   return <>
//    <Hero />

//   </>
// }
import { Suspense } from "react";
import Hero from "@/components/Hero";
import HeroWithBooks from "@/components/HeroWithBooks";
import NewArrivals from "@/components/NewArrivals";
import HowItWork from "@/components/HowItWork";
import TopCategories from "@/components/TopCategories";
import Spinner from "@/components/Spinner";

export default function Home() {
  return (
    <>
      {/* The banner shows real books. The drawn book stack shows while they load. */}
      <Suspense fallback={<Hero />}>
        <HeroWithBooks />
      </Suspense>
      {/* New Arrivals loads from the server, so show a spinner while we wait */}
      <Suspense
        fallback={
          <div className="bg-[#f6f3e6]">
            <Spinner label="Loading new arrivals..." />
          </div>
        }
      >
        <NewArrivals />
      </Suspense>
      <HowItWork />
      <TopCategories />
    </>
  );
}
