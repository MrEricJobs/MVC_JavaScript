/////////////////////////////////////////////////////////////////////
// 페이지 로드시 실행
let currentIframe = null;
// DomContentLoaded와 load의 차이:
window.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initLoginModal();
    initRegisterModal();

    // 페이지 로드 직후 바로 대시보드 불러오기
    let pageWrap = document.querySelector('#page-wrap');
    let iframe = document.createElement('iframe');
    iframe.className = 'page-iframe';
    iframe.src = '/dashboard';

    currentIframe = iframe;
    pageWrap.append(iframe);
});
/////////////////////////////////////////////////////////////////////

// 공통 컴포넌트 초기화 함수

/**
 * 내비게이션 바 초기화
 */
function initNavbar() {
    // 내비게이션 바
    let navbar = document.querySelector('#navbar');

    let settingBtn = navbar.querySelector('.setting');
    let modal = document.querySelector('#login-modal');
    settingBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
        modal.classList.add('on');
    });

    // 내비게이션 바에 동적 메뉴 추가시 감지 및 클릭 이벤트 등록
    let navbarObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === "childList") {
                for (let node of mutation.addedNodes) {
                    node.addEventListener('click', onNavMenuClick1);
                }
            }
        }
    });

    navbarObserver.observe(navbar, { childList: true });

    // 이미 있는 메뉴 클릭 이벤트 등록
    let navMenuList = navbar.querySelectorAll('.nav-menu');
    for (let navMenu of navMenuList) {
        if (navMenu.classList.contains('setting')) continue;
        navMenu.addEventListener('click', onNavMenuClick1);
    }
}

function initLoginModal() {
    let modal = document.querySelector('#login-modal');
    let backdrop = modal.querySelector('.backdrop');

    backdrop.addEventListener('click', function() {
        modal.classList.remove('on');
    });

    let modalR = document.querySelector('#register-modal');
    let rBtn = modal.querySelector('#r-btn');
    rBtn.addEventListener('click', function() {
        modal.classList.remove('on');
        modalR.classList.add('on');
    });
}

function initRegisterModal() {
    let modal = document.querySelector('#register-modal');
    let backdrop = modal.querySelector('.backdrop');
    let submitBtn = modal.querySelector('#register-submit');

    backdrop.addEventListener('click', function() {
        modal.classList.remove('on');
    });
    
    submitBtn.addEventListener('click', function() {
        submitRegistration();
    });
}



/////////////////////////////////////////////////////////////////////
// 공통 컴포넌트 클릭 이벤트 핸들러

/**
 * 내비게이션 메뉴 클릭 핸들러
 * @param {MouseEvent} event - 클릭 이벤트 객체
 */
function onNavMenuClick1(event) {
    // 기본 이벤트 방지
    event.preventDefault();
    
    // 메뉴에서 on 클래스 일관 제거
    let navMenuList = document.querySelectorAll('#navbar > .nav-menu');
    for (let navMenu of navMenuList) {
        navMenu.classList.remove('on');
    }

    // 누른 항목 on 클래스 추가
    event.target.classList.add('on');

    // iframe 페이지 로드
    let pageWrap = document.querySelector('#page-wrap');
    let iframe = document.createElement('iframe');
    iframe.className = 'page-iframe';
    iframe.src = event.target.getAttribute('href');

    if (currentIframe) {
        currentIframe.remove();
    }
    currentIframe = iframe;
    pageWrap.append(iframe);
}

async function submitRegistration() {
    let inputID = document.querySelector('#register-id');
    let inputPW = document.querySelector('#register-id');

    let response = await fetch('/user-api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: inputID.value,
            pw: inputPW.value
        })
    });

    let result = await response.json();
    if (result.state === 'success') {
        alert('회원가입 성공!');
    }
    else {
        alert('회원가입 실패!');
    }
}