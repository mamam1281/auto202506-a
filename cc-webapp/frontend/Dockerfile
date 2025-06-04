# cc-webapp/frontend/Dockerfile

# ---- Builder Stage ----
# This stage installs dependencies, copies all source code, and builds the Next.js app.
FROM node:18-alpine AS builder
# Updated to node:18-alpine to match CI node version from Subtask 28.
# The prompt mentioned node:16-alpine, but CI was set to '18'. Using '18' for consistency.

# Set working directory
WORKDIR /app

# Set environment variables for build if necessary (e.g., for analytics or feature flags)
# ENV NEXT_PUBLIC_SOME_VAR="build_time_value"

# Copy package.json and package-lock.json (or yarn.lock if using Yarn)
# The asterisk in package-lock.json* handles cases where it might not exist initially,
# though npm ci requires it.
COPY package.json package-lock.json* ./

# Install dependencies using npm ci for deterministic builds
# npm ci also automatically prunes extraneous packages.
RUN npm ci

# Copy the rest of the application source code into the builder stage
COPY . .

# Build the Next.js application for production
# This command runs `next build` as defined in package.json's "scripts".
# Any NEXT_PUBLIC_ environment variables needed by the build should be available here.
# These can be passed during the `docker build` command using --build-arg
# and then set with ENV in this stage if needed.
RUN echo "Starting Next.js build..." && \
    npm run build && \
    echo "Next.js build completed."

# ---- Runner Stage ----
# This stage creates the final, smaller image with only runtime necessities.
FROM node:18-alpine AS runner
# Using the same Node.js version as the builder for consistency.

WORKDIR /app

# Set environment for production to optimize Next.js performance
ENV NODE_ENV production

# Optionally, create a non-root user for enhanced security.
# This is good practice but adds complexity to file permissions.
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs --ingroup nodejs
# USER nextjs
# If using a non-root user, ensure file permissions are correct for copied artifacts and for Next.js to run.

# Copy necessary artifacts from the builder stage
# - .next folder (standalone build output if output: 'standalone' in next.config.js, otherwise regular .next)
# - public folder for static assets
# - node_modules (only runtime dependencies if package.json is pruned, or all if not)
# - package.json (for `npm start` script and runtime dependencies)
# - next.config.js (if it contains runtime configurations)

# If using Next.js default output (not 'standalone'):
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/next.config.js ./next.config.js # Only if you have a next.config.js with runtime needs.
                                                       # The default next.config.mjs might also be needed if it's not just build-time.
                                                       # For now, assuming basic setup.

# If using `output: 'standalone'` in `next.config.js`, the copy commands would be different:
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static # Static assets served by Next.js
# COPY --from=builder /app/public ./public

# Expose port 3000 (the default port Next.js runs on)
EXPOSE 3000

# The default command for starting a Next.js production application.
# `npm start` typically executes `next start`.
CMD ["npm", "start"]
