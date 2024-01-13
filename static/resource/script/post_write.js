let quill = null;

window.addEventListener('DOMContentLoaded', function() {
    quill = new Quill('#editor', {
        theme: 'snow'
    })

    loadCategoryDropdown();

    let submit = this.document.querySelector('#submit');
    submit.addEventListener('click', function() {
        submit.setAttribute('disabled', '');
        submitPost().finally(function () {
            submit.removeAttribute('disabled');
        });
    });
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

async function submitPost() {
    let category_id = document.querySelector('#category').value;
    let title = document.querySelector('#title').value;
    let content = quill.root.innerText;
    try {
        let response = await fetch('/board-api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_id: category_id,
                title: title,
                content: content
            })
        });
        
        let result = await response.json();

        location.href = '/board'
    }
    catch(e) {
        alert('에러가 발생했습니다. 관리자에게 문의하세요.')
    }
}
