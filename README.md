# Tao I — Caderno de ideogramas

App web progressivo (PWA), responsivo e em português, para estudar caracteres chineses pelo celular. Inclui busca, filtros de progresso, detalhes do caractere, ordem textual dos traços, frases e exercícios. O progresso fica salvo localmente no navegador.

> Os quatro itens incluídos são exemplos originais para demonstrar a estrutura do app. As frases e os exercícios não foram extraídos do livro. Antes de incluir conteúdo do livro, verifique os direitos autorais e use apenas material que você tenha autorização para reproduzir.

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

## Adicionar um ideograma

Edite `data/ideogramas.json` e acrescente um objeto com esta estrutura:

```json
{
  "id": "exemplo",
  "character": "明",
  "pinyin": "míng",
  "meaning": "brilhante; claro",
  "individualMeaning": "Explique o sentido do caractere e indique que o contexto pode alterar a interpretação.",
  "strokes": ["Traço 1: descrição da direção e do tipo."],
  "strokeCount": 1,
  "phrase": "Escreva aqui uma frase original de estudo.",
  "translation": "Nota ou tradução da frase.",
  "exercise": "Descreva um exercício autoral relacionado.",
  "steps": ["Passo 1", "Passo 2"],
  "category": "Tema"
}
```

Confira a sequência de traços e os significados com uma fonte confiável de língua chinesa antes de publicar. A aplicação apresenta a ordem em texto; não desenha animações de traços nesta versão inicial.

## Tecnologias

HTML, CSS e JavaScript sem dependências; Web App Manifest e Service Worker para cache do app shell. O estado de estudo é guardado no `localStorage` do dispositivo.
