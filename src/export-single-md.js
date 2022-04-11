import 'dotenv/config'
import {
  Client
} from "@notionhq/client"
import {
  NotionToMarkdown
} from "notion-to-md";

import parseSinglePage from "./parseSinglePage.js"

// dir and filenames for output

const params = {
  "dirName": "./output/",
  "fileNameMd": "export-single.md",
  "fileNameJson": "export-single.json"
}

// initialize notion client

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// pass notion client to markdown parser

const n2m = new NotionToMarkdown({
  notionClient: notion
});

// IIFE fetch document and write to file

(async () => {
  parseSinglePage(n2m, process.env.SINGLE_PAGE, params);
})();
