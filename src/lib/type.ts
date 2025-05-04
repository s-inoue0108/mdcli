import chalk from "chalk"

// Markdown のファイル名
type MdName = `${string}.md` | `${string}.markdown` | `${string}.mdx`
export const isMdName = (input: string): input is MdName => input.endsWith(".md") || input.endsWith(".markdown") || input.endsWith(".mdx");

// Filename のバリデーション
export const vaildFileName = (fname: string, allowedExts: string[], typeGuard: (fname: string) => boolean): void => {
  if (!fname) {
    console.error(`😵${chalk.red("Please specify filename.")}`)
    process.exit(1)
  }
  if (!typeGuard(fname)) {
    console.error(`😵${chalk.red("Invalid File:")} ${chalk.underline(fname)}`)
    console.log(`💡${chalk.green("Allowed File:")} ${allowedExts.join(", ")}`)
    process.exit(1)
  }
}

// 位置引数のバリデーション
export const validPositionalArgs = (input: string, allowedArgs: string[]): void => {
  if (!input || !allowedArgs.includes(input)) {
    console.error(`😵${chalk.red("Invalid Arg:")} ${chalk.underline(input)}`)
    console.log(`💡${chalk.green("Allowed Arg:")} ${allowedArgs.join(", ")}`)
    process.exit(1)
  }
}

// オプションフラグのバリデーション
export const validFlag = (input: string, allowedFlags: string[]): void => {
  if (!input) return
  if (!allowedFlags.includes(input)) {
    console.error(`😵${chalk.red("Invalid Flag:")} ${chalk.underline(input)}`)
    console.log(`💡${chalk.green("Allowed Flag:")} ${allowedFlags.join(", ")}`)
    process.exit(1)
  }
}

// Frontmatter の schema
export type FrontmatterField = {
  title: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  published: boolean
}

// mdcli の設定
export type MdcliConfig = {
  author: string
  root: string
  repo: string
  frontmatter: {
    type: string
    tags: string[]
  }
}