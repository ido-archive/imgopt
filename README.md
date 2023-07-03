# imgopt
Image optimization with imagemin (sharp/webp)

## 📍기본정보
![image](https://github.com/ido-archive/imgopt/assets/114931086/63f760fa-41b1-492f-aa76-6581f22ec103)
이미지 파일(jpg, png) 용량을 줄여 페이지 로딩 속도를 개선합니다.
imgopt.mjs 와 package.json 이 필요합니다.

## 📍사전 설치
*package.json이 있는 폴더에서 실행
```
npm install imagemin
npm install imagemin-sharp
npm install imagemin-webp
```

## 📍실행
### ✨ 이미지 최적화
```
npm run build:sharp {imgs 폴더 내 파일명} 실행 시 해당 폴더의 이미지가 압축되어 덮어쓰기로 저장됩니다.
```
예시)
npm run build:sharp common

### ✨ 포맷 변경 (jpg,png to WebP)
```
npm run build:webp {imgs 폴더 내 파일명} 실행 시 해당 폴더에 webp 폴더가 생성됩니다.
```
예시)
npm run build:webp common

실행 시 생성되는 폴더 경로
imgs/common/webp
imgs/common/banner/webp
imgs/common/visual/webp
...
