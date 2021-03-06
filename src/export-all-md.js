import 'dotenv/config' // for .env file
import fs from 'fs';
import {
  exec
} from 'child_process'; // for running shell from node
import {
  Client
} from "@notionhq/client"
import {
  NotionToMarkdown
} from "notion-to-md";
import sanitize from 'sanitize-filename'

import parseSinglePage from "./parseSinglePage.js"

// ensure that general /output folder exists
if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
  console.log(`Output directory created: "./output"`);
}


// initialize notion client

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// pass notion client to markdown parser

const n2m = new NotionToMarkdown({
  notionClient: notion
});

// fetch DB

const fetchPages = async () => {
  const databaseId = process.env.DB_TABLE;

  // query db (~table)
  const response = await notion.databases.query({
    database_id: databaseId
  });


  // for each db entry (~page)
  const pages = response.results.map(async (page, index) => {
    // extract metadata
    const pageId = page.id;
    const parent = page.parent;
    const properties = page.properties;
    const pageUrl = page.url
    const tags = properties.Tags[properties.Tags.type].map(tag => tag.name).join("; ")

    // sanitize / clean up filename segment
    const plainTitle = sanitize(properties.Name.title[0].text.content.replaceAll(" ", "-").replaceAll(/’|‘|,/ig, ""))
    // define output path
    const dirName = `./output/${plainTitle}`;
    const fileNameJson = `${plainTitle}.json`;
    const fileNameMd = `${plainTitle}.md`;

    // compile output params / meta content
    const params = {
      dirName,
      fileNameMd,
      fileNameJson,
      meta: {
        plainTitle,
        rawTitle: properties.Name.title[0].text.content,
        pageId,
        parent,
        properties,
        pageUrl,
        tags
      }
    }

    // parse and write output file
    await parseSinglePage(n2m, pageId, params);
  })

  console.log(pages)
  return await Promise.all(pages)

}

function parsePDFs() {
  const rootDir = process.env.PWD;
  console.log("parsing PDFs", rootDir);

  // call pandoc & pagedjs-cli to produce pdf, docx

  exec("make bake-all", {
    cwd: rootDir
  }, (error, stdout, stderr) => {
    if (error) {
      console.log("root", rootDir)
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

await fetchPages().then((res) => {
  console.log("Markdown Done")
  parsePDFs()
  console.log("Pandoc Done")
})
