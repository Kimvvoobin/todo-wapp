# TODO 웹앱

모던하고 깔끔한 디자인의 TODO 웹 애플리케이션입니다. Firebase Firestore와 LocalStorage를 활용하여 데이터를 저장하고 동기화합니다.

## 📋 개요

TODO 웹앱은 사용자가 할 일을 효율적으로 기록, 관리, 완료할 수 있도록 돕는 웹 기반 서비스입니다. 간단한 UI와 직관적인 UX를 통해 누구나 쉽게 사용할 수 있는 것을 목표로 합니다.

## ✨ 주요 기능

### 핵심 기능
- ✅ **할 일 추가**: 입력창에 할 일을 작성하고 추가 버튼 클릭 또는 Enter 입력 시 TODO 생성
- 📝 **할 일 목록 조회**: 추가된 TODO를 리스트 형태로 표시 (최신 항목이 상단에 표시)
- ✓ **할 일 완료 처리**: 체크박스를 클릭하면 완료 상태로 변경, 완료된 TODO는 취소선과 흐린 색상으로 표시
- ✏️ **할 일 수정**: TODO 텍스트 클릭 또는 수정 버튼 클릭 시 모달에서 수정 가능
- 🗑️ **할 일 삭제**: 삭제 버튼 클릭 시 확인 후 해당 TODO 삭제

### 추가 기능
- 🔍 **필터링**: 전체 / 진행중 / 완료 필터로 할 일 분류
- 📊 **통계 표시**: 전체 / 진행중 / 완료 할 일 개수 실시간 표시
- 🗑️ **일괄 삭제**: 완료된 항목만 삭제 또는 전체 삭제 기능
- 💾 **데이터 저장**: Firebase Firestore와 LocalStorage 이중 저장 (Firebase 미설정 시 LocalStorage만 사용)
- 🔄 **실시간 동기화**: Firebase Firestore를 이용한 실시간 데이터 동기화
- 🌙 **다크 모드**: 다크 모드/라이트 모드 전환 기능
- ⌨️ **접근성**: 키보드 네비게이션 및 ARIA 레이블 지원
- 📱 **반응형 디자인**: 모바일 퍼스트 기반으로 모바일, 태블릿, 데스크톱 모두 지원

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Firebase Firestore
- **Storage**: LocalStorage (폴백)
- **Hosting**: Firebase Hosting (선택)

## 🚀 시작하기

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정 > 일반 탭에서 웹 앱 추가
4. Firebase 설정 정보 복사

### 2. Firebase 설정 정보 입력

`app.js` 파일을 열고 다음 부분을 수정하세요:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Firestore 데이터베이스 설정

1. Firebase Console에서 Firestore Database로 이동
2. 데이터베이스 생성 (테스트 모드 또는 프로덕션 모드)
3. 보안 규칙 설정

**테스트 모드 보안 규칙 예시:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **주의**: 프로덕션 환경에서는 적절한 인증 및 보안 규칙을 설정하세요.

### 4. 로컬 서버 실행

웹 서버를 통해 실행하세요. 예를 들어:

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js (http-server):**
```bash
npx http-server -p 8000
```

**VS Code Live Server:**
- Live Server 확장 프로그램 설치 후 `index.html` 우클릭 > "Open with Live Server"

브라우저에서 `http://localhost:8000` 접속

> **참고**: Firebase 설정 없이도 LocalStorage를 통해 로컬에서 정상 작동합니다.

## 📖 사용 방법

### 할 일 추가
1. 상단 입력 필드에 할 일을 입력
2. "추가" 버튼 클릭 또는 Enter 키 입력
3. 빈 입력은 추가되지 않음

### 할 일 완료
- 할 일 항목의 체크박스를 클릭하여 완료/미완료 상태 토글
- 완료된 할 일은 취소선과 흐린 색상으로 표시

### 할 일 수정
1. 할 일 항목의 텍스트를 클릭하거나 "수정" 버튼 클릭
2. 모달 창에서 내용 수정
3. "저장" 버튼 클릭 또는 Enter 키 입력
4. ESC 키로 취소 가능

