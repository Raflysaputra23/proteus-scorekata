"use client";

import useSWR from 'swr'
import { useEffect } from 'react'


const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data, isLoading } = useSWR(
    '/api',
    fetcher, {
    refreshInterval: 1000, 
  }
  );

  useEffect(() => {
    const interval = setInterval(() => {
    }, 1000);
    return () => clearInterval(interval);

  }, [data]);

  if (isLoading) return <div className='fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-white text-4xl text-black'>Loading</div>


  return (
    <div className="bg-slate-100 h-screen">
      <div className="text-center">
        <h1
          className="text-4xl font-bold text-center poppins-semibold my-5 rounded-md bg-cyan-400 text-white inline-block px-5 p-1">
          TATAMI</h1>
      </div>
      <div className="container mx-auto space-y-20">
        <div className="flex justify-around items-center mt-20">
          <div className="flex flex-col items-center gap-1">
            <h1 className="poppins-semibold font-bold text-3xl text-black">PEMAIN 1</h1>
            <p className="poppins-regular text-slate-700 text-sm">&quot; Perguruan Daerah &quot;</p>
            <div className="w-48 h-48 bg-red-500 text-white p-4 py-8 rounded-md mt-5 flex justify-center items-center">
              <h1 className="score-kiri font-semibold poppins-semibold text-8xl">
                {data.data.score_kiri}</h1>
            </div>
            <div className="space-x-0.5 mt-2">
              {/* <button
              className="bg-blue-500 increment-kiri rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">+1</button>
            <button
              className="bg-blue-500 increment-kiri rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">+2</button>
            <button
              className="bg-blue-500 increment-kiri rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">+3</button>
            <button
              className="bg-red-500 reset-kiri rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">Reset</button>  */}
            </div>
          </div>
          <h1 className="text-6xl font-semibold poppins-semibold text-black">VS</h1>
          <div className="flex flex-col items-center gap-1">
            <h1 className="poppins-semibold font-bold text-3xl text-black">PEMAIN 2</h1>
            <p className="poppins-regular text-slate-700 text-sm">&quot; Perguruan Daerah &quot;</p>
            <div className="w-48 h-48 bg-blue-500 text-white p-4 py-8 rounded-md mt-5 flex justify-center items-center">
              <h1 className="score-kanan font-semibold poppins-semibold text-8xl">{data.data.score_kanan}</h1>
            </div>
            <div className="space-x-0.5 mt-2">
              {/* <button
            className="bg-blue-500 increment-kanan rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">+1</button>
          <button
            className="bg-blue-500 increment-kanan rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">+2</button>
          <button
            className="bg-blue-500 increment-kanan rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">+3</button>
          <button
            className="bg-red-500 reset-kanan rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">Reset</button> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5">
          {/* <button className="bg-red-500 reset rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow">Reset
          Semua</button>  */}
          <h1
            className="text-7xl bg-black text-white text-center w-60 p-2 rounded-md poppins-semibold font-semibold relative">
            0:00 <span className="absolute right-6 top-4 text-sm">00</span></h1>

        </div>
      </div >
    </div>
  );
}
