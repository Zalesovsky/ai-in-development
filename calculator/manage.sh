#!/bin/bash

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

# Function to start the application
start_app() {
    echo "Starting Expense Calculator..."
    docker compose -f docker-compose.yml up -d

    if [ $? -eq 0 ]; then
        echo "Application started successfully!"
        echo "You can access it at http://localhost:8080"
    else
        echo "Failed to start the application"
        return 1
    fi
}

# Function to rebuild the application
rebuild_app() {
    echo "Stopping existing containers..."
    docker compose -f docker-compose.yml down

    echo "Rebuilding the application..."
    docker compose -f docker-compose.yml build --no-cache

    if [ $? -eq 0 ]; then
        echo "Application rebuilt successfully!"
        echo "You can start it using option 1"
    else
        echo "Failed to rebuild the application"
        return 1
    fi
}

# Function to stop the application
stop_app() {
    echo "Stopping Expense Calculator..."
    docker compose -f docker-compose.yml down

    if [ $? -eq 0 ]; then
        echo "Application stopped successfully!"
    else
        echo "Failed to stop the application"
        return 1
    fi
}

# Function to run tests with coverage
run_tests_with_coverage() {
    echo "Building test container..."
    docker build -f Dockerfile.test -t expense-calculator-tests .

    if [ $? -eq 0 ]; then
        echo "Test container built successfully!"
        echo "Running tests with coverage..."
        docker run --rm expense-calculator-tests

        if [ $? -eq 0 ]; then
            echo "Tests completed successfully!"
            echo "Coverage report has been generated"
        else
            echo "Failed to run tests"
            return 1
        fi
    else
        echo "Failed to build test container"
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
            echo "Invalid option. Please try again."
            ;;
    esac

    echo
    read -p "Press Enter to continue..."
done 