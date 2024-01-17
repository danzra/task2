document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-upload');
    const fileTypeSelect = document.getElementById('file-type');
    const availableFieldsSelect = document.getElementById('available-fields');
    const fieldsToDisplaySelect = document.getElementById('fields-to-display');
    const addFieldButton = document.getElementById('add-field');
    const removeFieldButton = document.getElementById('remove-field');
    const importButton = document.getElementById('import-btn');
    const productTable = document.getElementById('product-table');
    const apiUrl = 'https://s3.amazonaws.com/open-to-cors/assignment.json';
    let products = [];

    // Fetch JSON from the API and initialize available fields
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            products = Object.values(data.products);
            initializeFields();
            displayProducts();
        });

    function initializeFields() {
        // Assuming the first product has all the fields
        const productFields = Object.keys(products[0]);
        productFields.forEach(field => {
            const option = new Option(field, field);
            availableFieldsSelect.add(option);
        });
    }

    function displayProducts() {
        // Clear existing table rows
        productTable.querySelector('thead').innerHTML = '';
        productTable.querySelector('tbody').innerHTML = '';

        // Sort products by descending popularity
        products.sort((a, b) => b.Popularity - a.Popularity);

        // Create table headers
        const fieldsToDisplay = Array.from(fieldsToDisplaySelect.options).map(option => option.value);
        const theadTr = document.createElement('tr');
        fieldsToDisplay.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            theadTr.appendChild(th);
        });
        productTable.querySelector('thead').appendChild(theadTr);

        // Create table rows
        products.forEach(product => {
            const tr = document.createElement('tr');
            fieldsToDisplay.forEach(field => {
                const td = document.createElement('td');
                td.textContent = product[field];
                tr.appendChild(td);
            });
            productTable.querySelector('tbody').appendChild(tr);
        });
    }

    // Handle field addition
    addFieldButton.addEventListener('click', () => {
        moveSelectedOptions(availableFieldsSelect, fieldsToDisplaySelect);
    });

    // Handle field removal
    removeFieldButton.addEventListener('click', () => {
        moveSelectedOptions(fieldsToDisplaySelect, availableFieldsSelect);
    });

    // Utility function to move options between select elements
    function moveSelectedOptions(fromSelect, toSelect) {
        Array.from(fromSelect.selectedOptions).forEach(option => {
            toSelect.add(option);
        });
        displayProducts(); // Refresh the table view
    }

    // Handle form submission
    importButton.addEventListener('click', (event) => {
        event.preventDefault();
        displayProducts();
    });

    // Listen for file input changes if needed
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (fileTypeSelect.value === 'JSON') {
            readJsonFile(file);
        }
        // Implement CSV parsing if needed
    });

    // Function to read and parse JSON file
    function readJsonFile(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                products = JSON.parse(event.target.result);
                initializeFields();
                displayProducts();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }
});
