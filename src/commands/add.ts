#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { input, search, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { vaildJsonName, vaildMdName, validFlag, type FrontmatterField } from '../lib/type.js';
import { getRepo, getMdcliConfig } from '../lib/utility.js';

const parser = async (args: string[]) => {
  const [mdName, schemaFlag, schemaFile] = args

  // parse args
  vaildMdName(mdName)
  validFlag(schemaFlag, ["--schema", "-s"])
  if (schemaFlag) vaildJsonName(schemaFile)

  return [mdName, schemaFlag, schemaFile]
}

export const exec = async (args: string[]) => {

  const config = await getMdcliConfig()
  const repo = await getRepo()
  const now = new Date().toISOString()
  const [mdName, schemaFlag, schemaFile] = await parser(args)

  // Already Exists
  if (fs.existsSync(path.join(repo, mdName))) {
    console.log(`🤔${chalk.yellow(chalk.underline(mdName) + " is already exists!")}`)

    const isOverwrite = await confirm({
      message: "Overwrite it?",
      default: false
    })

    if (!isOverwrite) {
      process.exit(0)
    }
  }

  // title と tag を対話型インタフェースで設定
  const title = await input({
    message: "Input Title >",
    default: mdName.replace(/(\.md|\.markdown|\.mdx)$/, "")
  })

  const tags = await checkbox({
    message: "Select Tags >",
    choices: config.frontmatter.tags.map((tag) => {
      return {
        name: tag,
        value: tag
      }
    }),
    pageSize: 10
  })

  // frontmatter の type
  let frontmatter = ""
  switch (config.frontmatter.type) {
    case "yaml":
      frontmatter = `
---
title: ${title}
author: ${config.author}
createdAt: ${now}
updatedAt: ${now}
tags: ${JSON.stringify(tags)}
published: false
---
      `.trim()
      break;
    case "toml":
      frontmatter = `
+++
title = "${title}"
author = "${config.author}"
createdAt = ${now}
updatedAt = ${now}
tags = ${JSON.stringify(tags)}
published = false
+++
      `.trim()
      break;
    case "json":
      frontmatter = `
{
  "title": "${title}",
  "author": "${config.author}",
  "createdAt": ${now},
  "updatedAt": ${now},
  "tags": ${JSON.stringify(tags)},
  "published": false
}
      `.trim()
      break;
  }

  // Markdown を生成
  fs.writeFileSync(
    path.join(repo, mdName),
    frontmatter
  )

  console.log("🤩" + chalk.green("Generated Markdown!"))
  console.log("🔚" + chalk.green("Added: ") + chalk.underline(mdName))
}