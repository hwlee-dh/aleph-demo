# aleph-demo

[ALEPH](https://github.com/hwlee-dh/aleph) 발표 자료와 데모를 올려 두는 사이트. GitHub Pages로 연다: <https://hwlee-dh.github.io/aleph-demo/>

빌드 단계가 없다. 저장소를 그대로 올리면 되고, 인터넷 없이 `index.html`을 브라우저로 열어도 된다.

```
index.html     들머리
slides/        발표 자료
demo/          데모 (준비 중)
tools/         QR 그림을 만드는 스크립트
assets/        폰트, 그림, 공통 스타일
```

## 발표 자료

| 조작 | 키 |
| --- | --- |
| 다음 | `→`, `Space`, `Enter`, 클릭 |
| 이전 | `←`, `Backspace`, 화면 왼쪽 끝 클릭 |
| 처음, 끝 | `Home`, `End` |
| 전체 화면 | `F` |

폰에서는 스와이프해서 넘긴다. 주소 끝의 `#장.단계`가 지금 자리다.

고칠 곳:

- `slides/steps.js`: 단계의 순서와 단계마다의 장면. 장면에는 화면에 놓이는 글, 상자, 막대, 화살표를 이름과 자리로 적는다. 이름이 같으면 단계가 바뀌어도 같은 것이라서 새 자리로 옮겨 간다. `seq`가 있는 단계는 누르면 여러 장면이 저절로 이어진다
- `slides/deck.js`: 장면을 화면에 놓고 넘긴다
- `slides/slides.css`: 모양과 움직임
- `slides/index.html`: 닫는 장. `data-show`에 적힌 이름이 단계에서 켜지면 보인다

## 폰트

Pretendard (SIL Open Font License 1.1). 라이선스는 `assets/fonts/pretendard-LICENSE.txt`.
