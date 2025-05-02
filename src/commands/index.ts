import { exec as init } from "./init"
import { exec as add } from "./add"
import { exec as rm } from "./rm"
import { exec as publish } from "./publish"
import { exec as draft } from "./draft"
import { exec as version } from "./version"
import { exec as help } from "./help"

export type Command = {
  "init": () => Promise<void>,
  "add": (args?: string[]) => Promise<void>,
  "rm": (args?: string[]) => Promise<void>,
  "publish": (args?: string[]) => Promise<void>,
  "draft": (args?: string[]) => Promise<void>,
  "version": () => Promise<void>,
  "help": () => Promise<void>
}

const commandSchema: Command = {
  "init": async () => init(),
  "add": async (args) => add(args),
  "rm": async () => rm(),
  "publish": async () => publish(),
  "draft": async () => draft(),
  "version": async () => version(),
  "help": async () => help()
}

const isCommand = (command: string): command is keyof Command => {
  return command in commandSchema
}

export const exec = async (
  command: string,
  args?: string[]
) => {
  if (!isCommand(command)) {
    console.error(
      `Unknown command: ${command}\n` +
      `Run 'mdcli help' for usage.`
    )
    process.exit(1)
  }
  commandSchema[command](args)
}