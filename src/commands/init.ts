#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { input, select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { type MdcliConfig } from '../lib/type.js';
import { getPackageJsonPath } from '../lib/utility.js';

const processor = async (defaults?: MdcliConfig) => {

  const config = await interactiveUI(defaults)

  const concatPath = path.join(config.root, config.repo)

  fs.writeFileSync(path.join(concatPath, "mdcli.config.json"), JSON.stringify(config, null, 2))

  console.log(chalk.green("🤩Initialize Success!"))
  console.log(`🔚Generated ${chalk.green("mdcli.config.json")} in ${chalk.underline(concatPath)}.`)
}


const interactiveUI = async (defaults?: MdcliConfig): Promise<MdcliConfig> => {
  const author = await input({
    message: "Author Name >",
    default: defaults ? defaults.author ?? "Anonymous" : "Anonymous"
  });

  const repo = (defaults && defaults.repo) ? defaults.repo : await input({
    message: `Path to Markdown Repository (Now in ${process.cwd()})\n>`,
    default: "./",
    validate: (val) => {
      const dirPath = path.join(process.cwd(), val);
      if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        return chalk.red("😵Invalid Path: ") + chalk.underline(val);
      }
      return true
    }
  });

  const frontmatter = defaults ? defaults.frontmatter ?? {
    type: "yaml",
    tags: []
  } : {
    type: "yaml",
    tags: []
  }

  frontmatter.type = await select({
    message: "Select Frontmatter Type >",
    choices: [
      { name: "yaml", value: "yaml" },
      { name: "toml", value: "toml" },
      { name: "json", value: "json" },
    ],
    default: defaults && defaults.frontmatter ? defaults.frontmatter.type ?? "yaml" : "yaml"
  });

  if (frontmatter.tags && frontmatter.tags.length === 0) {
    const tags = await input({
      message: "Add Content Tags (delimited by space)\n>",
    })

    frontmatter.tags = tags.split(" ")
  }

  // package.json の mdcli フィールドを追記
  const pkgPath = await getPackageJsonPath()
  const pkg = JSON.parse(fs.readFileSync(`${pkgPath}/package.json`, "utf-8"))

  if (!pkg.mdcli || !pkg.mdcli.config) {
    pkg.mdcli = {}
    pkg.mdcli.config = path.relative(".", `${repo}/mdcli.config.json`)
    fs.writeFileSync(`${pkgPath}/package.json`, JSON.stringify(pkg, null, 2))
  }

  const root = pkgPath

  return { author, root, repo, frontmatter }
}



export const exec = async () => {

  // ルートの package.json をチェック
  const pkgPath = await getPackageJsonPath()
  const pkg = JSON.parse(fs.readFileSync(`${pkgPath}/package.json`, "utf-8"))

  // 既に mdcli.config.json がある場合
  if (pkg.mdcli && pkg.mdcli.config) {

    console.log(`🤔${chalk.yellow(chalk.underline("mdcli.config.json") + " is already exists!")}`)

    const isUpdate = await confirm({
      message: "Update it?",
      default: false
    })

    if (!isUpdate) {
      process.exit(0)
    }

    const defaults = JSON.parse(fs.readFileSync(pkg.mdcli.config, "utf-8"))
    await processor(defaults)
  }

  // mdcli.config.json がない場合
  else {
    await processor()
  }
}