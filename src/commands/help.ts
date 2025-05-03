#!/usr/bin/env node


export const exec = async () => {
  console.log(
    "This is the Command Line Interface for Management Markdown (.md) File.\n\n" +
    "Usage: mdcli [command] [args]\n\n" +
    "Available commands:\n" +
    "- init\n" +
    "- add\n" +
    "- rm\n" +
    "- publish\n" +
    "- draft\n" +
    "- version\n" +
    "- help\n"
  )
}