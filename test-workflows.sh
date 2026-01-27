#!/bin/bash

# Test GitHub Actions Workflows Locally
# This script provides multiple ways to test your workflows

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== GitHub Actions Workflow Testing ===${NC}\n"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Test 1: Validate YAML Syntax
echo -e "${YELLOW}[1/4] Validating YAML syntax...${NC}"
if command_exists python3; then
    for file in .github/workflows/*.yml; do
        echo "  Checking $file..."
        python3 -c "import yaml, sys; yaml.safe_load(open('$file'))" && echo -e "  ${GREEN}✓${NC} $file is valid" || echo -e "  ${RED}✗${NC} $file has errors"
    done
else
    echo "  ${YELLOW}⚠${NC} Python3 not available, using basic validation..."
    for file in .github/workflows/*.yml; do
        if [ -f "$file" ]; then
            echo -e "  ${GREEN}✓${NC} $file exists"
        fi
    done
fi
echo ""

# Test 2: Test Registry Build (the main command in workflows)
echo -e "${YELLOW}[2/4] Testing registry build with Bun...${NC}"
if bun run registry:build; then
    echo -e "${GREEN}✓ Registry build successful${NC}\n"
else
    echo -e "${RED}✗ Registry build failed${NC}\n"
    exit 1
fi

# Test 3: Test install with frozen lockfile
echo -e "${YELLOW}[3/4] Testing bun install --frozen-lockfile...${NC}"
if bun install --frozen-lockfile; then
    echo -e "${GREEN}✓ Install with frozen lockfile successful${NC}\n"
else
    echo -e "${RED}✗ Install with frozen lockfile failed${NC}\n"
    exit 1
fi

# Test 4: Check for act (optional local workflow runner)
echo -e "${YELLOW}[4/4] Checking for 'act' (local workflow runner)...${NC}"
if command_exists act; then
    echo -e "${GREEN}✓ 'act' is installed${NC}"
    echo ""
    echo "You can run workflows locally with:"
    echo "  ${BLUE}act -l${NC}                    # List all workflows"
    echo "  ${BLUE}act -n${NC}                    # Dry run"
    echo "  ${BLUE}act workflow_dispatch${NC}     # Test workflow_dispatch events"
    echo ""
else
    echo -e "${YELLOW}⚠ 'act' not installed${NC}"
    echo ""
    echo "To install 'act' for local workflow testing:"
    echo "  ${BLUE}curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash${NC}"
    echo ""
    echo "Or with package manager:"
    echo "  ${BLUE}# Ubuntu/Debian${NC}"
    echo "  sudo apt install act"
    echo ""
    echo "  ${BLUE}# macOS${NC}"
    echo "  brew install act"
    echo ""
fi

echo -e "${GREEN}=== All Tests Completed ===${NC}"
echo ""
echo "Additional testing options:"
echo ""
echo "1. ${BLUE}Validate workflows with GitHub CLI:${NC}"
echo "   gh workflow list"
echo "   gh workflow view registry-build.yml"
echo ""
echo "2. ${BLUE}Test workflow syntax with action-validator:${NC}"
echo "   docker run --rm -v \$(pwd):/repo rhysd/actionlint -color"
echo ""
echo "3. ${BLUE}Push to a test branch:${NC}"
echo "   git checkout -b test-bun-migration"
echo "   git push -u origin test-bun-migration"
echo "   gh workflow run registry-build.yml"
echo ""
