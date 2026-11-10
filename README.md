# Tao I — Caderno de ideogramas

App web progressivo (PWA), responsivo e em português, para estudar caracteres chineses pelo celular. Inclui busca, organização por capítulos do índice do livro, progresso local, revisão aleatória, revelação gradual da lista de traços, frases autorais e exercícios.

> A estrutura dos capítulos foi organizada a partir do índice que você enviou. As unidades 2 a 7 refletem os títulos do sumário do livro e o conteúdo atual do app continua sendo um conjunto didático de apoio, originalmente produzido para a experiência de estudo. Para uma reprodução fiel do conteúdo do livro, é necessário checar edição autorizada e usar trechos ou materiais com permissão explícita. A sequência textual dos traços deve ser conferida com uma fonte confiável de língua chinesa; esta versão não inclui animação de traços.

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

## Capítulos do índice atualmente mapeados

- 2. Tao I Text
- 3. Jin Dan — Tao Practice in Daily Life
- 4. Practice to Heal Your Liver and Wood Element
- 5. Practice to Heal Your Heart and Fire Element
- 6. Practice to Heal Your Spleen and Earth Element
- 7. Practice to Heal Your Lungs and Metal Element

Esses títulos estão definidos em `app.js` no array `CHAPTERS`. O app já usa essa estrutura para a seleção por capítulo e a navegação.

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

Depois, associe-o ao capítulo adequado em `CHAPTERS` em `app.js`.

## Tecnologias

HTML, CSS e JavaScript sem dependências; Web App Manifest e Service Worker para cache do app shell. O progresso é guardado no `localStorage` do dispositivo.
