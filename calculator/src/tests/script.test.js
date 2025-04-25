/**
 * @jest-environment jsdom
 */

// Import functions and data for tests
const { populateTestData, addExpense, removeExpense, calculate, expenses, testData } = require('./script');

// Mock document
beforeEach(() => {
    document.body.innerHTML = `
        <table id="expenseTable">
            <tbody>
                <tr>
                    <td><input type="text" class="category" /></td>
                    <td><input type="number" class="amount" /></td>
                    <td><button onclick="addExpense()">Add</button></td>
                </tr>
            </tbody>
        </table>
        <div id="results" style="display:none;">
            <span id="total"></span>
            <span id="average"></span>
            <ul id="topExpenses"></ul>
        </div>
        <div id="error"></div>
    `;
    expenses.length = 0; // Clear array
});

describe('Expense Calculator', () => {
    test('populateTestData adds test data to table and expenses', () => {
        populateTestData();
        const rows = document.querySelectorAll('#expenseTable tbody tr');
        expect(rows.length).toBe(testData.length + 1); // Plus 1 input row
        expect(expenses.length).toBe(testData.length);
        expect(document.getElementById('error').textContent).toBe('');
    });

    test('populateTestData works with empty table', () => {
        document.querySelector('#expenseTable tbody').innerHTML = '';
        populateTestData();
        const rows = document.querySelectorAll('#expenseTable tbody tr');
        expect(rows.length).toBe(testData.length);
    });

    test('populateTestData clears existing rows correctly', () => {
        // Add some existing rows
        const tbody = document.querySelector('#expenseTable tbody');
        for (let i = 0; i < 3; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Existing${i}</td>
                <td>100</td>
                <td><button>Remove</button></td>
            `;
            tbody.insertBefore(row, tbody.firstChild);
        }
        expect(document.querySelectorAll('#expenseTable tbody tr').length).toBe(4); // 3 + input row

        populateTestData();

        const rows = document.querySelectorAll('#expenseTable tbody tr');
        expect(rows.length).toBe(testData.length + 1); // test data + input row
        expect(expenses.length).toBe(testData.length);

        // Verify that all test data is present in the table
        const rowData = Array.from(rows).slice(0, -1) // exclude input row
            .map(row => ({
                category: row.cells[0].textContent,
                amount: parseFloat(row.cells[1].textContent.replace(/,/g, ''))
            }));

        testData.forEach(testItem => {
            expect(rowData.some(row =>
                row.category === testItem.category &&
                row.amount === testItem.amount
            )).toBe(true);
        });
    });

    test('addExpense adds a new expense', () => {
        document.querySelector('.category').value = 'Books';
        document.querySelector('.amount').value = '500';

        addExpense();

        expect(expenses.length).toBe(1);
        expect(expenses[0]).toEqual({ category: 'Books', amount: 500 });

        const rows = document.querySelectorAll('#expenseTable tbody tr');
        expect(rows.length).toBe(2); // 1 added + 1 input row
    });

    test('addExpense shows error if category is missing', () => {
        document.querySelector('.category').value = '';
        document.querySelector('.amount').value = '500';

        addExpense();

        expect(document.getElementById('error').textContent).toBe('Please enter a category');
        expect(expenses.length).toBe(0);
    });

    test('addExpense shows error if amount is invalid', () => {
        document.querySelector('.category').value = 'Books';
        document.querySelector('.amount').value = '-100';

        addExpense();

        expect(document.getElementById('error').textContent).toBe('Please enter a valid amount');
        expect(expenses.length).toBe(0);
    });

    test('removeExpense removes the correct expense', () => {
        expenses.push({ category: 'Books', amount: 500 });

        const tbody = document.querySelector('#expenseTable tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>Books</td>
            <td>500</td>
            <td><button id="removeBtn">Remove</button></td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);

        const removeButton = document.getElementById('removeBtn');
        removeExpense(removeButton);

        expect(expenses.length).toBe(0);
        expect(document.querySelectorAll('#expenseTable tbody tr').length).toBe(1); // Only input row remains
    });

    test('removeExpense and recalculate with large numbers', () => {
        // Add multiple expenses including a large number
        expenses.push({ category: 'Small', amount: 100 });
        expenses.push({ category: 'Large', amount: 4353533 });
        expenses.push({ category: 'Medium', amount: 1000 });

        // Add rows to table
        const tbody = document.querySelector('#expenseTable tbody');
        const rows = [
            { category: 'Small', amount: 100 },
            { category: 'Large', amount: 4353533 },
            { category: 'Medium', amount: 1000 }
        ];
        
        rows.forEach(row => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${row.category}</td>
                <td>${row.amount.toLocaleString()}</td>
                <td><button class="removeBtn">Remove</button></td>
            `;
            tbody.insertBefore(newRow, tbody.firstChild);
        });

        // Calculate initial total
        calculate();
        const total = 4353533 + 1000 + 100;
        expect(document.getElementById('total').textContent).toBe(total.toLocaleString());

        // Remove the large number
        const largeNumberRow = Array.from(tbody.querySelectorAll('tr'))
            .find(row => row.cells[0].textContent === 'Large');
        const removeButton = largeNumberRow.querySelector('.removeBtn');
        removeExpense(removeButton);

        // Verify the large number was removed
        expect(expenses.length).toBe(2);
        expect(expenses.find(e => e.amount === 4353533)).toBeUndefined();

        // Manually recalculate
        calculate();
        expect(document.getElementById('total').textContent).toBe('1,100');
    });

    test('removeExpense handles non-existent expense', () => {
        const tbody = document.querySelector('#expenseTable tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>NonExistent</td>
            <td>999</td>
            <td><button id="removeBtn">Remove</button></td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);

        const removeButton = document.getElementById('removeBtn');
        removeExpense(removeButton);

        expect(document.querySelectorAll('#expenseTable tbody tr').length).toBe(1);
    });

    test('calculate displays correct total, average, and top expenses', () => {
        expenses.push({ category: 'Books', amount: 500 });
        expenses.push({ category: 'Rent', amount: 1500 });
        expenses.push({ category: 'Food', amount: 1000 });

        calculate();

        expect(document.getElementById('total').textContent).toBe('3,000');
        expect(document.getElementById('average').textContent).toBe('100.00');
        expect(document.getElementById('topExpenses').innerHTML).toContain('Rent');
        expect(document.getElementById('results').style.display).toBe('block');
    });

    test('calculate shows error when no expenses', () => {
        calculate();
        expect(document.getElementById('error').textContent).toBe('Please add at least one expense');
    });

    test('calculate correctly sorts and displays top expenses with equal amounts', () => {
        expenses.push({ category: 'Books', amount: 500 });
        expenses.push({ category: 'Food', amount: 500 });
        expenses.push({ category: 'Entertainment', amount: 500 });
        expenses.push({ category: 'Transport', amount: 500 });

        calculate();

        const topExpensesHtml = document.getElementById('topExpenses').innerHTML;
        expect(topExpensesHtml).toContain('Books');
        expect(topExpensesHtml).toContain('Food');
        expect(topExpensesHtml).toContain('Entertainment');
        expect(document.getElementById('total').textContent).toBe('2,000');
        expect(document.getElementById('average').textContent).toBe('66.67');
    });

    test('calculate handles string and number amounts correctly', () => {
        expenses.push({ category: 'Test1', amount: 1000 });
        expenses.push({ category: 'Test2', amount: 2000 });
        expenses.push({ category: 'Test3', amount: 3000 });

        calculate();
        expect(document.getElementById('total').textContent).toBe('6,000');
    });
});
