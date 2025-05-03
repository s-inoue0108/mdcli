#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { packageUp } from 'package-up';
import { input, select, Separator } from '@inquirer/prompts';

const processor = async (defaults?: MdcliConfig) => {
  const config = await interactiveUI(defaults)

  const concatPath = path.join(config.root, config.repo)

  fs.writeFileSync(path.join(concatPath, "mdcli.config.json"), JSON.stringify(config, null, 2))
  console.log(`Initialize Success!\nGenerated 'mdcli.config.json' in ${concatPath}.`)
}



const getPackageJsonPath = async () => {
  const pkgPath = await packageUp({ cwd: process.cwd() });
  if (!pkgPath) {
    throw new Error("package.json not found.")
  }
  return path.join(pkgPath, "../")
}

type MdcliConfig = {
  author: string
  root: string
  repo: string
  frontmatter: {
    type: string
    field: {
      [key: string]: string | string[] | boolean
    }
  }
}



const interactiveUI = async (defaults?: MdcliConfig): Promise<MdcliConfig> => {
  const author = await input({
    message: "Author Name\n>>",
    default: defaults ? defaults.author ?? "Anonymous" : "Anonymous"
  });

  const repo = await input({
    message: `Path to Markdown Repository (Now in ${process.cwd()})\n>>`,
    default: defaults ? defaults.repo ?? "./" : "./",
    validate: (val) => {
      const dirPath = path.join(process.cwd(), val);
      if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        return "Path is invalid!";
      }
      return true
    }
  });

  const frontmatter = defaults ? defaults.frontmatter ?? {
    type: "yaml",
    field: {}
  } : {
    type: "yaml",
    field: {}
  }

  frontmatter.type = await select({
    message: "Select Frontmatter Type",
    choices: [
      { name: "yaml", value: "yaml" },
      { name: "toml", value: "toml" },
      { name: "json", value: "json" },
    ],
    default: defaults && defaults.frontmatter ? defaults.frontmatter.type ?? "yaml" : "yaml"
  });

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

    console.log(`'mdcli.config.json' already exists.`)

    const isUpdate = await select({
      message: "Update Configration?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
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