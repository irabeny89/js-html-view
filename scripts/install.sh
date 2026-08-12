#!/usr/bin/env bash

# Stop the script immediately if any individual command fails
set -e

# Define color codes for pretty terminal logging output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # Proper terminal color reset sequence

echo -e "${BLUE}=== Starting js-html-view Installation ===${NC}"

# 1. Prerequisite Check: Ensure the user has Node.js installed on their computer
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed on your system.${NC}"
    echo "Please install Node.js (v18+) before running this installer."
    exit 1
fi

# 2. Configuration Parameters
REPO="irabeny89/js-html-view" # Cleared leading slash
INSTALL_DIR="/usr/local/lib/hv"
BIN_DIR="/usr/local/bin"

# Fetch the exact string tag name of the latest automated GitHub Release
echo "Fetching latest release version metadata..."
LATEST_TAG=$(curl -s "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"tag_name": "([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
    echo -e "${RED}Error: Could not resolve the latest version tag from GitHub.${NC}"
    exit 1
fi

echo -e "Found version: ${GREEN}${LATEST_TAG}${NC}"

# 3. Create an isolated secure workspace directory path inside /tmp
TMP_DIR=$(mktemp -d)
TARBALL_NAME="js-html-view-${LATEST_TAG}.tar.gz"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST_TAG}/${TARBALL_NAME}"

# 4. Download and extract the production archive bundle asset
echo "Downloading production release archive..."
curl -L "$DOWNLOAD_URL" -o "${TMP_DIR}/${TARBALL_NAME}"

echo "Extracting release files..."
mkdir -p "${TMP_DIR}/package"
tar -xzf "${TMP_DIR}/${TARBALL_NAME}" -C "${TMP_DIR}/package"

# 5. Securely move files to the system application folders (using sudo for folder creation)
echo "Installing application layers to ${INSTALL_DIR}..."
sudo mkdir -p "$INSTALL_DIR"
sudo cp -r "${TMP_DIR}/package/"* "$INSTALL_DIR/"

# 6. Mount the global executable symlink pointer entrypoint shortcut mapping
echo "Creating global executable command shortcut at ${BIN_DIR}/hv..."
sudo ln -sf "${INSTALL_DIR}/dist/index.js" "${BIN_DIR}/hv"
sudo chmod +x "${BIN_DIR}/hv"

# 7. Clean up temporary installer folders
rm -rf "$TMP_DIR"

echo -e "${GREEN}=== Success! js-html-view has been installed system-wide ===${NC}"
echo "You can now execute your utility anywhere by running: hv --help"
