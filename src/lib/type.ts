import chalk from "chalk"

// Branded Type
// export type Branded<T, Brand extends string> = T & { readonly __brand: Brand };

// Markdown のファイル名
type MdName = `${string}.md` | `${string}.markdown` | `${string}.mdx`
const isMdName = (input: string): input is MdName => input.endsWith(".md") || input.endsWith(".markdown") || input.endsWith(".mdx");

export const vaildMdName = (input: string): void => {
  if (!input) {
    console.error(`😵 ${chalk.red("Please specify markdown file.")}`)
    process.exit(1)
  }
  if (!isMdName(input)) {
    console.error(`😵 ${chalk.red("Invalid Filename:")} ${chalk.underline(input)}`)
    console.log(`💡 ${chalk.green("Allowed Filename:")} ${chalk.underline("*.md")}, ${chalk.underline("*.markdown")}, ${chalk.underline("*.mdx")}`)
    process.exit(1)
  }
}

type JsonName = `${string}.json`
const isJsonName = (input: string): input is JsonName => input.endsWith(".json");

export const vaildJsonName = (input: string): void => {
  if (!input) {
    console.error(`😵 ${chalk.red("Please specify JSON file.")}`)
    process.exit(1)
  }
  if (!isJsonName(input)) {
    console.error(`😵 ${chalk.red("Invalid Filename:")} ${chalk.underline(input)}`)
    console.log(`💡 ${chalk.green("Allowed Filename:")} ${chalk.underline("*.json")}`)
    process.exit(1)
  }
}

export const validFlag = (input: string, [long, short]: [string, string]): void => {
  if (!input) return
  if (![long, short].includes(input)) {
    console.error(`😵 ${chalk.red("Invalid Flag:")} ${chalk.underline(input)}`)
    console.log(`💡 ${chalk.green("Allowed Flag:")} ${chalk.underline(long)}, ${chalk.underline(short)}`)
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