---
layout: default
title: Home
nav_order: 1
description: "devNmin.github.io"
permalink: /
---

# Welcome to devNmin.github.io
{: .fs-8 }

Here is my Today I Learned
{: .fs-6 .fw-300 }

[Get started now](#getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](https://github.com/just-the-docs/just-the-docs){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Getting started

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```
---


### Dependencies

Just the Docs is built for [Jekyll](https://jekyllrb.com), a static site generator. View the [quick start guide](https://jekyllrb.com/docs/) for more information. Just the Docs requires no special plugins and can run on GitHub Pages' standard Jekyll compiler. The [Jekyll SEO Tag plugin](https://github.com/jekyll/jekyll-seo-tag) is included by default (no need to run any special installation) to inject SEO and open graph metadata on docs pages. For information on how to configure SEO and open graph metadata visit the [Jekyll SEO Tag usage guide](https://jekyll.github.io/jekyll-seo-tag/usage/).

---

## To do list
```markdown
1. Fast API 찾아보기 
2. 

```

# 정리용

Vue.js

사용자 인터페이스를 만들기 위한 진보적인 자바스크립트 프레임워크
SPA(single Page Application)를 지원
-현재 페이지를 동적으로 렌더링함
-단일 페이지로 구성되며 서버로부터 최초에만 페이지

CSR
client Side Rendering
서버에서 화면을 구성하는 SSR <-> 클라이언트에서 화면을 구성
최초 요청시 각종 리소스를 응답받고 '이후에' 클라이언트에서 필요한 데이터만 요청해서
JS로 DOM(document Object Model)을 렌더링하는 방식
처음에만 뼈대만 받고 브라우저에서 동적으로 DOM을 그림
SPA가 사용하는 렌더링 방식
장점
서버와 클라이언트 트래픽 감소
사용자 경험 향상

```vue
<h2>h2태그입니다</h2>
<div id="app">
	{{message}}
</div>

const app = new Vue({
	el: '#app',
	data: {
	message:'안녕하세요 Vue!'
}
}) 

```

