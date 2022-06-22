# Notion to Markdown | PDF | Docx

> (Stack: Javascript, NodeJS, Notion API, Makefile, Pandoc)

Minimal example to

- fetch a set of Notion pages (from a database table) (via official [Notion API + JS client](https://developers.notion.com/))
- for each Notion page
  - (with [notion-to-md](https://github.com/souvikinator/notion-to-md)) parse page as markdown (with additional metadata parsing)
  - output markdown as file (with `fs`) to `output/*`
- with `pandoc` convert each page to PDF & Docx in `output/*`

## OS-Level dependencies

> installation of these dependencies is OS-specific, so it won't be covered by `npm install`

- `pandoc`
- `pandoc` needs `pdflatex` or a different PDF engine (specify with `--pdf-engine`)
  - FWIW, `[tinytex](https://yihui.org/tinytex/)` is a minimal solution
- `puppeteer` on Ubuntu depends on `libgbm.so.1`, which might be absent
  - run `sudo apt-get install -y libgbm-dev`

## Quickstart

> Heads up: Locally, for each page a `meta.json` and a `<page>.json` file are produced. They are **not** part of the repository via `.gitignore`. These files store raw Notion data and leak the page IDs among other things. Please consider this before you put your outputs in a public repo.

Notion Source DB: [https://fubits.notion.site/DB-Multiple-Pages-1890d20f20d04793a50bdaec3bd8200d](https://fubits.notion.site/DB-Multiple-Pages-1890d20f20d04793a50bdaec3bd8200d)

## Setup

Create Notion Database Table and add a few pages or create a single Notion page (see `.env` file). Share the db/page with your integration account.

### Fetching & Parsing to MD

> add to local `.env` file:

```text
NOTION_API_KEY=<your-api-token>
SINGLE_PAGE=<your-page-id>
DB_TABLE=<your-database-table-id>
```

To parse a single page (`SINGLE_PAGE`, without further processing) run:

```javascript
npm run export-md-single
```

To parse all pages in a database (`DB_TABLE`) table run:

```javascript
npm run export-md-all
```

### Pandoc: PDF & MS Word Outputs

> Pandoc needs a PDF processing library (i.e. `texlive` on Ubuntu); Setup is OS-specific.

To convert the single page `.md` file (path is hardcoded in the `makefile`) to PDF & Docx run:

```bash
make bake-single
```

To convert all `.md` files in `output/*` to PDF & Docx run:

```bash
make bake-all
```

> The PDF `make` task now demonstrates both, pandoc and [`pagedjs`](https://gitlab.coko.foundation/pagedjs/pagedjs/)/[`pagedjs-cli`](https://www.npmjs.com/package/pagedjs-cli) to produce the PDFs. `pagedjs` renders the PDF from `html` (+`css`).

## TODO

- [ ] add parsing step to download external linked resources (images, videos, etc.); download files and set relative links
- [x] make Node's `exec(makefile)` run with relative filepaths
- [x] use [pagedjs-cli](https://github.com/pubpub/pagedjs-cli) as PDF engine for Pandoc
