import path from "path";
import { spawn } from "child_process";

export const EMBEDDING_DIMENSION = 384;

type PythonCommand = {
  command: string;
  args: string[];
};

const embeddingCache = new Map<string, number[]>();

function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

  if (!magnitude) {
    return Array.from({ length: EMBEDDING_DIMENSION }, () => 0);
  }

  return vector.map((value) => value / magnitude);
}

function buildFallbackEmbedding(text: string): number[] {
  const vector = Array.from({ length: EMBEDDING_DIMENSION }, () => 0);
  const normalizedText = text.toLowerCase().trim();

  if (!normalizedText) {
    return vector;
  }

  const tokens = normalizedText.split(/[^a-z0-9]+/).filter(Boolean);
  const sourceTokens = tokens.length > 0 ? tokens : [normalizedText];

  for (const token of sourceTokens) {
    for (let index = 0; index < token.length; index += 1) {
      const code = token.charCodeAt(index);
      const bucket = (code * 31 + index * 17 + token.length * 13) % EMBEDDING_DIMENSION;
      vector[bucket] += 1;
    }
  }

  return normalizeVector(vector);
}

function parseEmbeddingPayload(payload: string): number[] | null {
  const parsed = JSON.parse(payload) as unknown;

  if (!Array.isArray(parsed)) {
    return null;
  }

  const vector = parsed
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (vector.length !== EMBEDDING_DIMENSION) {
    return null;
  }

  return normalizeVector(vector);
}

function getPythonCandidates(scriptPath: string, text: string): PythonCommand[] {
  return [
    { command: "python", args: [scriptPath, text] },
    { command: "py", args: ["-3", scriptPath, text] },
  ];
}

async function runPythonEmbedding(text: string): Promise<number[] | null> {
  const scriptPath = path.resolve(__dirname, "embeddings.py");
  const commands = getPythonCandidates(scriptPath, text);

  for (const candidate of commands) {
    const embedding = await new Promise<number[] | null>((resolve) => {
      const child = spawn(candidate.command, candidate.args, {
        cwd: __dirname,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      const timer = setTimeout(() => {
        child.kill();
      }, 15000);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.once("error", () => {
        clearTimeout(timer);
        resolve(null);
      });

      child.once("close", (code) => {
        clearTimeout(timer);

        if (code !== 0 && !stdout.trim()) {
          if (stderr.trim()) {
            console.warn(`Embedding script failed with ${candidate.command}: ${stderr.trim()}`);
          }
          resolve(null);
          return;
        }

        try {
          resolve(parseEmbeddingPayload(stdout.trim()));
        } catch (error) {
          console.warn("Failed to parse Python embedding output:", error);
          resolve(null);
        }
      });
    });

    if (embedding) {
      return embedding;
    }
  }

  return null;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return Array.from({ length: EMBEDDING_DIMENSION }, () => 0);
  }

  const cached = embeddingCache.get(normalizedText);
  if (cached) {
    return cached;
  }

  const pythonEmbedding = await runPythonEmbedding(normalizedText);
  const embedding = pythonEmbedding ?? buildFallbackEmbedding(normalizedText);

  embeddingCache.set(normalizedText, embedding);
  return embedding;
}
