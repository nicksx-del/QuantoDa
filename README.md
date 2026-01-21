# 💸 QuantoDá?

> **Descubra assinaturas "fantasmas" e pare de perder dinheiro.**
> Um Micro SaaS que analisa extratos bancários com IA para encontrar gastos recorrentes e sugerir economia.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_Supabase_|_OpenAI-blue)

## 📖 Sobre o Projeto

**QuantoDá?** é uma solução focada em Saúde Financeira com fricção zero. O problema é claro: as pessoas assinam serviços, esquecem, e perdem dinheiro todo mês.

A aplicação permite que o usuário faça upload de faturas (PDF) ou extratos (CSV). Utilizamos Inteligência Artificial para ler "bancarês", identificar padrões de recorrência (ex: Netflix, Gympass, Spotify) e apresentar um dashboard claro de quanto isso custa por ano.

**Diferencial:** Não pedimos senhas bancárias. Funciona via análise de arquivo (Upload), garantindo privacidade e segurança.

---

## ✨ Funcionalidades Principais

* **🕵️ Análise Inteligente:** Processamento de PDF/CSV para extração de texto.
* **🤖 Categorização via IA:** Identifica assinaturas recorrentes vs. gastos pontuais.
* **⚡ Login Social:** Autenticação rápida com Google (via Supabase) para evitar spam.
* **💎 Sistema de Créditos:**
    * **Freemium:** 1 crédito grátis ao cadastrar.
    * **Pay-wall:** Bloqueio de novas análises após o uso do crédito.
* **pix Pagamento Instantâneo:** Integração com **AbacatePay** para compra de pacotes de créditos via Pix.
* **💡 Consultor Financeiro (Premium):** A IA sugere trocas de planos e alertas de gastos duplicados (ex: 3 streamings de vídeo).

---

## 🛠️ Tech Stack

A arquitetura foi pensada para **Speed to Revenue** (rapidez de desenvolvimento e baixo custo).

* **Frontend:** [Next.js 14+](https://nextjs.org/) (App Router) + Tailwind CSS + Shadcn/ui (para UI rápida).
* **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Auth Google).
* **AI Engine:** [OpenAI GPT-4o-mini](https://openai.com/) ou [Gemini Flash](https://deepmind.google/technologies/gemini/) (Custo baixo e alta velocidade).
* **Pagamentos:** [AbacatePay](https://abacatepay.com/) (Checkout transparente e Webhooks).
* **Processamento de Arquivos:** `pdf-parse` (Node.js).

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

O sistema utiliza triggers para criar o perfil do usuário automaticamente após o login.

### Tabela: `profiles`
| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | uuid | ID do usuário (fkey auth.users) |
| `email` | text | Email do usuário |
| `credits` | int | Saldo de créditos (Padrão: 1) |
| `is_premium` | bool | Status Premium |
| `created_at` | timestamp | Data de cadastro |

---

## 💰 Fluxo de Monetização

1.  Usuário gasta seu crédito grátis.
2.  Tenta fazer nova análise -> **Modal de Paywall abre**.
3.  Usuário seleciona "Pack 3 Análises" (R$ 19,90).
4.  Chamada API AbacatePay -> Gera Pix QR Code.
5.  Usuário paga -> AbacatePay envia Webhook (`/api/webhooks/abacate`).
6.  Backend valida assinatura e adiciona `+3` na coluna `credits` do usuário.

---

## 🛡️ Privacidade e Segurança

* **Zero Persistência de Arquivos:** Os PDFs enviados são processados em memória (RAM) e descartados imediatamente após a extração do texto. Não salvamos extratos bancários no Storage.
* **Anonimização:** A IA recebe apenas os descritivos das transações, sem dados sensíveis de conta/agência.

---

## 📝 Licença

Este projeto é proprietário. Todos os direitos reservados.

---
*Feito com ☕ e código para ajudar brasileiros a economizarem.*
