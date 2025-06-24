class Book
{
    constructor(title, author, isbn)
    {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
    
}

// UI Class

class ui
{

// Functions 
// Add Book
addBookToList(book)
{
    const info = document.querySelector('#book-info');
    // Create elements
    const row = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    const col3 = document.createElement('td');
    const col4 = document.createElement('td');
    col1.innerHTML = `${book.title}`;
    col2.innerHTML = `${book.author}`;
    col3.innerHTML = `${book.isbn}`;
    col4.className = 'delete is-small is-danger';
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    info.appendChild(row);

}

// Clear Field
clearFields()
{
    
    if(document.querySelector('#headr').value !== "" && document.querySelector('#author').value !== "" &&  document.querySelector('#isbn').value !== "")
    {
        document.querySelector('#headr').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }
    document.querySelector('#headr').style.border = "";
    document.querySelector('#author').style.border = "";
    document.querySelector('#isbn').style.border = "";
}

showAlert(message, className)
{
// Create element
const newDiv = document.createElement('div');
// Adding a class name
newDiv.className = `tag ${className} is-rounded`;
// Add textNode to the div which holds the message
const msg = document.createTextNode(message);
newDiv.appendChild(msg);
// Getting parent
const parent = document.querySelector('.err');
parent.appendChild(newDiv);

// Bottom code says, remove error after 3s
setTimeout(() =>
{
    document.querySelector(`.err`).innerHTML = ''
},
2500);
}

deleteItem(e)
{
    if(e.target.classList.contains('delete')) // Use classList for classes that have 'delete' in them + more, if a class is JUST CALLED "DELETE", then use className.
    {
        e.target.parentElement.remove();
    }
}

}


// Local Storage Class
class Storage
{

static getBooks()
{
    let item;
    if(localStorage.getItem('item') === null)
    {
        item = [];
    }
    else
    {
        let jsonFormat = localStorage.getItem('item');
        item = JSON.parse(jsonFormat);
    }

    return item; // returning as JSON format
}

// Setting items into local Storage
static putInLocalStorage(book)
{
   const item = Storage.getBooks();

    item.push(book);

    let change = JSON.stringify(item);
    localStorage.setItem('item', change);
}

// Keep in local storage
// Static method calls are made directly on the class and are not callable on instances of the class
// These static methods can only be called by the class name by using a dot (.)
static keepItemsInLocalStorage()
{
const item = Storage.getBooks();

item.forEach((oneVal) =>
{
    const info = document.querySelector('#book-info');
    // Create elements
    const row = document.createElement('tr');
    const col1 = document.createElement('td');
    const col2 = document.createElement('td');
    const col3 = document.createElement('td');
    const col4 = document.createElement('td');
    col1.innerHTML = `${oneVal.title}`;
    col2.innerHTML = `${oneVal.author}`;
    col3.innerHTML = `${oneVal.isbn}`;
    col4.className = 'delete is-small is-danger';
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    info.appendChild(row);
});

}

static removeAllFromLocalStorage()
{
    localStorage.clear();
}

static removeOneItemFromLocalStorage(val)
{
    const item = Storage.getBooks();

    // Each value inside item in an array of JSON formatted title, author and isbn num
    item.forEach((itemVal, index) =>
    {
        console.log(itemVal);
        if(val.textContent === itemVal.isbn) // so we can call isbn val
        {
            item.splice(index, 1);
        }
    });

    localStorage.setItem('item', JSON.stringify(item));

    console.log(val);

}


}

// Keep items in local storage before the button is clicked
document.addEventListener('DOMContentLoaded', Storage.keepItemsInLocalStorage);



// EVENT LISTENER FOR KEYBOARD DOWN ON INPUTS
document.body.addEventListener('focusin', function(e)
{
    if(e.target.classList.contains('input'))
    {
        e.target.style.border = '2px solid lightgreen';
        document.querySelector('.err').innerHTML = "";
    }
});
    



// Event Listeners 
const butn = document.querySelector('#butn').addEventListener('click', runFunction);
function runFunction(e)
{
    const title = document.querySelector('#headr').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;


// Istantiate a Book Object
const book = new Book(title, author, isbn);
    
// Instantiating a UI Object [Creating new UI Object and called addBookToList prototype]
const newUi = new ui();

newUi.clearFields(); /* Better way to clear fields instead of making 3 lines in here */

if(title === "" || author === "" || isbn === "")
{
    newUi.showAlert('Please fill in all fields!', 'is-danger');
    if(title === "")
    {
        document.querySelector('#headr').style.border = '1px solid red';
    }
    if(author === "")
    {
        document.querySelector('#author').style.border = '1px solid red';
    }
    if(isbn === "")
    {
        document.querySelector('#isbn').style.border = '1px solid red';
    }
}
else
{
    newUi.addBookToList(book); // This adds book to the list
    Storage.putInLocalStorage(book);
    newUi.showAlert('Book has been submitted!', 'is-success');
}

e.preventDefault();

}

// Removing the entire list
const clearButton = document.querySelector('#clr');
clearButton.addEventListener('click', deleteLibrary);

function deleteLibrary()
{
    // document.querySelector('tbody#book.info').innerHTML = "";
    // console.log(clearButton);
    const info = document.querySelector('#book-info');
    
    while(info.firstChild)  // While 'info' has a child...
    { 
        info.removeChild(info.firstChild); //Remove child, but only remove firstChild one by one
    }
    
    Storage.removeAllFromLocalStorage();
    
}

// Removing one item from book list
document.body.addEventListener('click', deleteItem);

function deleteItem(e)
{
    const newUi = new ui();
    // console.log(e.target);
    if(e.target.classList.contains('delete')) // Use classList for classes that have 'delete' in them + more, if a class is JUST CALLED "DELETE", then use className.
    {
        const check = confirm('Are you sure you want to delete Book?');
        if(check === true)
        {
        newUi.deleteItem(e);
        newUi.showAlert(`Book has been removed!`, `is-warning`);
        }
        else
        {
            alert('Cancelled!');
        }
    }
        console.log(e.target);
        // Bottom code targets the element before the targeted button
        // If we keep adding previousElementSibling, it will keep giving us the element thats before the element thats being clicked
        Storage.removeOneItemFromLocalStorage(e.target.previousElementSibling);
}
