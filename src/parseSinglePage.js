import fs from 'fs';
// fs.writeFile is async, but is callback-based
// 'fs/promises' offers an async fs.writeFile which works with await
// import {
//   writeFile
// } from 'fs/promises';

async function parseSinglePage(n2m, pageId, params) {

  const {
    dirName,
    fileNameJson,
    fileNameMd
  } = params;

  // create output folder

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
    console.log(`Output directory created: ${dirName}`);
  }

  // parse API response to JSON with MD blocks
  let mdblocks = await n2m.pageToMarkdown(pageId);
  // parse MD blocks to plain String file
  let mdString = n2m.toMarkdownString(mdblocks);

  // regex for replacing relative links
  const urlRegex = /\t{1}\[(.*)\]\(.*?\)/g // TODO: escape http|s

  // replace internal links with relative links
  mdString = mdString.replaceAll(urlRegex, (match, group1) => {
    const pathSegement = group1.replace(" ", "-").toLowerCase()
    return `- [${group1}](../${pathSegement}/${pathSegement}.md)`
  });

  // writing to file

  // Prepend Meta / Header to MD Output IF metadata Obj exists
  const writeFiles = async () => {
    if (params.meta) {
      fs.writeFile(`${dirName}/meta.json`, JSON.stringify(params.meta, "null", 2), (err) => {
        console.log(err);
      });

      // prepend meta data / front-matter from `params.meta`
      mdString =
        `# Title: ${params.meta.rawTitle}\n\n` +
        `> Tags: ${params.meta.tags}\n\n` +
        // `Source URL: [${params.meta.pageUrl}](${params.meta.pageUrl})\n` + // TODO: page leaks ID, therefore not included in public repo
        mdString
    }

    // JSON
    // TODO: leaks ID, therefore not included in public repo (via .gitignore)
    fs.writeFile(`${dirName}/${fileNameJson}`, JSON.stringify(mdblocks, null, 2), (err) => {
      console.log(err);
    });

    // Markdown
    fs.writeFile(`${dirName}/${fileNameMd}`, mdString, (err) => {
      console.log(err);
    });
  }

  return await writeFiles().then(() => {
    console.log("output written:", dirName)
  });
}

export default parseSinglePage;
