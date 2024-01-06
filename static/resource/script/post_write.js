let quill = null;

window.addEventListener('DOMContentLoaded', function() {
    quill = new Quill('#editor', {
        theme: 'snow'
    })

    loadCategoryDropdown();
});

async function loadCategoryDropdown() {
    let response = await fetch('/board-api/category', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    });
    let categories = await response.json();

    let dropdown = document.querySelector('#category');

    for(let category of categories) {
        let option = document.createElement('option');
        option.value = category.category_id;
        option.innerText = category.title;

        dropdown.append(option);
    }
}