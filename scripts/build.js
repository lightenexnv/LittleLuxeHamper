const { execSync } = require("child_process");

// Ensure DATABASE_URL is set for build environments (e.g. Vercel)
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

// Use binary engine type to prevent query_engine DLL out-of-memory on systems with small page files
process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";

// Ensure all Node child processes and Next.js workers have sufficient heap memory
if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes("--max-old-space-size")) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} --max-old-space-size=4096`.trim();
}

console.log("=== Little Luxe Hamper Build Pipeline ===");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "(Configured)" : "(Default file:./dev.db)");

try {
  console.log("Generating Prisma Client...");
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });
} catch (err) {
  console.error("Prisma generate failed:", err.message);
  process.exit(1);
}

try {
  console.log("Syncing database schema...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", env: process.env });
} catch (err) {
  console.warn("Prisma db push warning (continuing build):", err.message);
}

try {
  console.log("Running Next.js build...");
  execSync("node --max-old-space-size=4096 node_modules/next/dist/bin/next build", {
    stdio: "inherit",
    env: process.env,
  });
  console.log("=== Build completed successfully ===");
} catch (err) {
  console.error("Next.js build failed:", err.message);
  process.exit(1);
}
