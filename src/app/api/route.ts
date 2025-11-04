import { redis } from "@/lib/redis";
import { pusher } from "@/lib/pusher";

interface Juri {
  deviceId: string;
  votes: "red" | "blue";
  score: number;
}

const rounds: Juri[] = [];

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const scoreKiri = Number(searchParams.get("score_kiri"));
  const scoreKanan = Number(searchParams.get("score_kanan"));
  const resetKanan = searchParams.get("reset_kanan");
  const resetKiri = searchParams.get("reset_kiri");

  const oldScoreKiri = Number(await redis.get("score_kiri")) ?? 0;
  const oldScoreKanan = Number(await redis.get("score_kanan")) ?? 0;

  const data = { score_kiri: oldScoreKiri, score_kanan: oldScoreKanan };

  try {
    if (scoreKiri) {
      data.score_kiri = data.score_kiri + scoreKiri;
      await pusher.trigger("score", "updated", {
        score_kiri: data.score_kiri,
        score_kanan: data.score_kanan,
      });
      await redis.set("score_kiri", data.score_kiri);
      return new Response(
        JSON.stringify({ message: "Score updated", ...data }),
        {
          status: 201,
        }
      );
    }

    if (scoreKanan) {
      data.score_kanan = data.score_kanan + scoreKanan;
      await pusher.trigger("score", "updated", {
        score_kiri: data.score_kiri,
        score_kanan: data.score_kanan,
      });
      await redis.set("score_kanan", data.score_kanan);
      return new Response(
        JSON.stringify({ message: "Score updated", ...data }),
        {
          status: 201,
        }
      );
    }

    if (resetKanan && resetKiri) {
      data.score_kanan = 0;
      data.score_kiri = 0;
      await pusher.trigger("score", "updated", {
        score_kiri: data.score_kiri,
        score_kanan: data.score_kanan,
      });
      await redis.set("score_kanan", 0);
      await redis.set("score_kiri", 0);
      return new Response(
        JSON.stringify({ message: "Score updated", ...data }),
        {
          status: 201,
        }
      );
    }

    if (resetKiri) {
      data.score_kiri = 0;
      await pusher.trigger("score", "reset", {
        score_kiri: data.score_kiri,
        score_kanan: data.score_kanan,
      });
      await redis.set("score_kiri", 0);
      return new Response(
        JSON.stringify({ message: "Score updated", ...data }),
        {
          status: 201,
        }
      );
    }

    if (resetKanan) {
      data.score_kanan = 0;
      await pusher.trigger("score", "reset", {
        score_kiri: data.score_kiri,
        score_kanan: data.score_kanan,
      });
      await redis.set("score_kanan", 0);
      return new Response(
        JSON.stringify({ message: "Score updated", ...data }),
        {
          status: 201,
        }
      );
    }

    // INIT DATA AWAL
    await pusher.trigger("score", "updated", { ...data });
    return new Response(JSON.stringify({ message: "Data Score", ...data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Something went wrong", error }),
      {
        status: 404,
      }
    );
  }
};

export const POST = async (request: Request) => {
  try {

    const { deviceId, team, score } = await request.json();
    if (!deviceId || !score || (team !== "red" && team !== "blue")) {
      return new Response(JSON.stringify({ message: "Invalid request" }), {
        status: 400,
      });
    }
  
    if (rounds.some((juri) => juri.deviceId === deviceId)) {
      rounds.push({ deviceId, votes: team, score });
    }
  
    if (rounds.length >= 4) {
      const score: number[] = rounds.map((juri) => juri.score);
      const teamBlue = rounds.map(juri => juri.votes == "blue");
      const teamRed = rounds.map(juri => juri.votes == "red");
  
      const teamVote = teamBlue > teamRed ? "blue" : "red";
  
      const skorTertinggi = Math.max(...score);
      await pusher.trigger("score", "updated", {
          score: skorTertinggi,
          team: teamVote,
      });
  
      rounds.length = 0;
      return new Response(JSON.stringify({
        message: "Score updated",
        team: teamVote,
        score: skorTertinggi,
      }));
    }
  
    return new Response(JSON.stringify({
      message: "Voting success",
      team,
      jumlahVoting: rounds.length
    }), {
      status: 200
    })
  } catch(error) {
    return new Response(JSON.stringify({ message: "Something went wrong", error }), {
      status: 404,
    })
  }
};
