import { exec } from "./commands"

exec(process.argv[2], process.argv.slice(3))