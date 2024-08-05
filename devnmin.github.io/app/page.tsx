"use client";
import { PortfolioProvider } from "../context/context";
import { prefix } from "../config/config";
import Navbar from './components/Navbar';
import Image from 'next/image';

export default function Home() {
  return (
    <PortfolioProvider value={ { prefix } }>
      <div className="flex flex-col h-screen">
        <div className="nav-container">
          <Navbar></Navbar>
        </div>
        <main className='flex flex-col justify-center items-center flex-grow'>
          <div className="w-96 h-96 rounded-full overflow-hidden border border-gray-100 shadow-lg dark:border border-neutral-700">
            <Image width={100} height={100} style={{ objectFit: 'contain', width: '100%', height: '100%' }} src={`${prefix}/images/home_pro.jpg`}  alt="내사진" />
          </div>
          <div className="text-center text-xl md:text-3xl lg:text-4xl">
            <p >DevNmin 블로그를 방문해주셔서 감사합니다.</p>
            <p >효율적으로 뛰어난 가치를 제공하며</p>
            <p >감동을 전하고 싶은 개발자</p>
            {/* <span className="font-bold text-gray-100 opacity-70 hover:opacity-100 text-sky-200">조경민</span><span>입니다.</span> */}
            <span className="font-bold text-gray-100 hover:text-sky-200 transition-opacity duration-300 ease-in-out opacity-70 hover:opacity-100">조경민</span><span>입니다.</span>
          </div>
        </main>
      </div>
    </PortfolioProvider>
  );
}
