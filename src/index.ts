/**
 * Generate html files from the email template functions in an input directory into an output directory.
 * 
 * You can specify directory for the generated html files using the --dir or -d argument flag.
 * 
 * Use the help (--help or -h) flag for more information.
 * 
 * @module
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { createServer } from "http"
import { help, list, checkForUpdates, resolveValues, version, update, uninstall } from "./utils";

const isDebugMode = process.env.DEBUG === "TRUE" || process.env.DEBUG === "true" || process.env.DEBUG === "1"
const debugLog = (...args: unknown[]) => {
  if (!isDebugMode) return
  const jsonArgs = []
  for (const arg of args) {
    jsonArgs.push(JSON.stringify(arg, null, 2))
  }
  console.log(jsonArgs.join("\n"))
}

const { values, positionals } = parseArgs({
  options: {
    outDir: { type: "string", short: "o" },
    inDir: { type: "string", short: "i" },
    //? name of the template function: --funcName or -f 
    funcName: { type: "string", short: "f" },
    //? args to be passed to the template function: --args or -a
    args: { type: "string", short: "a", multiple: true },
    port: { type: "string", short: "p" },
    //? boolean flags are always in values even when used in positionals
    //? print help: --help or -h */
    help: { type: "boolean", short: "h" },
    list: { type: "boolean", short: "l" },
    version: { type: "boolean", short: "v" },
    update: { type: "boolean", short: "u" },
    remove: { type: "boolean", short: "r" },
  },
  allowPositionals: true
});

try {
  if (values.help) {
    help();
    process.exit(0);
  }

  if (values.list) {
    list(values, positionals);
    process.exit(0);
  }

  if (values.version) {
    version();
    process.exit(0);
  }

  if (values.update) {
    update();
    process.exit(0);
  }

  if (values.remove) {
    uninstall();
    process.exit(0);
  }

  await checkForUpdates()
  const { outDir, inDir, funcName, args, port } = resolveValues(values, positionals)
  debugLog({ positionals, values, inDir, outDir, funcName, args, port })
  //? Invoke the template function with parsed arguments
  //? Also ensure arguments are in the correct order while ignoring extras e.g -s and -p 
  // @ts-ignore
  const htmlContent = require(join(process.cwd(), inDir))[funcName](...args)
  const filePath = join(outDir!, `${funcName}.html`);

  await mkdir(outDir!, { recursive: true })
  await writeFile(filePath, htmlContent)
  console.info("Successfully generated %s", filePath);
  if (port) {
    const server = createServer((_, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlContent);
    });
    server.listen(+port, () => {
      console.info("Server started on http://localhost:%s", port);
    });
  }
} catch (error: any) {
  isDebugMode ? console.error(error) : console.error(error?.message)
  console.info("\nFor more information, run with --help or -h")
  process.exit(1)
}
