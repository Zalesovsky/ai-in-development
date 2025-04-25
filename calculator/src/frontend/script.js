let expenses = [];

// Test data
const testData = [
    { category: 'Groceries', amount: 500 },
    { category: 'Rent', amount: 1500 },
    { category: 'Transportation', amount: 500 },
    { category: 'Entertainment', amount: 500 },
    { category: 'Communication', amount: 500 },
    { category: 'Gym', amount: 500 }
];

function populateTestData() {
    expenses.length = 0;
    const tbody = document.querySelector('#expenseTable tbody');

    while (tbody.rows.length > 1) {
        tbody.deleteRow(1);
    }

    testData.forEach(expense => {
        expenses.push({ ...expense });
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount.toLocaleString()}</td>
            <td><button onclick="removeExpense(this)">Remove</button></td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);
    });

    document.getElementById('error').textContent = '';
}

function addExpense() {
    const categoryInput = document.querySelector('.category');
    const amountInput = document.querySelector('.amount');
    const errorDiv = document.getElementById('error');

    const category = categoryInput.value.trim();
    const amount = parseFloat(amountInput.value);

    errorDiv.textContent = '';

    if (!category || isNaN(amount) || amount <= 0) {
        errorDiv.textContent = !category ? 'Please enter a category' : 'Please enter a valid amount';
        return;
    }

    expenses.push({ category, amount });

    const tbody = document.querySelector('#expenseTable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${category}</td>
        <td>${amount.toLocaleString()}</td>
        <td><button onclick="removeExpense(this)">Remove</button></td>
    `;
    tbody.insertBefore(newRow, tbody.firstChild);

    categoryInput.value = '';
    amountInput.value = '';
}

function removeExpense(button) {
    const row = button.parentNode.parentNode;
    const category = row.cells[0].textContent;
    
    const index = expenses.findIndex(expense => expense.category === category);
    if (index !== -1) {
        expenses.splice(index, 1);
    }

    row.remove();
}

function calculate() {
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');

    errorDiv.textContent = '';
    resultsDiv.style.display = 'none';

    if (expenses.length === 0) {
        errorDiv.textContent = 'Please add at least one expense';
        return;
    }

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageDaily = total / 30;

    const topExpenses = [...expenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

    document.getElementById('total').textContent = total.toLocaleString();
    document.getElementById('average').textContent = averageDaily.toFixed(2);

    const topExpensesList = document.getElementById('topExpenses');
    topExpensesList.innerHTML = topExpenses
        .map(expense => `<li>${expense.category}: $${expense.amount.toLocaleString()}</li>`)
        .join('');

    resultsDiv.style.display = 'block';
}

// Export functions and data
module.exports = {
    populateTestData,
    addExpense,
    removeExpense,
    calculate,
    expenses,
    testData
};
