#!/usr/bin/env node

import { packageUp } from 'package-up';
import path from 'path';
import fs from 'fs';
import { MdcliConfig } from './type.js';

// package.json のある階層を取得
export const getPackageJsonPath = async () => {
  const pkgPath = await packageUp({ cwd: process.cwd() });
  if (!pkgPath) {
    throw new Error("package.json not found.")
  }
  return path.join(pkgPath, "../")
}

// mdcli.config.json を取得
export const getMdcliConfig = async () => {
  const pkgPath = await getPackageJsonPath()
  const pkg = JSON.parse(fs.readFileSync(`${pkgPath}/package.json`, "utf-8"))
  const config: MdcliConfig = JSON.parse(fs.readFileSync(pkg.mdcli.config, "utf-8"))

  return config
}

// mdcli.config.json を更新
export const updateMdcliConfig = async (newConfig: MdcliConfig) => {
  const pkgPath = await getPackageJsonPath()
  const pkg = JSON.parse(fs.readFileSync(`${pkgPath}/package.json`, "utf-8"))
  fs.writeFileSync(pkg.mdcli.config, JSON.stringify(newConfig, null, 2))
}

// リポジトリのある階層を取得
export const getRepo = async () => {
  const config = await getMdcliConfig()
  return path.join(config.root, config.repo)
}