/* eslint-disable @typescript-eslint/no-explicit-any */
import { pusher } from "@/lib/pusher";
import { redis } from "@/lib/redis";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const play = searchParams.get("play");

  const oldPlay =
    (await redis.get("stopwatch")) ??
    JSON.stringify({ play: false, reset: false, time: 0 });
  const data: any = { ...oldPlay };

  if (play?.toLocaleLowerCase() == "mulai") {
    await pusher.trigger("stopwatch", "updated", { play: true, reset: false });
    await redis.set("stopwatch", JSON.stringify({ play: true, reset: false }));
    data.play = true;
    return new Response(
      JSON.stringify({ message: "Stopwatch started", ...data }),
      {
        status: 201,
      }
    );
  } else if (play?.toLocaleLowerCase() == "stop") {
    await pusher.trigger("stopwatch", "updated", { play: false, reset: false, time: data.time });
    await redis.set("stopwatch", JSON.stringify({ play: false, reset: false, time: data.time }));
    data.play = false;
    return new Response(
      JSON.stringify({ message: "Stopwatch stopped", ...data }),
      {
        status: 201,
      }
    );
  } else if (play?.toLocaleLowerCase() == "reset") {
    await pusher.trigger("stopwatch", "updated", { play: false, reset: true, time: 0 });
    await redis.set("stopwatch", JSON.stringify({ play: false, reset: true, time: 0 }));
    data.play = false;
    data.reset = true;
    data.time = 0;
    return new Response(
      JSON.stringify({ message: "Stopwatch reset", ...data }),
      {
        status: 201,
      }
    );
  }

  await pusher.trigger("stopwatch", "updated", { ...data });
  return new Response(JSON.stringify({ message: "Stopwatch Get", ...data }), {
    status: 200,
  });
};

export const POST = async (req: Request) => {
  const { time, play, reset } = await req.json();

  await redis.set("stopwatch", JSON.stringify({ play, reset, time }));
  return new Response(
    JSON.stringify({ message: "Stopwatch Set", time, play, reset }),
    {
      status: 201,
    }
  );
};
