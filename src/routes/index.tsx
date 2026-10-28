import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ASSISTANTS, type AssistantId } from "@/lib/assistants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operário IA — Assistentes B2B para triagem de leads e relatórios" },
      { name: "description", content: "Assistentes de IA que automatizam triagem de leads e geração de relatórios executivos para empresas B2B." },
      { property: "og:title", content: "Operário IA — Assistentes B2B" },
      { property: "og:description", content: "Triagem de leads e relatórios executivos em segundos, com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<AssistantId>("leads");
  const [inputs, setInputs] = useState<Record<AssistantId, string>>({ leads: "", reports: "" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const a = ASSISTANTS[active];

  async function run() {
    const input = inputs[active].trim();
    if (!input) return;
    abortRef.current = new AbortController();
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistant: active, input }),
        signal: abortRef.current.signal,
      });
      if (!res.ok || !res.body) {
        setOutput(`> ⚠️ ${await res.text()}`);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((o) => o + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setOutput("> ⚠️ Falha de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-xl tracking-tight">Operário<span className="text-primary">.IA</span></span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Automação B2B</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
          Tarefas repetitivas,<br /><span className="text-primary">resolvidas por IA.</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">Escolha um assistente, cole seus dados e receba o trabalho pronto.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {(Object.keys(ASSISTANTS) as AssistantId[]).map((id) => (
            <button
              key={id}
              onClick={() => { setActive(id); setOutput(""); }}
              className={`rounded-lg border p-5 text-left transition-all ${id === active ? "border-primary bg-card shadow-glow" : "border-border hover:border-muted-foreground"}`}
            >
              <span className="font-mono text-xs text-primary">{ASSISTANTS[id].tag}</span>
              <h2 className="mt-1 font-display text-2xl">{ASSISTANTS[id].name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{ASSISTANTS[id].description}</p>
            </button>
          ))}
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Entrada</span>
              <button onClick={() => setInputs({ ...inputs, [active]: a.example })} className="text-xs text-primary underline-offset-4 hover:underline">
                Usar exemplo
              </button>
            </div>
            <textarea
              value={inputs[active]}
              onChange={(e) => setInputs({ ...inputs, [active]: e.target.value })}
              placeholder={a.placeholder}
              className="min-h-72 flex-1 resize-none rounded-md border border-input bg-background p-4 font-mono text-sm outline-none focus:border-primary"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={run}
                disabled={loading || !inputs[active].trim()}
                className="flex-1 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Processando..." : `Executar ${a.name}`}
              </button>
              {loading && (
                <button onClick={() => abortRef.current?.abort()} className="rounded-md border border-border px-4 text-sm">Parar</button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Resultado</span>
            <div className="prose-output mt-3 min-h-72 text-sm">
              {output ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown> : (
                <p className="text-muted-foreground">{loading ? "Pensando..." : "O resultado aparecerá aqui."}</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Operário<span className="text-primary">.IA</span> — Automação B2B
          </span>
          <Link to="/privacidade" className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </div>
  );
}
