/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from 'swr'
import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react';


const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data: dataScore, isLoading: isLoadingScore } = useSWR(
    '/api',
    fetcher,
    {
      refreshInterval: 500,
    }
  );

  const { data: dataStopwatch, isLoading: isLoadingStopwatch } = useSWR(
    '/api/stopwatch',
    fetcher,
    {
      refreshInterval: 100,
    }
  );
  // const [play, setPlay] = useState<boolean>(true)
  const [time, setTime] = useState<number>(0);
  const intervalRef = useRef<any>(null);

  const formatNumberShort = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return num.toString();
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (dataStopwatch?.play == true) {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // update setiap 10ms (0.01 detik)
    } else if(dataStopwatch?.play == false && dataStopwatch?.reset == false) {
      clearInterval(intervalRef.current);
      (async () => await fetch('/api/stopwatch', { method: 'POST', body: JSON.stringify({ play: false, reset: false, time }) }))();
    } else if(dataStopwatch?.reset == true) {
      clearInterval(intervalRef.current);
      (async () => await fetch('/api/stopwatch', { method: 'POST', body: JSON.stringify({ play: false, reset: false, time: 0 }) }))();
      setTime(0);
    }
    if(dataStopwatch?.time) {
      setTime(Number(dataStopwatch?.time));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dataStopwatch]);

  if (isLoadingScore || isLoadingStopwatch) return (<div className='fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center flex-col gap-2 bg-white text-black'>
    <h1 className="flex items-center gap-3 text-4xl font-semibold">Loading <Loader2 className='animate-spin' size={35} /> </h1>
    <p className="text-sm text-slate-700">&quot;Sedang menyiapkan score tatami&quot;</p>
  </div>)

  return (
    <div className="bg-slate-100 h-screen overflow-y-auto">
      <div className="text-center">
        <h1
          className="text-4xl font-bold text-center poppins-semibold my-5 rounded-md bg-cyan-400 text-white inline-block px-5 p-1">
          TATAMI</h1>
      </div>
      <div className="container mx-auto space-y-16 lg:space-y-20 mb-5 mt-8 lg:mt-20">
        <div className="flex flex-col lg:flex-row justify-around gap-12  lg:gap-1 items-center">
          <div className="flex flex-col items-center gap-1">
            <h1 className="poppins-semibold font-bold text-2xl lg:text-3xl text-black">PEMAIN 1</h1>
            <p className="poppins-regular text-slate-700 text-sm">&quot;Perguruan Daerah&quot;</p>
            <div className="w-40 h-40 bg-red-500 text-white p-4 py-8 rounded-md mt-5 flex justify-center items-center">
              <h1 className={`score-kiri font-semibold poppins-semibold ${dataScore.score_kiri > 1000 ? 'text-4xl lg:text-6xl' : 'text-6xl lg:text-8xl'}`}>{formatNumberShort(dataScore.score_kiri)}</h1>
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
          <h1 className="text-5xl lg:text-6xl font-semibold poppins-semibold text-black">VS</h1>
          <div className="flex flex-col items-center gap-1">
            <h1 className="poppins-semibold font-bold text-2xl lg:text-3xl text-black">PEMAIN 2</h1>
            <p className="poppins-regular text-slate-700 text-xs lg:text-sm">&quot;Perguruan Daerah&quot;</p>
            <div className="w-40 h-40 bg-blue-500 text-white p-4 py-8 rounded-md mt-5 flex justify-center items-center">
              <h1 className={`score-kanan font-semibold poppins-semibold ${dataScore.score_kanan > 1000 ? 'text-4xl lg:text-6xl' : 'text-6xl lg:text-8xl'}`}>{formatNumberShort(dataScore.score_kanan)}</h1>
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
          {/* <button className="bg-black rounded-md p-2 px-3 text-white poppins-regular cursor-pointer shadow" onClick={() => setPlay(!play)}>{play ? 'Stop' : 'Start'}</button>  */}
          <div
            className="text-5xl lg:text-7xl bg-black text-white text-center w-50 lg:w-64 flex justify-center items-center p-2 py-3 rounded-md poppins-semibold font-semibold relative">
            {formatTime(time).split(".")[0]} <sup className="text-lg lg:text-3xl font-medium">{formatTime(time).split(".")[1]}</sup></div>
        </div>
      </div >
    </div>
  );
}
