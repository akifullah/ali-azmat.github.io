document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('.past-tours-container table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const itemsPerPage = 10; // Adjust as needed
    let currentPage = 1;
    let blocks = [];

    // 1. Group rows into blocks based on rowspan
    let i = 0;
    while (i < rows.length) {
        const row = rows[i];
        let blockSize = 1;

        // Check for rowspan in any cell of the current row
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.hasAttribute('rowspan')) {
                const span = parseInt(cell.getAttribute('rowspan'));
                if (span > blockSize) {
                    blockSize = span;
                }
            }
        });

        // Form the block
        const block = [];
        for (let j = 0; j < blockSize; j++) {
            if (i + j < rows.length) {
                block.push(rows[i + j]);
            }
        }
        blocks.push(block);
        i += blockSize;
    }

    const totalPages = Math.ceil(blocks.length / itemsPerPage);

    // 2. Create Pagination Controls
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container d-flex justify-content-center mt-4';
    table.parentElement.parentElement.appendChild(paginationContainer); // Append after the table-responsive div

    function scrollToHeader() {
        const header = document.getElementById('table-header');
        if (header) {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function renderControls() {
        paginationContainer.innerHTML = '';

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-outline-dark me-2';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                renderControls();
                scrollToHeader();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Page Numbers
        // Logic to show a window of pages if too many, for now simple list
        // Let's show max 5 page numbers: current-2, current-1, current, current+1, current+2
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let p = startPage; p <= endPage; p++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `btn ${p === currentPage ? 'btn-dark' : 'btn-outline-dark'} me-1`;
            pageBtn.innerText = p;
            pageBtn.addEventListener('click', () => {
                currentPage = p;
                showPage(currentPage);
                renderControls();
                scrollToHeader();
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-outline-dark ms-1';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                renderControls();
                scrollToHeader();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    // 3. Show/Hide Rows
    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Hide all rows first
        rows.forEach(row => row.style.display = 'none');

        // Show rows for current page blocks
        for (let k = start; k < end && k < blocks.length; k++) {
            const block = blocks[k];
            block.forEach(row => row.style.display = '');
        }

        // Update "Showing X to Y of Z entries" text if needed, but controls are enough for now
    }

    // Initialize
    showPage(currentPage);
    renderControls();
});
