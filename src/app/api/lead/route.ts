import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = process.env.APPS_SCRIPT_URL;

  if (!url) {
    return NextResponse.json({ success: false, error: "APPS_SCRIPT_URL não configurada" }, { status: 500 });
  }

  try {
    const body = await req.json();

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const text = await response.text();

    // GAS pode retornar HTML em caso de erro — tenta parsear JSON, senão loga
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch {
      console.error("[lead] GAS respondeu com HTML:", text.slice(0, 200));
      return NextResponse.json({ success: false, error: "Resposta inesperada do GAS" }, { status: 502 });
    }
  } catch (err) {
    console.error("[lead] Erro ao encaminhar para GAS:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
