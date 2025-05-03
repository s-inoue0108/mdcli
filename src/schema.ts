import { exec as init } from "./commands/init.js"
import { exec as add } from "./commands/add.js"
import { exec as remove } from "./commands/remove.js"
import { exec as publish } from "./commands/publish.js"
import { exec as draft } from "./commands/draft.js"
import { exec as list } from "./commands/list.js"
import { exec as convert } from "./commands/convert.js"
import { exec as version } from "./commands/version.js"
import { exec as help } from "./commands/help.js"
import chalk from "chalk"

// 許されるコマンド
export const commandSchema = {
  init: async () => init(),
  add: async (args: string[]) => add(args),
  remove: async (args: string[]) => remove(args),
  publish: async (args: string[]) => publish(args),
  draft: async (args: string[]) => draft(args),
  list: async (args: string[]) => list(args),
  convert: async (args: string[]) => convert(args),
  version: async () => version(),
  help: async () => help()
} as const

export type Command = typeof commandSchema

// 許されるコマンドエイリアス
const commandAlias = {
  init: ["setup"],
  add: ["create", "new", "generate"],
  remove: ["rm", "delete"],
  publish: ["pub", "release"],
  draft: ["dft", "revoke"],
  list: ["ls", "display"],
  convert: ["conv"],
  version: [] as string[],
  help: [] as string[]
};

// コマンドエイリアスの解決
export const resolveCommand = (input: string): keyof Command => {
  for (const [command, aliases] of Object.entries(commandAlias)) {
    aliases.push(command)
    if (aliases.includes(input)) {
      return command as keyof Command
    }
  }
  console.error(
    `😵 ${chalk.red("Invalid Command:")} ${chalk.underline(input)}\n` +
    `💡 Run ${chalk.green("mdcli help")} for usage.`
  )
  process.exit(1)
}