import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/* =========================================================
   API de la cuponera (estado compartido entre dispositivos)
   ---------------------------------------------------------
   GET  /api/cupones  -> { reclamados: [0, 2, ...] }
   POST /api/cupones  -> body { indice: 0 } marca ese cupón
   ========================================================= */

// Vercel expone las credenciales de Redis con dos nombres posibles según
// la integración (Upstash nativo o el antiguo Vercel KV). Aceptamos ambos.
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Si no hay base de datos configurada, la app sigue funcionando (con
// localStorage como respaldo) en lugar de romperse.
const redis = url && token ? new Redis({ url, token }) : null;

// Una sola clave: un "set" con los índices de los cupones ya reclamados.
const CLAVE = "cupones-reclamados";

// Nunca cachear: siempre queremos el estado más reciente entre dispositivos.
export const dynamic = "force-dynamic";

// Convierte los miembros del set (strings) en una lista de índices limpios.
function aIndices(miembros) {
  return (miembros || [])
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n) && n >= 0)
    .sort((a, b) => a - b);
}

export async function GET() {
  if (!redis) {
    return NextResponse.json({ reclamados: [], sinBaseDatos: true });
  }
  try {
    const miembros = await redis.smembers(CLAVE);
    return NextResponse.json({ reclamados: aIndices(miembros) });
  } catch {
    return NextResponse.json({ reclamados: [], error: true });
  }
}

export async function POST(request) {
  if (!redis) {
    return NextResponse.json(
      { ok: false, sinBaseDatos: true },
      { status: 503 }
    );
  }
  try {
    const { indice } = await request.json();
    if (!Number.isInteger(indice) || indice < 0) {
      return NextResponse.json(
        { ok: false, error: "índice inválido" },
        { status: 400 }
      );
    }
    await redis.sadd(CLAVE, indice);
    const miembros = await redis.smembers(CLAVE);
    return NextResponse.json({ ok: true, reclamados: aIndices(miembros) });
  } catch {
    return NextResponse.json({ ok: false, error: true }, { status: 500 });
  }
}
