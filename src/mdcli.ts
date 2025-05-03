#!/usr/bin/env node

import { commandSchema, isCommand } from "./schema"

// main 関数
(async () => {
  const command = process.argv[2]
  const args = process.argv.slice(3)

  // Exit if captured invalid command
  if (!isCommand(command)) {
    console.error(
      `Invalid command: ${command}\n` +
      `Run 'mdcli help' for usage.`
    )
    process.exit(1)
  }

  const exec = commandSchema[command]
  exec(args)
})()