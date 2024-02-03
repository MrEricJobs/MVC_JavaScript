let quill = null;

window.addEventListener('DOMContentLoaded', function() {
    // Quill Editor 초기화
    quill = new Quill('#editor', {
        modules: {
            toolbar: false, // 툴바 감추기
        },
        readOnly: true,     // 읽기 전용 모드로 설정
        bounds: '#editor',  // 에디터 테두리 감추기
    });

    // URL 파라미터 가져오기
    let urlSearchParams = new URLSearchParams(window.location.search);
    let params = {};
    for (let [key, value] of urlSearchParams) {
        params[key] = value;
    }
    loadPost(params.post_id);

    // back버튼 클릭시 이벤트
    let back = document.querySelector('#back');
    back.addEventListener('click', function(evt) {
        window.location = `/board?category_id=${params.category_id}`;
    });
});

/**
 * 게시글 불러오기
 */
async function loadPost(post_id) {
    let response = await fetch(`/board-api/post?post_id=${post_id}`, {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    let post = await response.json();
    
    let category = document.querySelector('#category');
    let title    = document.querySelector('#title');
    let etc      = document.querySelector('#etc');
 
    category.innerText = post.category;
    title.innerText    = post.title;
    etc.innerText      = `작성일: ${post.crt} | 수정일: ${post.amd} | 조회수: ${post.view}`;
    quill.root.innerHTML = post.content;
}