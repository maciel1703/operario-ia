import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { SYSTEM_PROMPTS, type AssistantId } from "@/lib/assistants";

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | { assistant?: AssistantId; input?: string }
          | null;
        const assistant = body?.assistant;
        const input = body?.input?.trim();
        if (!assistant || !(assistant in SYSTEM_PROMPTS) || !input || input.length > 20000) {
          return new Response("Entrada inválida.", { status: 400 });
        }
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("IA não configurada.", { status: 500 });

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        let failure: { status: number; message: string } | null = null;
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: SYSTEM_PROMPTS[assistant],
          messages: [{ role: "user", content: input }],
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => {
            const e = error as { statusCode?: number; message?: string };
            failure = { status: e.statusCode ?? 500, message: e.message ?? "Erro na IA" };
            console.error("assistant error", error);
          },
        });
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
            const f = failure as { status: number; message: string } | null;
            if (f) {
              const msg =
                f.status === 429
                  ? "Limite de uso atingido, tente novamente em instantes."
                  : f.status === 402
                    ? "Créditos de IA esgotados. Adicione créditos ao workspace."
                    : "Não foi possível gerar a resposta.";
              controller.enqueue(encoder.encode(`\n\n> ⚠️ ${msg}`));
            }
            controller.close();
          },
        });
        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
