# Tao I — Caderno de ideogramas

App web progressivo (PWA), responsivo e em português, para estudar caracteres chineses pelo celular. Inclui busca, organização em unidades temáticas de estudo, progresso local, navegação entre caracteres, revisão aleatória, revelação gradual da lista textual de traços, frases autorais e exercícios.

> As unidades do app são uma organização editorial criada para facilitar o estudo; não são a estrutura oficial do livro. Os 13 itens atuais, suas explicações, frases e exercícios são exemplos de apoio originais, não transcrições do livro. Para refletir capítulos e conteúdo específicos, será necessário consultar uma edição autorizada e informar seus títulos ou fornecer trechos que você tenha direito de usar. A sequência textual dos traços deve ser conferida com uma fonte confiável; esta versão não inclui animação de traços.

## Abrir localmente

Como o app usa `fetch()` e Service Worker, sirva os arquivos por HTTP (não abra `index.html` diretamente):

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000` no navegador. Para testar no celular, use um servidor acessível na rede local ou publique o repositório no GitHub Pages.

## Publicar com GitHub Pages

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`, depois salve.
4. Quando o deploy terminar, abra o endereço Pages no celular. Em navegadores compatíveis, use **Adicionar à tela inicial**.

O Service Worker e a instalação PWA precisam de HTTPS (GitHub Pages fornece HTTPS) ou `localhost`.

## Unidades temáticas atuais

1. Fundamentos e presença
2. Coração e quietude
3. Natureza e energia
4. Harmonia e observação
5. Ação e caminho

Para adicionar ou reorganizar unidades, edite o array `CHAPTERS` em `app.js`, incluindo os IDs dos caracteres já existentes em `data/ideogramas.json`.

## Adicionar um ideograma

Edite `data/ideogramas.json` e acrescente um objeto com esta estrutura:

```json
{
  "id": "exemplo",
  "character": "明",
  "pinyin": "míng",
  "meaning": "brilhante; claro",
  "individualMeaning": "Explique o sentido do caractere e indique que o contexto pode alterar a interpretação.",
  "strokes": ["Traço 1: descrição conferida da direção e do tipo."],
  "strokeCount": 1,
  "phrase": "Escreva aqui uma frase original de estudo.",
  "translation": "Nota ou tradução da frase.",
  "exercise": "Descreva um exercício autoral relacionado.",
  "steps": ["Passo 1", "Passo 2"],
  "category": "Tema"
}
```

Depois inclua o `id` no array da unidade correspondente em `CHAPTERS` dentro de `app.js`. Confira leitura, significado e sequência de traços com uma fonte confiável de língua chinesa.

## Tecnologias

HTML, CSS e JavaScript sem dependências; Web App Manifest e Service Worker para cache do app shell. O progresso é guardado no `localStorage` do dispositivo.
