import { exec as init } from "./init"
import { exec as add } from "./add"
import { exec as rm } from "./rm"
import { exec as publish } from "./publish"
import { exec as draft } from "./draft"
import { exec as version } from "./version"
import { exec as help } from "./help"

type Command = {
  "init": () => Promise<void>,
  "add": () => Promise<void>,
  "rm": () => Promise<void>,
  "publish": () => Promise<void>,
  "draft": () => Promise<void>,
  "version": () => Promise<void>,
  "help": () => Promise<void>
}

const commandSchema: Command = {
  "init": async () => init(),
  "add": async () => add(),
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
  if (!isCommand(command)) throw new Error(`Unknown command: ${command}`)
  commandSchema[command]()
}