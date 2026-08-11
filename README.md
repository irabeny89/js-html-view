# js-html-view

A command-line utility powered by Bun to generate static HTML files from TypeScript/JavaScript template functions and preview them via a local HTTP server.

## Features

- **HTML Generation**: Execute exported template functions and save rendered HTML directly to a designated output directory.
- **Flexible Invocation**: Works with positional arguments or CLI option flags (`-i`, `-o`, `-f`, `-a`, `-p`).
- **Live Preview Server**: Optional built-in HTTP server to serve and preview generated email HTML in your browser.
- **Template Discovery**: List all exported functions and their expected parameters within a given module using `-l`.

---

## Installation

Ensure you have [Bun](https://bun.sh) installed.

```bash
bun install
```

---

## Usage

### 1. Positional Arguments

Pass input directory/file, output directory, function name, function arguments, and an optional port number:

```bash
bun index.ts [inDir] [outDir] [funcName] [arg1] [arg2] ... [argN] [port]
```

**Example:**

```bash
bun index.ts src/templates/email.ts dist/emails otpEmail 123456 2026-12-31 3333
```

This generates `dist/emails/otpEmail.html` and starts a preview server at `http://localhost:3333`.

---

### 2. Option Flags

You can also use flag options to specify parameters:

```bash
bun index.ts -i src/templates/email.ts -o dist/emails -f otpEmail -a 123456 -a 2026-12-31 -p 3333
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

Inspect available template functions and their required arguments:

```bash
bun index.ts src/templates/email.ts -l
```

---

### 4. Writing Template Functions

Create a file (e.g. `templates.ts`) that exports email template functions returning an HTML string:

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

Run the test suite using Bun:

```bash
bun run test
```
