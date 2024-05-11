/////////////////////////////////////////////////////////////////////
// 페이지 로드시 실행
let currentIframe = null;
// DomContentLoaded와 load의 차이:
window.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initLoginModal();
    initRegisterModal();
    setUserButton();

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

    // setting 버튼 이벤트 할당
    let settingBtn = navbar.querySelector('.setting');
    let modal = document.querySelector('#login-modal');
    settingBtn.addEventListener('click', function(evt) {
        evt.preventDefault(); // a태그 기본 동작 방지
        modal.classList.add('on');
    });

    let exitBtn = navbar.querySelector('.exit');
    exitBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
        requestLogout();
        location.reload(true);
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
        if (navMenu.classList.contains('exit')) continue;
        navMenu.addEventListener('click', onNavMenuClick1);
    }
}

/**
 * 로그인 모달 초기화
 */
function initLoginModal() {
    let modal     = document.querySelector('#login-modal');
    let backdrop  = modal.querySelector('.backdrop');
    let signUpBtn = modal.querySelector('#sign-up'); 
    let signInBtn = modal.querySelector('#sign-in');

    // 외부영역을 감싸는 backdrop 요소를 클릭시 모달 숨기기
    backdrop.addEventListener('click', function() {
        modal.classList.remove('on');
    });

    // 회원가입 버튼 클릭시 모달 셔플(로그인 숨기고 회원가입 띄우기)
    signUpBtn.addEventListener('click', function() {
        let registerModal = document.querySelector('#register-modal');
        modal.classList.remove('on');
        registerModal.classList.add('on');
    });

    // 로그인 버튼 클릭시 로그인 시도
    signInBtn.addEventListener('click', function() {
        requestLogin();
    });
}

/**
 * 회원가입 모달 초기화
 */
function initRegisterModal() {
    let modal = document.querySelector('#register-modal');
    let backdrop = modal.querySelector('.backdrop');
    let submitBtn = modal.querySelector('#register-submit');

    backdrop.addEventListener('click', function() {
        modal.classList.remove('on');
    });

    submitBtn.addEventListener('click', function() {
        submitRegistration().then(function() {
            modal.classList.remove('on');
        });
    });
}

function setUserButton() {
    let setting = document.querySelector('.setting');
    let exit = document.querySelector('.exit');
    sessionCheck().then(function(result) {
        if (result === true) {
            setting.classList.add('hidden');
            exit.classList.revmoe('hidden');
        } else {
            setting.classList.remove('hidden');
            exit.classList.add('hidden');
        }
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

/////////////////////////////////////////////////////////////////////
// 회원가입 및 로그인 관련 요청 함수

/** 회원가입 요청 함수 */
async function submitRegistration() {
    let inputID = document.querySelector('#register-id');
    let inputPW = document.querySelector('#register-pw');

    let response = await fetch('/user-api/sign-up', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
            id: inputID.value,
            pw: inputPW.value
        })
    });

    if (response.status === 200) {
        let result = await response.json();
        if (result.state === 'success') {
            alert('회원가입 성공!');
        } else {
            alert('회원가입 실패!');
        }
    } else {
        alert('회원가입 실패!');
    }
}

/** 로그인 요청 함수 */
async function requestLogin() {
    let modal     = document.querySelector('#login-modal');
    let inputID = document.querySelector('#login-id');
    let inputPW = document.querySelector('#login-pw');

    let response = await fetch('/user-api/sign-in', {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body   : JSON.stringify({
            id: inputID.value,
            pw: inputPW.value
        })
    });

    if (response.status === 200) {
        let result = await response.json();
        if (result.state === 'success') {
            alert('로그인 성공!');
            location.reload(true);
        } else {
            if (result.msg !== undefined) {
                alert(result.msg);
            } else {
                alert('로그인 실패!');
            }
        }
    } else {
        alert('로그인 실패!');
    }
}

async function sessionCheck() {
    let response = await fetch('/user-api/session-check', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    let result = await response.json();

    if (result.state === 'success')
        return true;
    else
        return false;
}

async function requestLogout() {
    let response = await fetch('/user-api/sign-out', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    let result = await response.json();
    if (result.state === 'success') {
        alert('로그아웃 성공!');
    } else {
        alert('로그아웃 실패!');
    }
}
