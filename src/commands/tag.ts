#!/usr/bin/env node

import chalk from 'chalk';
import { input, checkbox } from '@inquirer/prompts';
import { validPositionalArgs } from '../lib/type.js';
import { getMdcliConfig, updateMdcliConfig } from '../lib/utility.js';
import { type MdcliConfig } from '../lib/type.js';

const parser = async (args: string[]) => {
  const [arg] = args

  // parse args
  validPositionalArgs(arg, ["add", "new", "remove", "rm", "list", "ls"])

  return [arg]
}

const interactiveUI = async (arg: string, config: MdcliConfig) => {
  // add
  if (["add", "new"].includes(arg)) {
    const tags = await input({
      message: "Add Content Tags (delimited by space)\n>",
      validate: ((val) => {
        const validTags = val.split(" ")
        if (validTags.length === 1 && validTags[0] === "") {
          return chalk.red("😵Invalid Empty Input!")
        }

        if (Array.from(new Set(validTags)).length !== validTags.length) {
          return chalk.red("😵Invalid Duplicate Tags!")
        }

        if (config.frontmatter.tags.some((tag) => validTags.includes(tag))) {
          return chalk.red("😵Invalid Exist Tag!")
        }
        return true
      })
    })

    const tagsList = tags.split(" ")

    const newTags = [...config.frontmatter.tags, ...tagsList]
    config.frontmatter.tags = newTags

    return config

    // remove
  } else if (["remove", "rm"].includes(arg)) {
    const tags = await checkbox({
      message: "Select Remove Tags >",
      choices: config.frontmatter.tags.map((tag) => {
        return {
          name: tag,
          value: tag
        }
      }),
      pageSize: 10
    })

    const newTags = config.frontmatter.tags.filter((tag) => !tags.includes(tag))
    config.frontmatter.tags = newTags

    return config

    // list
  } else if (["list", "ls"].includes(arg)) {
    const tags = config.frontmatter.tags

    console.log(chalk.green("🤩Tags List"))
    tags.forEach((tag) => console.log(`- ${tag}`))
    console.log()
  }

  return config
}

export const exec = async (args: string[]) => {
  const config = await getMdcliConfig()
  const [arg] = await parser(args)

  const newConfig = await interactiveUI(arg, config)

  if (!["list", "ls"].includes(arg)) {
    await updateMdcliConfig(newConfig)
    console.log(chalk.green("🤩Update Success!"))
    console.log(`🔚Edited ${chalk.green("mdcli.config.json")}.`)
  }
}