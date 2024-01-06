window.addEventListener('DOMContentLoaded', function() {
    loadCategoreis();
});

async function loadCategoreis() {
    let response = await fetch('/board-api/category', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    });
    let categories = await response.json();

    let categoryList = document.querySelector('#category-list');

    for(let category of categories) {
        let a = document.createElement('a');
        a.className = 'category';
        a.innerText = category.title;

        categoryList.append(a)
    }
}