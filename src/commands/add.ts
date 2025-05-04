#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { input, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { vaildFileName, isMdName, validFlag } from '../lib/type.js';
import { getRepo, getMdcliConfig } from '../lib/utility.js';
import { type MdcliConfig } from '../lib/type.js';

const parser = async (args: string[]) => {
  const [mdName, flag] = args

  // parse args
  vaildFileName(mdName, ["md", "markdown", "mdx"], isMdName)
  validFlag(flag, ["--no-init", "-n"])

  return [mdName, flag]
}

const interactiveUI = async (mdName: string, config: MdcliConfig, now: string) => {
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

  return frontmatter
}

export const exec = async (args: string[]) => {

  const config = await getMdcliConfig()
  const repo = await getRepo()
  const now = new Date().toISOString()
  const [mdName, flag] = await parser(args)

  // Already Exists
  if (fs.existsSync(path.join(repo, mdName))) {
    console.log(`🤔${chalk.yellow(chalk.underline(mdName) + " is already exists!")}`)

    const isOverwrite = await confirm({
      message: "Overwrite it?",
      default: false
    })

    if (!isOverwrite) process.exit(0)
  }

  // --no-init | -n フラグがなければフロントマターで初期化
  let frontmatter = ""
  if (!["--no-init", "-n"].includes(flag)) {
    // フロントマターを対話型インタフェースで設定
    frontmatter = await interactiveUI(mdName, config, now)
  }

  // Markdown を生成
  fs.writeFileSync(
    path.join(repo, mdName),
    frontmatter
  )

  console.log("🤩" + chalk.green("Generated Markdown!"))
  console.log("🔚" + chalk.green("Added: ") + chalk.underline(mdName))
}