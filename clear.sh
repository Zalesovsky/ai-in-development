#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping calculator and api-testing containers...${NC}"
docker stop calculator-expense-calculator 2>/dev/null || true
docker stop calculator-expense-calculator-tests 2>/dev/null || true
docker stop api-testing 2>/dev/null || true

echo -e "${YELLOW}Removing calculator and api-testing containers...${NC}"
docker rm calculator-expense-calculator 2>/dev/null || true
docker rm calculator-expense-calculator-tests 2>/dev/null || true
docker rm api-testing 2>/dev/null || true

echo -e "${YELLOW}Removing calculator and api-testing images...${NC}"
docker rmi calculator-expense-calculator:latest 2>/dev/null || true
docker rmi calculator-expense-calculator-tests:latest 2>/dev/null || true
docker rmi api-testing 2>/dev/null || true

echo -e "${GREEN}Cleanup completed!${NC}" 