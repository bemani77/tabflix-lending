// 언어 설정 및 전환 관련 기능

// 언어 데이터를 저장할 객체
let languageData = {};
let currentLanguage = 'ko'; // 기본 언어는 한국어

// 언어 데이터 로드 함수
async function loadLanguageData(lang) {
    try {
        const response = await fetch(`js/lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`${lang} 언어 데이터를 불러오는 데 실패했습니다.`);
        }
        return await response.json();
    } catch (error) {
        console.error('언어 데이터 로드 오류:', error);
        // 오류 발생 시 기본 한국어 데이터 사용
        return loadLanguageData('ko');
    }
}

// 언어 전환 기능 초기화
async function initializeLanguage() {
    // 저장된 언어 설정 불러오기
    const savedLanguage = localStorage.getItem('language') || 'ko';
    await setLanguage(savedLanguage);

    // 언어 선택 드롭다운 설정
    setupLanguageDropdown();
}

// 언어 설정 함수
async function setLanguage(lang) {
    try {
        // 언어 데이터 로드
        languageData = await loadLanguageData(lang);
        currentLanguage = lang;

        // 언어별 요소 상태 설정
        updateLanguageElements(lang);

        // 텍스트 적용
        applyLanguageTexts();

        // 현재 선택된 언어 표시
        updateCurrentLanguageDisplay();

        // 언어 설정 저장
        localStorage.setItem('language', lang);
    } catch (error) {
        console.error('언어 설정 오류:', error);
    }
}

// 언어 선택 드롭다운 설정
function setupLanguageDropdown() {
    const languageButton = document.getElementById('languageButton');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    // 드롭다운 토글
    languageButton.addEventListener('click', () => {
        languageDropdown.classList.toggle('show');
    });

    // 언어 옵션 선택
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            languageDropdown.classList.remove('show');
        });
    });

    // 다른 곳 클릭 시 드롭다운 닫기
    document.addEventListener('click', function(event) {
        if (!languageButton.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.remove('show');
        }
    });
}

// 언어별 요소 상태 업데이트
function updateLanguageElements(lang) {
    // 언어별 클래스 활성화/비활성화
    document.querySelectorAll('.lang-ko, .lang-en, .lang-vi, .lang-id, .lang-zh, .lang-es').forEach(el => {
        el.classList.remove('active');
    });

    document.querySelectorAll(`.lang-${lang}`).forEach(el => {
        el.classList.add('active');
    });

    // 언어 옵션 선택 상태 표시
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}

// 현재 선택된 언어 표시 업데이트
function updateCurrentLanguageDisplay() {
    const currentLanguageDisplay = document.querySelector('.current-language');
    if (currentLanguageDisplay) {
        const languageNames = {
            'ko': '한국어',
            'en': 'English',
            'vi': 'Tiếng Việt',
            'id': 'Bahasa Indonesia',
            'zh': '中文',
            'es': 'Español'
        };
        currentLanguageDisplay.textContent = languageNames[currentLanguage] || languageNames['ko'];
    }
}

// 데이터 속성을 기반으로 모든 텍스트 요소에 언어 텍스트 적용
function applyLanguageTexts() {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (languageData[key]) {
            if (element.tagName === 'IMG') {
                element.alt = languageData[key];
            } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                element.textContent = languageData[key];
            } else {
                element.textContent = languageData[key];
            }
        }
    });
}

// 페이지 로드 시 언어 설정 초기화
document.addEventListener('DOMContentLoaded', initializeLanguage);
