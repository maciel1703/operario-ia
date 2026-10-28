export type AssistantId = "leads" | "reports";

export const ASSISTANTS: Record<
  AssistantId,
  { name: string; tag: string; description: string; placeholder: string; example: string }
> = {
  leads: {
    name: "Triagem de Leads",
    tag: "01",
    description: "Cole dados de leads. A IA pontua, classifica (quente/morno/frio) e sugere o próximo passo.",
    placeholder: "Cole aqui a lista de leads (nome, empresa, cargo, mensagem, origem...)",
    example:
      "1. Ana Souza — Diretora de TI, Metalúrgica Forte (500 func.) — 'Precisamos automatizar o atendimento até março, temos orçamento aprovado.' — origem: formulário site\n2. Pedro Lima — estagiário, Startup X (5 func.) — 'Só queria saber o preço.' — origem: Instagram\n3. Carla Mendes — Gerente Comercial, Grupo Vale Log (1200 func.) — 'Estamos avaliando fornecedores para o próximo semestre.' — origem: evento",
  },
  reports: {
    name: "Gerador de Relatórios",
    tag: "02",
    description: "Envie números ou notas soltas. A IA entrega um relatório executivo com resumo, insights e recomendações.",
    placeholder: "Cole métricas, planilhas em texto ou anotações da semana...",
    example:
      "Vendas Q3: julho R$ 420k, agosto R$ 385k, setembro R$ 510k. Meta trimestral R$ 1,2M. Novos clientes: 18 (Q2: 12). Churn: 4 clientes (Q2: 2). Ticket médio subiu 9%. Equipe comercial perdeu 1 vendedor em agosto. Campanha LinkedIn lançada em setembro.",
  },
};

export const SYSTEM_PROMPTS: Record<AssistantId, string> = {
  leads: `Você é um especialista em qualificação de leads B2B (BANT/ICP). Para cada lead recebido, responda em português, em markdown:
- Uma tabela com colunas: Lead | Empresa | Score (0-100) | Classificação (🔥 Quente / 🌤 Morno / ❄️ Frio) | Próximo passo.
- Depois, uma seção "Justificativas" com 1-2 frases por lead.
- Termine com "Prioridade do dia": os leads a contatar primeiro. Seja objetivo.`,
  reports: `Você é um analista de negócios B2B. Transforme os dados recebidos em um relatório executivo em português, em markdown, com as seções:
## Resumo executivo (3 frases)
## Indicadores-chave (tabela com métrica, valor, variação/observação)
## Insights
## Riscos
## Recomendações (ações numeradas e concretas)
Não invente números que não foram fornecidos; sinalize dados ausentes.`,
};
