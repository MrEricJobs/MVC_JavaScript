let params = {};

const pagination = {
    total: 0,
    totalPage: 1,
    maxPost: 15,
    maxList: 5,
    currPage: 1,
    currRange: { start: 0, end: 0 },
    category_id: ''
}

window.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    
    // URL 파라미터 불러오기
    let urlSearchParams = new URLSearchParams(window.location.search);
    for (let [key, value] of urlSearchParams) {
        params[key] = value;
    }
        
    // category_id가 있다면 게시글 리스트 출력
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
            countPost(category.category_id);
            paginationInit(category.category_id);
        });

        categoryList.append(a);
    }
}

/**
 * 게시글 불러오기
 */
async function loadPosts(category_id) {
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

async function countPost(category_id){
    let response = await fetch(
        `/board-api/post/count?category_id=${category_id}`, 
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    );

    let result = await response.json();

    return result.count;
}


async function paginationInit(category_id) {
    pagination.total = await countPost(category_id);
    pagination.totalPage = Math.ceil(pagination.total / pagination.maxPost);
    pagination.currPage = 1;
    pagination.currRange.start = Math.min(pagination.totalPage, 1);
    pagination.currRange.end = Math.max(pagination.totalPage, 0)
    pagination.category_id = category_id;

    setupPageList();
}

function setupPageList() {
    let pageList = document.querySelector('#page-list');

    let {start, end} = pagination.currRange;

    pageList.innerHTML = '';
    for (let num = start; num <= end; num++) {
        let pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.innerText = num;
        pageDiv.setAttribute('data-value', num);
        pageDiv.addEventListener('click', function() {
            setPage(num)
        });
        pageList.append(pageDiv);
    }
}

function setPage(num) {
    let pageDiv = document.querySelector(`.page[data-value="${num}"]`);
    let otherPageDiv = document.querySelectorAll(`.page:not([data-value="${num}"])`);
    
    if (pageDiv != null) {
        pageDiv.className += ' on';
    }
    for (let other of otherPageDiv) {
        other.className = other.className.replace(' on', '');
    }
}   