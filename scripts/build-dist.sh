#!/bin/bash
set -e

DIST_DIR="dist"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building react-native-launcher-kit for distribution..."

# Clean previous dist
rm -rf "$ROOT_DIR/$DIST_DIR"
mkdir -p "$ROOT_DIR/$DIST_DIR"

# Build type definitions
cd "$ROOT_DIR"
npx bob build

# Copy lib/typescript (type definitions only)
mkdir -p "$ROOT_DIR/$DIST_DIR/lib"
cp -r "$ROOT_DIR/lib/typescript" "$ROOT_DIR/$DIST_DIR/lib/typescript"
rm -rf "$ROOT_DIR/$DIST_DIR/lib/typescript/__tests__"

# Copy android native code (only src and build config)
mkdir -p "$ROOT_DIR/$DIST_DIR/android"
cp "$ROOT_DIR/android/build.gradle" "$ROOT_DIR/$DIST_DIR/android/"
cp "$ROOT_DIR/android/gradle.properties" "$ROOT_DIR/$DIST_DIR/android/"
cp -r "$ROOT_DIR/android/src" "$ROOT_DIR/$DIST_DIR/android/src"

# Copy src (Metro resolves this at runtime + codegen needs it)
cp -r "$ROOT_DIR/src" "$ROOT_DIR/$DIST_DIR/src"
rm -rf "$ROOT_DIR/$DIST_DIR/src/__tests__"

# Copy package files
cp "$ROOT_DIR/package.json" "$ROOT_DIR/$DIST_DIR/"
cp "$ROOT_DIR/README.md" "$ROOT_DIR/$DIST_DIR/"
cp "$ROOT_DIR/LICENSE" "$ROOT_DIR/$DIST_DIR/"

echo ""
echo "Done! dist/ is ready for publish."
echo ""
echo "To publish:"
echo "  cd dist && npm publish"
echo ""
echo "Contents:"
find "$ROOT_DIR/$DIST_DIR" -type f | wc -l | xargs echo "  Files:"
du -sh "$ROOT_DIR/$DIST_DIR" | awk '{print "  Size:", $1}'
