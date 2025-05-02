#!/usr/bin/env node

import arg from "arg"
import { exec } from "./commands"

const args = arg(
  {},
  {
    permissive: true,
  }
);

const command = args._[0] ?? "help"

exec(command, args._.slice(1))