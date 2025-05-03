#!/usr/bin/env node

import { getPackageJsonPath } from "../lib/utility.js"
import fs from "fs"

export const exec = async () => {
  const pkgPath = await getPackageJsonPath()
  const pkg = JSON.parse(fs.readFileSync(`${pkgPath}/package.json`, "utf-8"))
  console.log(pkg.version)
}