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
import { version as currentVersion } from "../package.json";

const isDebugMode = process.env.DEBUG === "TRUE" || process.env.DEBUG === "true" || process.env.DEBUG === "1"

const debugLog = (...args: unknown[]) => {
  if (!isDebugMode) return
  console.debug(`[${new Date().toISOString()}]: `, ...args)
}

/**
 * Checks GitHub for a newer version of the CLI utility and notifies the user.
 */
async function checkForUpdates(): Promise<void> {
  const repo = "irabeny89/js-html-view";
  const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;

  try {
    // Set a short timeout using AbortController so it doesn't slow down the CLI if the user is offline
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "js-html-view-cli" } // GitHub API requires a User-Agent header
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) return;

    const data = (await response.json()) as { tag_name: string };
    const latestVersion = data.tag_name.replace(/^v/, ""); // Strip leading 'v' if present

    if (latestVersion !== currentVersion) {
      console.log("\n\x1b[34m%s\x1b[0m", "====================================================");
      console.log(`\x1b[33mUpdate available!\x1b[0m \x1b[2m(${currentVersion} → ${latestVersion})\x1b[0m`);
      console.log("Run the installer again to pull the latest features:");
      console.log(`\x1b[32mcurl -fsSL https://githubusercontent.com{repo}/main/install.sh | bash\x1b[0m`);
      console.log("\x1b[34m%s\x1b[0m", "====================================================\n");
    }
  } catch {
    // Silently catch network errors or timeouts so the CLI works flawlessly offline
  }
}

const checkRequiredPositionalArgs = (val: typeof values) => {
  if (!val.inDir) {
    throw new Error("inDir not provided as a positional 1st argument")
  }
  if (!val.outDir) {
    throw new Error("outDir not provided as a positional 2nd argument")
  }
  if (!val.funcName) {
    throw new Error("funcName not provided as a positional 3rd argument")
  }
  return { outDir: val.outDir, inDir: val.inDir, funcName: val.funcName }
}

/**
 * Get the argument names of a function
 * @param func the function to get the argument names of
 * @returns {Array<string>} the argument names of the function
 */
function getFuncArgNames(func: Function): Array<string> {
  const strFunc = func.toString()
  const indexOfOpeningBrace = strFunc.indexOf("(")
  const indexOfClosingBrace = strFunc.indexOf(")")
  if (indexOfOpeningBrace === -1 || indexOfClosingBrace === -1) {
    throw new Error(`Could not find argument names for function ${func.name}`)
  }
  const args = strFunc
    .substring(indexOfOpeningBrace + 1, indexOfClosingBrace)
    .split(',')
    .map((arg: string) => arg.trim());
  return args;
}

/**
 * Resolves the values from the arguments provided
 * @param val values object containing the function name and arguments
 * @param pos array of positional arguments
 * @returns {object} resolved values
 */
function resolveValues(val: typeof values, pos: string[]): typeof values {
  if (pos.length) {
    val.inDir = pos[0]
    val.outDir = pos[1]
    val.funcName = pos[2]
    const { funcName, inDir } = checkRequiredPositionalArgs(val)
    const func = require(join(process.cwd(), inDir))[funcName] as Function
    if (typeof func !== "function") {
      throw new Error(`"${funcName}" is not a valid exported function in ${inDir}`)
    }
    const argNames = getFuncArgNames(func)
    //? The first three arguments are the inDir, outDir, and funcName in that order
    const preFuncArgs = 3
    val.args = pos.slice(preFuncArgs, preFuncArgs + argNames.length)
    if (pos.length > preFuncArgs + argNames.length) {
      val.port = pos[preFuncArgs + argNames.length]
    }
    return val
  }
  checkRequiredPositionalArgs(val)
  return val
}

/**
 * Lists all the template functions that can be generated
 *
 * @param val - values object containing the function name and arguments
 * @param pos - array of positional arguments
 */
function listFunctions(val: typeof values, pos: string[]) {
  if (pos.length) val.inDir = pos[0]
  if (!val.inDir) {
    console.error("inDir not provided as a positional 1st argument")
    process.exit(1)
  }
  const templateFuncs = require(join(process.cwd(), val.inDir))
  console.info("Available functions and their arguments:\n")
  console.info(Object.entries(templateFuncs).map(([funcName, func]) => {
    if (typeof func === "function") {
      return {
        name: funcName,
        args: getFuncArgNames(func)
      }
    }
  }))
  console.info("\nFor a detailed explanation, run with --help or -h")
}

/**
 * Prints help to the terminal
 */
function printHelp() {
  console.info("Flags: ")
  console.info("\t-l: List available functions")
  console.info("\t-f | --funcName: Name of the function")
  console.info("\t-a | --args: Arguments to pass to the function")
  console.info("\t-o | --outDir: Directory to save the generated html file")
  console.info("\t-i | --inDir: Directory containing the function to generate html from")
  console.info("\t-p | --port: Port to serve the generated html file on")

  console.info("\nHow to use arguments: ")
  console.info("\tPositionals=> [inDir] [outDir] [funcName] [arg1] [arg2] ... [argN] [port]\n")
  console.info("\tpositional(list)=> [i | inDir] [l | list]\n")
  console.info("\t-Note: The order of positional arguments is important and must match the order of the function arguments. If there are more arguments provided than the function arguments, the extra arguments will be ignored")
  console.info("\tExample: src/utils/emailTemplate generated/emailTemplate otpEmail 123456 2026-12-31 3333\n")
  console.info("\tExample(list): src/utils/emailTemplate list\n")

  console.info("\tFlags=> [i | inDir] | [o | outDir] | [f | funcName] | [a | arg1] | ... | [a | argN] | [p | port]\n")
  console.info("\tExample: -f otpEmail -a 123456 -a 2026-12-31 -o generated/emailTemplate -i src/utils/emailTemplate -p 3333")
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
  },
  allowPositionals: true
});

if (values.help) {
  printHelp();
  process.exit(0);
}
if (values.list) {
  listFunctions(values, positionals);
  process.exit(0);
}

try {
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
