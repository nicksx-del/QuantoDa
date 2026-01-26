# 💸 QuantoDá?

> **Descubra assinaturas "fantasmas" e pare de perder dinheiro.**
> O auditor financeiro pessoal movido a IA que analisa seus extratos e encontra onde você pode economizar.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Stack](https://img.shields.io/badge/Tech-React_|_Vite_|_Google_Gemini-blue)
![Backend](https://img.shields.io/badge/Backend-Supabase-green)
![Pagamentos](https://img.shields.io/badge/Pagamentos-AbacatePay-orange)

## 📸 Demonstração

![Screenshot do Projeto](./public/screenshot-placeholder.png)

## 📖 Sobre o Projeto

**QuantoDá?** é um Micro SaaS focado em saúde financeira com fricção zero. Muitas pessoas perdem dinheiro mensalmente com assinaturas esquecidas (streaming, academias, apps).

Nossa solução permite que o usuário faça upload de faturas (PDF) ou extratos. Utilizamos a **IA do Google (Gemini)** para ler os dados, categorizar despesas recorrentes e sugerir economia imediata, tudo isso sem pedir senhas bancárias.

### ✨ Funcionalidades
* **Upload Simples:** Suporte para arquivos PDF e CSV de faturas.
* **Análise via Google Gemini:** Categorização inteligente de gastos usando a biblioteca `@google/genai`.
* **Dashboard Financeiro:** Visualização clara do total gasto em recorrências anuais.
* **Sistema de Créditos:** Modelo Freemium (1 análise grátis) com recarga paga.
* **Pagamentos via Pix:** Integração nativa com **AbacatePay**.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi migrado para uma arquitetura SPA rápida e leve:

* **Frontend:** React + Vite
* **Estilização:** Tailwind CSS (sugestão)
* **Inteligência Artificial:** Google Gemini Flash (via SDK `@google/genai`)
* **Backend & Auth:** Supabase (PostgreSQL + Auth Google)
* **Pagamentos:** AbacatePay API

---

## 🚀 Instalação e Execução

Siga os passos abaixo para rodar o projeto no seu ambiente local.

### 1. Clone o repositório
```bash
git clone [https://github.com/seu-usuario/quantoda.git](https://github.com/seu-usuario/quantoda.git)
cd quantoda
