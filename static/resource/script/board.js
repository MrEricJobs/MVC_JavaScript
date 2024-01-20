let params = {};

window.addEventListener('DOMContentLoaded', function() {
    loadCategories();

    let urlSearchParams = new URLSearchParams(window.location.search);
    for (let [key, value] of urlSearchParams) {
        params[key] = value;
    }

    if (params.category_id !== undefined) {
        loadPosts(params.category_id);
    }
});

/**
 * 카테고리 불러오기
 */
async function loadCategories() {
    let response = await fetch('/board-api/category', {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    let categories = await response.json();

    let categoryList = document.querySelector('#category-list');

    for (let category of categories) {
        let a = document.createElement('a');
        a.className = 'category';
        a.innerText = category.title;
        a.addEventListener('click', function() {
            loadPosts(category.category_id);
        });

        categoryList.append(a);
    }
}

/**
 * 게시글 불러오기
 */
async function loadPosts(category_id) {
    if(category_id == undefined) {
        return
    }
    let response = await fetch(`/board-api/posts?category_id=${category_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let posts = await response.json();
    let postList = document.querySelector('#post-list');

    postList.innerHTML = '';

    for (let post of posts) {
        let a = document.createElement('a');
        a.className = 'post';
        a.href = `/board/read?post_id=${post.post_id}&category_id=${category_id}`;

        let divNo = document.createElement('div');
        divNo.className = 'w10 txt-center';
        divNo.innerText = post.no;
        a.append(divNo);

        let divTitle = document.createElement('div');
        divTitle.className = 'w70 txt-left';
        divTitle.innerText = post.title;
        a.append(divTitle);

        let divCrt = document.createElement('div');
        divCrt.className = 'w10 txt-center';
        divCrt.innerText = post.crt.substring(0, 10);
        a.append(divCrt);

        let divView = document.createElement('div');
        divView.className = 'w10 txt-center';
        divView.innerText = post.view;
        a.append(divView);

        postList.append(a);
    }

}