### 할 일 삭제
- 할 일 항목의 "삭제" 버튼 클릭 후 확인 팝업에서 확인

### 필터링
- 상단 필터 버튼을 클릭하여 전체 / 진행중 / 완료 할 일만 표시

### 일괄 삭제
- "완료 항목 삭제" 버튼: 완료된 모든 할 일 삭제
- "전체 삭제" 버튼: 모든 할 일 삭제 (확인 필요)

### 다크 모드
- 우측 상단의 테마 토글 버튼 클릭하여 다크 모드/라이트 모드 전환
- 설정은 LocalStorage에 저장되어 다음 방문 시에도 유지

### 키보드 단축키
- `Enter`: 할 일 추가 또는 수정 저장
- `ESC`: 모달 창 닫기
- `Tab`: 필터 버튼 및 입력 필드 간 이동

## 💾 데이터 저장

이 애플리케이션은 두 가지 방식으로 데이터를 저장합니다:

1. **Firebase Firestore**: 클라우드 데이터베이스에 저장 (설정된 경우)
   - 실시간 동기화 지원
   - 여러 기기에서 동일한 데이터 접근 가능

2. **LocalStorage**: 브라우저 로컬 저장소에 자동 저장
   - Firebase 미설정 시에도 정상 작동
   - Firebase 설정 시에도 백업으로 사용

Firebase가 설정되지 않은 경우에도 LocalStorage를 통해 정상 작동합니다.

## 📁 파일 구조

```
todo-wapp/
├── index.html      # 메인 HTML 파일
├── styles.css      # 스타일시트 (반응형 디자인, 다크 모드 포함)
├── app.js          # 애플리케이션 로직 (Firebase 연동, CRUD 기능)
└── README.md       # 프로젝트 문서
```

## 🎨 UI/UX 특징

- **모바일 퍼스트**: 모바일 화면을 우선으로 설계
- **반응형 디자인**: Flexbox 기반 레이아웃으로 모든 화면 크기 지원
- **직관적인 인터페이스**: 터치하기 쉬운 버튼 크기와 명확한 시각적 피드백
- **완료된 TODO 구분**: 취소선과 투명도로 완료 상태 명확히 표시
- **부드러운 애니메이션**: TODO 추가/수정 시 부드러운 전환 효과

## ♿ 접근성 기능

- ARIA 레이블 및 역할 속성
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 포커스 관리
- 명확한 색상 대비

## 🌐 브라우저 호환성

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 🔮 향후 확장 계획

- 로그인 기능 추가
- 사용자별 TODO 관리
- 마감일(Due Date) 및 알림 기능
- 카테고리 / 태그 기능
- 정렬 기능 (날짜, 우선순위 등)

## 📊 성공 기준

- ✅ TODO 추가/삭제/완료 기능이 오류 없이 동작
- ✅ 새로고침 후에도 TODO 데이터 유지
- ✅ 사용자가 직관적으로 사용 가능하다고 판단
- ✅ 모든 주요 화면이 반응형으로 동작
- ✅ Firestore CRUD 작업이 1초 이내 응답

## 🐛 문제 해결

### Firebase 연결 오류
- Firebase 설정 정보가 올바른지 확인
- Firestore 데이터베이스가 생성되었는지 확인
- 브라우저 콘솔에서 오류 메시지 확인
- 보안 규칙이 올바르게 설정되었는지 확인

### 데이터가 저장되지 않음
- 브라우저의 LocalStorage가 활성화되어 있는지 확인
- 브라우저 콘솔에서 JavaScript 오류 확인
- Firebase 설정이 올바른지 확인

### 실시간 동기화가 작동하지 않음
- Firebase 설정이 올바른지 확인
- Firestore 보안 규칙에서 읽기 권한이 있는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

## 📝 라이선스

이 프로젝트는 자유롭게 사용할 수 있습니다.

## 👥 기여

이 프로젝트는 학습 및 포트폴리오 목적의 웹앱으로 설계되었습니다. 개선 사항이나 버그 리포트는 언제든 환영합니다!
