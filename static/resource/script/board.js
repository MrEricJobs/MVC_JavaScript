window.addEventListener('DOMContentLoaded', async function() {
    await loadCategoreis();
    await loadPosts();
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

async function loadPosts() {
    let response = await fetch('/board-api/posts?category_id=1', {
        method: ['GET', 'POST'],
        headers: { 'Content-Type': 'application/json'}
    });
    let posts = await response.json();

    console.log(posts);

    let list = document.querySelector('#post-list');

    for(let post of posts) {
        let a = document.createElement('a');
        let div1 = document.createElement('div');
        let div2 = document.createElement('div');
        let div3 = document.createElement('div');
        let div4 = document.createElement('div');

        a.className = 'post';
        div1.className = 'w10 txt-center';
        div2.className = 'w70 txt-left';
        div3.className = 'w10 txt-center';
        div4.className = 'w10 txt-center';

        div1.innerText = post.no
        div2.innerText = post.title;
        div3.innerText = post.crt;
        div4.innertext = post.view;

        a.append(div1);
        a.append(div2);
        a.append(div3);
        a.append(div4);

        list.append(a);
    }
}