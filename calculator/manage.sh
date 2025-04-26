#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to display the menu
show_menu() {
    echo "Expense Calculator Management"
    echo "============================"
    echo "1. Start application"
    echo "2. Rebuild application"
    echo "3. Stop application"
    echo "4. Run tests with coverage"
    echo "5. Exit"
    echo "============================"
    echo -n "Enter your choice [1-5]: "
}

# Function to remove old images
remove_old_images() {
    echo -e "${YELLOW}Removing old images...${NC}"
    docker rmi calculator-expense-calculator:latest 2>/dev/null || true
    docker rmi calculator-expense-calculator-tests:latest 2>/dev/null || true
}

# Function to start the application
start_app() {
    echo -e "${YELLOW}Starting Expense Calculator...${NC}"
    docker compose -f docker-compose.yml up -d

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Application started successfully!${NC}"
        echo "You can access it at http://localhost:8080"
    else
        echo -e "${RED}Failed to start the application${NC}"
        return 1
    fi
}

# Function to rebuild the application
rebuild_app() {
    echo -e "${YELLOW}Stopping existing containers...${NC}"
    docker compose -f docker-compose.yml down

    # Remove old images before building
    remove_old_images

    echo -e "${YELLOW}Rebuilding the application...${NC}"
    docker compose -f docker-compose.yml build --no-cache

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Application rebuilt successfully!${NC}"
        echo "You can start it using option 1"
    else
        echo -e "${RED}Failed to rebuild the application${NC}"
        return 1
    fi
}

# Function to stop the application
stop_app() {
    echo -e "${YELLOW}Stopping Expense Calculator...${NC}"
    docker compose -f docker-compose.yml down

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Application stopped successfully!${NC}"
    else
        echo -e "${RED}Failed to stop the application${NC}"
        return 1
    fi
}

# Function to run tests with coverage
run_tests_with_coverage() {
    # Remove old images before building test container
    remove_old_images
    
    echo -e "${YELLOW}Building test container...${NC}"
    docker build -f Dockerfile.test -t calculator-expense-calculator-tests .

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Test container built successfully!${NC}"
        echo -e "${YELLOW}Running tests with coverage...${NC}"
        docker run --rm calculator-expense-calculator-tests

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Tests completed successfully!${NC}"
            echo "Coverage report has been generated"
        else
            echo -e "${RED}Failed to run tests${NC}"
            return 1
        fi
    else
        echo -e "${RED}Failed to build test container${NC}"
        return 1
    fi
}

# Main loop
while true; do
    show_menu
    read choice

    case $choice in
        1)
            start_app
            ;;
        2)
            rebuild_app
            ;;
        3)
            stop_app
            ;;
        4)
            run_tests_with_coverage
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac

    echo
    read -p "Press Enter to continue..."
done 