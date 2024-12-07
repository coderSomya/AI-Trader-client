import { Button } from "@/components";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen md:px-10 py-5 p-5">
      <p className="mx-auto md:w-8/12 text-center pt-20 pb-5 font-extralight text-xl md:text-5xl">
        Tryout{" "}
        <a
          href="/"
          rel="noopener noreferrer"
          className="font-bold"
        >
         AI driven trading...!
        </a>
        <hr/>
        <hr/>
        Or checkout....{" "}
        <a
          href="https://wagmi.sh/"
          rel="noopener noreferrer"
          className="font-bold"
        >
          Wagmi
        </a>
        ,{" "}
        <a
          href="https://viem.sh/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold"
        >
          Viem
        </a>{" "}
        &{" "}
        <a
          href="https://www.rainbowkit.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold"
        >
          Rainbowkit
        </a>
      </p>
      <div className="text-xl text-center pt-5 text-bold">
  ETH India 2024
      </div>
    </main>
  );
}
