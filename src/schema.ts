import { exec as init } from "./commands/init"
import { exec as add } from "./commands/add"
import { exec as remove } from "./commands/remove"
import { exec as publish } from "./commands/publish"
import { exec as draft } from "./commands/draft"
import { exec as list } from "./commands/list"
import { exec as convert } from "./commands/convert"
import { exec as version } from "./commands/version"
import { exec as help } from "./commands/help"

// Markdown のファイル名
// type MdName = `${string}.md` | `${string}.markdown` | `${string}.mdx`

// 許される引数の型
// export type Args = {
//   init: undefined;
//   add: {
//     mdName: MdName;
//     options?: {
//       uuid: boolean;
//     };
//   };
//   remove: {
//     mdName: MdName;
//     options?: {
//       force: boolean;
//     };
//   };
//   publish: {
//     mdName: MdName;
//     options?: {
//       "ignore-timestamp": boolean;
//     };
//   };
//   draft: {
//     mdName: MdName;
//     options?: {
//       "ignore-timestamp": boolean;
//     };
//   };
//   list: {
//     options?: {
//       published: boolean;
//       draft: boolean;
//       sort: boolean;
//       detail: MdName;
//     };
//   };
//   convert: {
//     mdName: MdName;
//     options?: {
//       force: boolean;
//       type: "zenn" | "github";
//     };
//   };
//   version: undefined;
//   help: undefined;
// };

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
  init: [],
  add: ["create", "new", "generate", "gen"],
  remove: ["rm", "delete", "del"],
  publish: ["pb", "pub", "release"],
  draft: ["df", "dft"],
  list: ["ls", "display"],
  convert: ["conv"],
  version: [],
  help: []
} as const;

type CommandAlias = typeof commandAlias

// コマンドエイリアスの解決
const aliasToCommand: Record<string, keyof CommandAlias> = {};

for (const command in commandAlias) {
  const aliases = commandAlias[command as keyof CommandAlias];
  for (const alias of aliases) {
    aliasToCommand[alias] = command as keyof CommandAlias;
  }
}

const resolveCommandAlias = (input: string): keyof CommandAlias | undefined => {
  if (commandAlias[input as keyof CommandAlias]) {
    return input as keyof CommandAlias;
  }
  return aliasToCommand[input];
}

// 型ガード
export const isCommand = (command: string): command is keyof Command => {
  const resolvedCommand = resolveCommandAlias(command)
  if (!resolvedCommand) return false
  return resolvedCommand in commandSchema
}