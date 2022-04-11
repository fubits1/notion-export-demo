# Notion to Markdown | PDF | Docx

> (Stack: Javascript, NodeJS, Notion API, Makefile, Pandoc)

Minimal example to

- fetch a set of Notion pages (from a database table) (offical [Notion API + JS client](https://developers.notion.com/))
- for each Notion page
  - (with [notion-to-md](https://github.com/souvikinator/notion-to-md)) parse page as markdown (with additional metadata parsing)
  - output markdown as file (with `fs`) to `output/*`
- with `pandoc` convert each page to PDF & Docx in `output/*`

## Quickstart

### Setup

Create Notion Database Table and add a few pages or create a single Notion page (see `.env` file). Share the db/page with your integration account.

### Fetching & Parsing to MD

> add to local `.env` file:

```
NOTION_API_KEY=<your-api-token>
SINGLE_PAGE=<your-page-id>
DB_TABLE=<your-database-table-id>
```

To parse a single page (`SINGLE_PAGE`, without further processing) run:

```
npm run export-md-single
```

To parse all pages in a database (`DB_TABLE`) table run:

```
npm run export-md-all
```

### Pandoc: PDF & MS Word Outputs

> Pandoc needs a PDF processing library (i.e. `texlive` on Ubuntu); Setup is OS-specific.

To convert the single page `.md` file (path is hardcoded in the `makefile`) to PDF & Docx run:

```
make bake-single-pandoc
```

To convert all `.md` files in `output/*` to PDF & Docx run:

```
make bake-all-pandoc
```

# TODO

- [ ] add parsing step to download external linked resources (images, videos, etc.); download file as set relative links
- [ ] make Node's `exec(makefile)` run with relative filepaths
