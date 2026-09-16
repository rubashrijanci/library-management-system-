let books = JSON.parse(localStorage.getItem("books")) || [];

let editId = null;


// Display books
function displayBooks() {

    const table = document.getElementById("bookTable");
    const search = document.getElementById("search").value.toLowerCase();

    table.innerHTML = "";

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.category.toLowerCase().includes(search)
    );

    filteredBooks.forEach(book => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${book.id}</td>

            <td>
                <strong>${book.title}</strong><br>
                <small>${book.isbn}</small>
            </td>

            <td>${book.author}</td>

            <td>${book.category}</td>

            <td>${book.year}</td>

            <td>
                <span class="${book.available ? "available" : "issued"}">
                    ${book.available ? "Available" : "Issued"}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editBook(${book.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteBook(${book.id})">
                    Delete
                </button>

            </td>
        `;

        table.appendChild(row);
    });

    updateDashboard();
}


// Save book
function saveBook(event) {

    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    const category = document.getElementById("category").value.trim();
    const year = document.getElementById("year").value;
    const available = document.getElementById("available").checked;

    // Validation
    if (!title || !author || !isbn || !category || !year) {
        alert("Please fill all fields.");
        return;
    }

    if (year < 1000 || year > 2100) {
        alert("Please enter a valid year.");
        return;
    }

    // Duplicate ISBN
    const duplicate = books.some(book =>
        book.isbn === isbn && book.id !== editId
    );

    if (duplicate) {
        alert("ISBN already exists.");
        return;
    }

    // Update
    if (editId !== null) {

        const book = books.find(book => book.id === editId);

        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.category = category;
        book.year = year;
        book.available = available;

        alert("Book updated successfully.");

    }

    // Create
    else {

        const newBook = {

            id: books.length > 0
                ? Math.max(...books.map(book => book.id)) + 1
                : 1,

            title: title,
            author: author,
            isbn: isbn,
            category: category,
            year: year,
            available: available
        };

        books.push(newBook);

        alert("Book added successfully.");
    }

    localStorage.setItem("books", JSON.stringify(books));

    resetForm();
    displayBooks();
}


// Edit book
function editBook(id) {

    const book = books.find(book => book.id === id);

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("category").value = book.category;
    document.getElementById("year").value = book.year;
    document.getElementById("available").checked = book.available;

    editId = id;

    document.getElementById("formTitle").innerText =
        "Update Book";

    document.getElementById("bookForm").scrollIntoView({
        behavior: "smooth"
    });
}


// Delete book
function deleteBook(id) {

    const confirmDelete =
        confirm("Do you want to delete this book?");

    if (!confirmDelete) {
        return;
    }

    books = books.filter(book => book.id !== id);

    localStorage.setItem(
        "books",
        JSON.stringify(books)
    );

    displayBooks();

    alert("Book deleted successfully.");
}


// Dashboard count
function updateDashboard() {

    document.getElementById("totalBooks").innerText =
        books.length;

    document.getElementById("availableBooks").innerText =
        books.filter(book => book.available).length;

    document.getElementById("issuedBooks").innerText =
        books.filter(book => !book.available).length;
}


// Show form
function showForm() {

    document.getElementById("bookForm").scrollIntoView({
        behavior: "smooth"
    });
}


// Hide/reset form
function hideForm() {
    resetForm();
}


// Reset form
function resetForm() {

    document.querySelector("form").reset();

    document.getElementById("available").checked = true;

    editId = null;

    document.getElementById("formTitle").innerText =
        "Add New Book";
}


// Load books when page opens
displayBooks();
