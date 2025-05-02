import { exec } from "./commands/mdcli"
exec(process.argv[2], process.argv.slice(3))