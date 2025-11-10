import { spawn } from "node:child_process";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "node:path";
import { createRequire } from "module";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolveCytoBin(): string {
  if (process.env.CYTO_BIN) return process.env.CYTO_BIN;
  try {
    return require.resolve("@stereobooster/cyto-nodejs/bin/cyto-nodejs.js");
  } catch {
    return resolve(__dirname, "../../bin/cyto-nodejs.js");
  }
}

const executablePath = resolveCytoBin();

// exact logic preserved: stdin when src is object, use -d when file output requested
export const cytoSnap = (src: string | object): Promise<string> =>
  new Promise(async (resolvePromise, rejectPromise) => {
    const workdir = await mkdtemp(join(tmpdir(), "cyto-"));
    const dst = join(workdir, `${randomUUID()}.svg`);

    const srcStdin = typeof src !== "string";
    const args: string[] = [];
    if (!srcStdin) args.push("-s", src as string);
    args.push("-d", dst);

    const bin = spawn(process.execPath, [executablePath, ...args], { windowsHide: true });

    let stderr = "";
    bin.stderr.on("data", d => (stderr += d.toString()));

    bin.on("close", async (code) => {
      try {
        if (code !== 0) return rejectPromise(`child process exited with code ${code}. ${stderr}`);
        const svg = await readFile(dst, "utf8");
        resolvePromise(svg);
      } catch (e) {
        rejectPromise(`failed to read svg: ${(e as Error).message}. ${stderr}`);
      } finally {
        await rm(workdir, { recursive: true, force: true }).catch(() => {});
      }
    });

    if (srcStdin) {
      bin.stdin.write(JSON.stringify(src));
      bin.stdin.end();
    }
  });
