#!/usr/bin/env node

import { commandSchema, resolveCommand } from "./schema.js"

// main 関数
(async () => {
  const command = process.argv[2]
  const args = process.argv.slice(3)

  const exec = commandSchema[resolveCommand(command)]
  exec(args)
})()