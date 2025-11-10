import { spawn } from "node:child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve CLI location. Prefer installed package. Fallback to local bin.
function resolveCytoBin(): string {
  if (process.env.CYTO_BIN) return process.env.CYTO_BIN;
  try {
    return require.resolve("@stereobooster/cyto-nodejs/bin/cyto-nodejs.js");
  } catch {
    return resolve(__dirname, "../../bin/cyto-nodejs.js");
  }
}
const executablePath = resolveCytoBin();

// Exact logic kept. Types added only.
export const cytoSnap = (src: string | object, dst?: string): Promise<string> => {
  return new Promise((resolvePromise, rejectPromise) => {
    const srcStdin = typeof src !== "string";
    const args: string[] = [];
    let res = "";
    if (!srcStdin) args.push("-s", src as string);
    if (dst) args.push("-d", dst);

    const bin = spawn(executablePath, args, { windowsHide: true });

    bin.stdout.on("data", (data) => (res = data.toString()));
    bin.stderr.on("data", (data) => rejectPromise(`stderr: ${data}`));
    bin.on("close", (code) => {
      if (code === 0) resolvePromise(res);
      else rejectPromise(`child process exited with code ${code}`);
    });
    if (srcStdin) {
      bin.stdin.write(JSON.stringify(src));
      bin.stdin.end();
    }
  });
};
