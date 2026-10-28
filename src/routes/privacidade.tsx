import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Operário IA" },
      {
        name: "description",
        content:
          "Como a Operário IA coleta, usa, protege e permite que você gerencie seus dados pessoais na assinatura dos assistentes B2B.",
      },
      { property: "og:title", content: "Política de Privacidade — Operário IA" },
      {
        property: "og:description",
        content:
          "Dados coletados, uso, proteção e os seus direitos como assinante dos assistentes de automação B2B.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: Privacidade,
});

const SECTIONS = [
  {
    id: "dados-coletados",
    n: "01",
    title: "Dados coletados",
    body: [
      "Coletamos informações como nome, e-mail e dados de pagamento (via Kiwify) para processar sua assinatura.",
      "Os dados que você envia para triagem de leads ou para a geração de relatórios são processados temporariamente e não são armazenados por nós.",
    ],
  },
  {
    id: "uso-dos-dados",
    n: "02",
    title: "Uso dos dados",
    body: [
      "Usamos seus dados para fornecer o serviço, processar pagamentos, enviar atualizações e prestar suporte.",
    ],
  },
  {
    id: "protecao-e-seguranca",
    n: "03",
    title: "Proteção e segurança",
    body: [
      "Implementamos medidas para proteger seus dados contra acesso não autorizado.",
      "Os pagamentos são processados de forma segura pelo Kiwify; não retemos os dados completos do seu cartão.",
    ],
  },
   {
    id: "seus-direitos",
    n: "04",
    title: "Seus direitos",
    body: [
      "Você pode solicitar acesso, correção ou exclusão de seus dados pessoais a qualquer momento.",
      "Para fazer essa solicitação, envie um e-mail para contato.syntaxai.com.br.",
    ],
  },

];

function Privacidade() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-display text-xl tracking-tight hover:text-primary">
            Operário<span className="text-primary">.IA</span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Automação B2B
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Documento legal</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-6xl">
          Política de <span className="text-primary">Privacidade</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Esta política explica como coletamos, usamos e protegemos seus dados pessoais.
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Última atualização: 27 de outubro de 2026
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
          <nav aria-label="Índice da política" className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Índice
            </p>
            <ul className="space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    <span className="mr-2 font-mono text-xs text-primary">{s.n}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-8 border-t border-border py-8 first:border-t-0 first:pt-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-primary">{s.n}</span>
                  <h2 className="font-display text-3xl">{s.title}</h2>
                </div>
                <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <p className="mt-8 border-l-2 border-primary bg-card p-4 text-sm text-muted-foreground">
              Esta é uma versão simplificada e não substitui aconselhamento jurídico profissional.
            </p>

            <Link
              to="/"
              className="mt-10 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Voltar aos assistentes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
