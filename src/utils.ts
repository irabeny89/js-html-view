import { exec } from "node:child_process";
import { version as currentVersion } from "../package.json";
import type { ParsedArgsValueT } from "./types";
import { join } from "node:path";

const REPO = "irabeny89/js-html-view";
const INSTALL_SCRIPT_URL = `https://raw.githubusercontent.com/${REPO}/main/install.sh`;
const UNINSTALL_SCRIPT_URL = `https://raw.githubusercontent.com/${REPO}/main/uninstall.sh`;
const LATEST_RELEASE_URL = `https://api.github.com/repos/${REPO}/releases/latest`

/**
 * Checks GitHub for a newer version of the CLI utility and notifies the user.
 */
export async function checkForUpdates(): Promise<void> {
  try {
    // Set a short timeout using AbortController so it doesn't slow down the CLI if the user is offline
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(LATEST_RELEASE_URL, {
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
      console.log(`\x1b[32mcurl -fsSL ${INSTALL_SCRIPT_URL} | bash\x1b[0m`);
      console.log("\x1b[34m%s\x1b[0m", "====================================================\n");
    }
  } catch {
    // Silently catch network errors or timeouts so the CLI works flawlessly offline
  }
}

/**
 * Checks if the required positional arguments have been provided
 * @param val {ParsedArgsValueT} - values object containing the function name and arguments
 * @returns {Required<Pick<ParsedArgsValueT, "inDir" | "outDir" | "funcName">>} - object containing the required positional arguments
 */
export function checkRequiredPositionalArgs(
  val: ParsedArgsValueT
): Required<Pick<ParsedArgsValueT, "inDir" | "outDir" | "funcName">> {
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
export function getFuncArgNames(func: Function): Array<string> {
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
 * @returns {ParsedArgsValueT} resolved values
 */
export function resolveValues(val: ParsedArgsValueT, pos: string[]): ParsedArgsValueT {
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
export function list(val: ParsedArgsValueT, pos: string[]) {
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
export function help() {
  console.info("Flags: ")
  console.info("\t-l: List available functions")
  console.info("\t-f | --funcName: Name of the function")
  console.info("\t-a | --args: Arguments to pass to the function")
  console.info("\t-o | --outDir: Directory to save the generated html file")
  console.info("\t-i | --inDir: Directory containing the function to generate html from")
  console.info("\t-up | --update: Update the CLI utility")
  console.info("\t-rm | --remove: Remove the CLI utility")
  console.info("\t-v | --version: Print the current version of the CLI utility")
  console.info("\t-p | --port: Port to serve the generated html file on")

  console.info("\nHow to use arguments: ")
  console.info("\tPositionals=> [inDir] [outDir] [funcName] [arg1] [arg2] ... [argN] [port]\n")
  console.info("\tpositional(list)=> [i | inDir] [l | list]\n")
  console.info("\tNote: The order of positional arguments is important and must match the order of the function arguments. If there are more arguments provided than the function arguments, the extra arguments will be ignored")
  console.info("\tExample: src/utils/emailTemplate generated/emailTemplate otpEmail 123456 2026-12-31 3333\n")
  console.info("\tExample(list): src/utils/emailTemplate list\n")

  console.info("\tFlags=> [i | inDir] | [o | outDir] | [f | funcName] | [a | arg1] | ... | [a | argN] | [p | port]\n")
  console.info("\tExample: -f otpEmail -a 123456 -a 2026-12-31 -o generated/emailTemplate -i src/utils/emailTemplate -p 3333")
}

export function version() {
  console.info("Version: ", currentVersion)
}

/**
 * Checks the installation source and updates the CLI utility appropriately.
 */
export function update(): void {
  // 1. Detect if the current file is running inside a Homebrew environment path
  // process.argv[1] returns the absolute path of the executing script file
  const executionPath = process.argv[1] || "";
  const isHomebrew = executionPath.includes("Cellar") || executionPath.includes("homebrew");

  if (isHomebrew) {
    console.log("\n\x1b[34m%s\x1b[0m", "====================================================");
    console.log("\x1b[33mHomebrew Installation Detected!\x1b[0m");
    console.log("Please use Homebrew directly to update this utility safely:");
    console.log("\x1b[32mbrew update && brew upgrade hv\x1b[0m");
    console.log("\x1b[34m%s\x1b[0m", "====================================================\n");
    return;
  }

  // 2. Fallback: Run the standard curl script for manual installations
  console.log("\x1b[34m%s\x1b[0m", "Checking for updates and launching installation pipeline...");

  exec(`curl -fsSL ${INSTALL_SCRIPT_URL} | bash`, (error, stdout, stderr) => {
    if (error) {
      console.error("\n\x1b[31m%s\x1b[0m", "❌ Update failed!");
      console.error(stderr || error.message);
      console.log("\nPlease try running the command manually with root permissions if required:");
      console.log(`\x1b[32mcurl -fsSL ${INSTALL_SCRIPT_URL} | bash\x1b[0m\n`);
      return;
    }

    if (stdout) console.log(stdout);
  });
}

/**
 * Checks the installation source and removes the CLI utility cleanly.
 */
export function uninstall(): void {
  // 1. Detect if the current file is running inside a Homebrew environment path
  // process.argv[1] returns the absolute path of the executing script file
  const executionPath = process.argv[1] || "";
  const isHomebrew = executionPath.includes("Cellar") || executionPath.includes("homebrew");

  if (isHomebrew) {
    console.log("\n\x1b[34m%s\x1b[0m", "====================================================");
    console.log("\x1b[33mHomebrew Installation Detected!\x1b[0m");
    console.log("Please use Homebrew directly to remove this utility safely:");
    console.log("\x1b[32mbrew uninstall hv && brew untap irabeny89/tap\x1b[0m");
    console.log("\x1b[34m%s\x1b[0m", "====================================================\n");
    return;
  }

  // Fallback: Run the standard uninstallation script for manual installations
  console.log("\x1b[31m%s\x1b[0m", "Launching uninstallation pipeline...");

  exec(`curl -fsSL ${UNINSTALL_SCRIPT_URL} | bash`, (error, stdout, stderr) => {
    if (error) {
      console.error("\n\x1b[31m%s\x1b[0m", "❌ Uninstallation failed!");
      console.error(stderr || error.message);
      console.log("\nPlease try running the command manually with root permissions if required:");
      console.log(`\x1b[32mcurl -fsSL ${UNINSTALL_SCRIPT_URL} | bash\x1b[0m\n`);
      return;
    }

    if (stdout) console.log(stdout);
  });
}