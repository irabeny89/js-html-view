import { describe, expect, test, afterAll, beforeAll } from "bun:test";
import { readFile, rm } from "fs/promises";
import { join } from "path";

function simpleHtml(name: string, role: string) {
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
function otpEmail(code: string, expires: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>OTP Code</title>
</head>
<body>
  <h1>Your OTP code is ${code}</h1>
  <p>It expires at ${expires}</p>
</body>
</html>`;
}

describe("Email Template Functions", () => {
  test("simpleHtml returns formatted HTML string", () => {
    const html = simpleHtml("Ernest", "Software Developer");
    expect(html).toContain("Hello Ernest!");
    expect(html).toContain("Your role is: Software Developer");
  });

  test("otpEmail returns formatted HTML string", () => {
    const html = otpEmail("123456", "2026-12-31");
    expect(html).toContain("Your OTP code is 123456");
    expect(html).toContain("It expires at 2026-12-31");
  });
});

describe("CLI Integration Tests", async () => {
  const relOutDir = "tests/generated_test"
  const relInDir = "tests/template.ts"
  const outDir = join(process.cwd(), relOutDir);
  const inDir = join(process.cwd(), relInDir)

  beforeAll(async () => {
    await Bun.write(inDir, `
    export const simpleHtml = (${simpleHtml.toString()});
    export const otpEmail = (${otpEmail.toString()});
    `)
  })
  afterAll(async () => {
    await Promise.all([
      rm(outDir, { recursive: true, force: true }),
      rm(inDir, { recursive: true, force: true }),
    ]);
  });

  test("CLI generates HTML via positional arguments", async () => {
    const proc = Bun.spawn([
      "bun",
      "src/index.ts",
      relInDir,
      relOutDir,
      "simpleHtml",
      "Ernest",
      "Software Developer",
    ]);

    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);

    const generatedFile = join(outDir, "simpleHtml.html");
    const content = await readFile(generatedFile, "utf-8");
    expect(content).toContain("Hello Ernest!");
    expect(content).toContain("Software Developer");
  });

  test("CLI generates HTML via flags", async () => {
    const proc = Bun.spawn([
      "bun",
      "src/index.ts",
      "-i",
      relInDir,
      "-o",
      relOutDir,
      "-f",
      "otpEmail",
      "-a",
      "654321",
      "-a",
      "2026-12-31",
    ]);

    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);

    const generatedFile = join(outDir, "otpEmail.html");
    const content = await readFile(generatedFile, "utf-8");
    expect(content).toContain("Your OTP code is 654321");
    expect(content).toContain("It expires at 2026-12-31");
  });

  test("CLI starts preview server when port positional argument is provided", async () => {
    const proc = Bun.spawn([
      "bun",
      "src/index.ts",
      relInDir,
      relOutDir,
      "simpleHtml",
      "Ernest",
      "Software Developer",
      "4444",
    ]);

    // Give server a short delay to boot up
    await new Promise((resolve) => setTimeout(resolve, 300));
    const response = await fetch("http://localhost:4444");
    const text = await response.text();
    expect(response.status).toBe(200);
    expect(text).toContain("Hello Ernest!");

    proc.kill();
  });

  test("CLI lists functions with -l flag", async () => {
    const proc = Bun.spawn([
      "bun",
      "src/index.ts",
      relInDir,
      "-l",
    ]);

    const stdout = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Available functions and their arguments");
  });

  test("CLI shows help with -h flag", async () => {
    const proc = Bun.spawn(["bun", "src/index.ts", "-h"]);

    const stdout = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Flags:");
  });

  test("CLI fails when required positional arguments are missing", async () => {
    const proc = Bun.spawn(["bun", "src/index.ts"]);

    const exitCode = await proc.exited;
    expect(exitCode).toBe(1);
  });
});
