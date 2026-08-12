# js-html-view

A command-line utility powered by Bun to generate static HTML files from TypeScript/JavaScript template functions and preview them via a local HTTP server.

[![GitHub Release](https://shields.io)](https://github.com)
[![License: MIT](https://shields.io)](LICENSE)

## Features

- **HTML Generation**: Execute exported template functions and save rendered HTML directly to a designated output directory.
- **Flexible Invocation**: Works with positional arguments or CLI option flags (`-i`, `-o`, `-f`, `-a`, `-p`).
- **Live Preview Server**: Optional built-in HTTP server to serve and preview generated email HTML in your browser.
- **Template Discovery**: List all exported functions and their expected parameters within a given module using `-l`.

---

## Installation

You can install and manage `js-html-view` using either Homebrew or a direct binary download.

### 1. Via Homebrew (Recommended for macOS & Linux)

Add the custom repository tap and install the binary globally:

```bash
brew tap irabeny89/tap
brew install hv
```

### 2. Via Curl and Shell Script

This approach works on both **macOS** and **Linux**. The script automatically detects your system and installs the appropriate binary.

```bash
curl -fsSL https://raw.githubusercontent.com/irabeny89/js-html-view/main/install.sh | bash
```

---

## Uninstallation

### If installed via Homebrew

```bash
brew uninstall hv
brew untap irabeny89/tap
```

### If installed via the Script Installer

You can run the official uninstallation script to completely remove all application directories and global shortcuts from your machine:

```bash
curl -fsSL https://raw.githubusercontent.com/irabeny89/js-html-view/main/uninstall.sh | bash
```

---

## Usage

Once installed globally, you can invoke the utility anywhere using the **`hv`** terminal command entrypoint.

### 1. Positional Arguments

Pass input directory/file, output directory, function name, function arguments, and an optional port number sequentially:

```bash
hv [inDir] [outDir] [funcName] [arg1] [arg2] ... [argN] [port]
```

**Example:**

```bash
hv src/templates/email.ts dist/emails otpEmail 123456 2026-12-31 3333
```

This generates `dist/emails/otpEmail.html` and starts a preview server at `http://localhost:3333`.

---

### 2. Option Flags

You can use explicit option flags to configure execution parameters dynamically:

```bash
hv -i src/templates/email.ts -o dist/emails -f otpEmail -a 123456 -a 2026-12-31 -p 3333
```

#### Available Flags

| Flag | Short | Description |
| --- | --- | --- |
| `--inDir` | `-i` | File or directory path containing the exported template functions |
| `--outDir` | `-o` | Output directory where the generated `.html` file will be saved |
| `--funcName` | `-f` | Name of the exported template function to invoke |
| `--args` | `-a` | Arguments to pass into the template function (repeat flag for multiple args) |
| `--port` | `-p` | Port number to serve the generated HTML preview server |
| `--list` | `-l` | List all available exported functions and their parameters |
| `--help` | `-h` | Print help and usage instructions |

---

### 3. List Exported Functions

Inspect and print out all available templates inside a file along with their required parameter signatures:

```bash
hv src/templates/email.ts -l
```

---

### 4. Writing Template Functions

Create a source file (e.g., `templates.ts`) that exports email template functions returning an HTML string payload:

```ts
export function welcomeEmail(name: string, role: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Email</title>
</head>
<body>
  <h1>Hello ${name}!</h1>
  <p>Your role is: ${role}</p>
</body>
</html>`;
}
```

---

## Running Tests

Execute the automated test suite locally using the Bun runtime:

```bash
bun test
```
