import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const serverDir = join(process.cwd(), ".next", "server");
const chunksDir = join(serverDir, "chunks");

try {
  const entries = await readdir(chunksDir, { withFileTypes: true });
  await mkdir(serverDir, { recursive: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
      .map((entry) => copyFile(join(chunksDir, entry.name), join(serverDir, entry.name))),
  );

  console.log("Mirrored Next server chunks for runtime loading.");
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    console.log("No Next server chunks to mirror.");
  } else {
    throw error;
  }
}
