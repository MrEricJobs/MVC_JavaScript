let params = {};

const pagination = {
    total    : 0,                    // 총 게시글 개수
    totalPage: 0,                    // 총 페이지 번호
    maxPost  : 2,                   // 최대 표시 가능한 게시글 개수
    maxList  : 5,                    // 최대 페이지 리스트 개수
    currPage : 1,                    // 현재 페이지 번호
    currRange: { start: 0, end: 0 }, // 현재 페이지 리스트 범위,
    category_id: '',                 // 현재 카테고리 id
};

window.addEventListener('DOMContentLoaded', function() {
    // URL 파라미터 불러오기
    let urlSearchParams = new URLSearchParams(window.location.search);
    for (let [key, value] of urlSearchParams) {
        params[key] = value;
    }

    loadCategories().then(function() {
        if (params.category_id !== undefined) {
            pagination.category_id = params.category_id;
        }

        if (pagination.category_id) {
            paginationInit(pagination.category_id).then(function() {
                if (params.currPage !== undefined) {
                    pagination.currPage = params.currPage;
                }
                setPage(pagination.currPage);
            });
        }
    });
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
            // loadPosts(category.category_id);
            // countPost(category.category_id);
            paginationInit(category.category_id);
        });

        categoryList.append(a);
    }
    if(categories.length > 0) {
        pagination.category_id = categories[0].category_id;
        pagination.currPage = 1;
    }
}

/**
 * 게시글 불러오기
 */
async function loadPosts(category_id, max_post, page) {
    let response = await fetch(
        `/board-api/posts?category_id=${category_id}&max_post=${max_post}&page=${page}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    let posts = await response.json();
    let postList = document.querySelector('#post-list');
    postList.innerHTML = '';

    for (let post of posts) {
        let a = document.createElement('a');
        a.className = 'post';
        a.href = `/board/read?post_id=${post.post_id}&category_id=${category_id}&currPage=${pagination.currPage}`;

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

/**
 * 게시글 집계하기
 */
async function countPost(category_id) {
    let response = await fetch(
        `/board-api/post/count?category_id=${category_id}`,
        {
            method : 'GET',
            headers: { 'Content-Type': 'application/json' } 
        }
    );

    let result = await response.json();

    console.log(result);

    return result.count;
}

/**
 * 페이지네이션 초기화
 */
async function paginationInit(category_id) {
    pagination.total     = await countPost(category_id);
    pagination.totalPage = Math.ceil(pagination.total / pagination.maxPost);
    pagination.currPage  = 1;

    pagination.currRange.start = 1;
    pagination.currRange.end   = Math.min(pagination.totalPage, pagination.maxList);

    
    pagination.category_id = category_id;

    setupPageList();

    // 기존 게시글 리스트 삭제
    let postList = document.querySelector('#post-list');
    postList.innerHTML = '';  
    
    // 1번 페이지 보여주기
    if (pagination.totalPage !== 0) {
        setPage(1);
    }
}

/**
 * 페이지 리스트 설정
 */
function setupPageList() {
    let pageList = document.querySelector('#page-list');

    // 구조분해 할당 (객체의 속성을 구조를 분해하여 변수로 바로 받음)
    let {start ,end} = pagination.currRange;

    // 페이지네이션바에 페이지 번호 생성
    pageList.innerHTML = ''; // 기존 페이지 번호 제거
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

    // 화살표 버튼 설정
    let firstBtn = document.querySelector('#first-page');
    let prevBtn  = document.querySelector('#prev-page');
    let nextBtn  = document.querySelector('#next-page');
    let lastBtn  = document.querySelector('#last-page');

    // 첫번째 페이지 이동 버튼
    if (pagination.currRange.start === 1 || pagination.totalPage === 0) {
        firstBtn.classList.add('disabled');
    } else {
        firstBtn.classList.remove('disabled');
        firstBtn.onclick = function() { setPage(1); };
    }

    // 이전 페이지 그룹 이동 버튼
    let prevNum = pagination.currRange.start - pagination.maxList;
    if (prevNum <= 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
        prevBtn.onclick = function() { setPage(prevNum); };
    }

    // 다음 페이지 그룹 이동 버튼
    let nextNum = pagination.currRange.end + 1;
    if (nextNum > pagination.totalPage) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
        nextBtn.onclick = function() { setPage(nextNum); };
    }

    // 마지막 페이지 이동 버튼
    if (pagination.currRange.end === pagination.totalPage) {
        lastBtn.classList.add('disabled');
    } else {
        lastBtn.classList.remove('disabled');
        lastBtn.onclick = function() { setPage(pagination.totalPage) };
    }
}

function setPage(num) {
    let {start, end} = pagination.currRange;

    if (end === 0) return;

    pagination.currPage = num;

    if (num < start || num > end) {
        pagination.currRange.start = Math.floor((pagination.currPage - 1) / pagination.maxList) * pagination.maxList + 1;
        pagination.currRange.end   = Math.min(pagination.currRange.start + pagination.maxList - 1, pagination.totalPage);
        setupPageList();
        setPage(num);
        return;
    } 


    // 내가 누른 페이지 번호
    let pageDiv      = document.querySelector(`.page[data-value="${num}"]`);
    // 내가 누르지 않은 페이지 번호
    let otherPageDiv = document.querySelectorAll(`.page:not([data-value="${num}"])`);


    // 누른 번호 표시
    if (pageDiv != null) { 
        pageDiv.classList.add('on');
    }
    // 누르지 않은 번호 표시 제거
    for (let other of otherPageDiv) {
        other.classList.remove('on');
    }

    pagination.currPage = num;
    loadPosts(pagination.category_id, pagination.maxPost, num);
}