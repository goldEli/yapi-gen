# 敏捷开发

### 国际化

在 store 中获取

```js
// \scrum\store\global.ts

language
```

在浏览器缓存中获取

```js
localStorage.getItem('language') || 'zh'
```

### 字重

字重不要用`font-weight`，请使用字体样式

##### 全局字体

```css
font-family: SiYuanRegular;
```

##### 加粗字体

遇到需要加粗的文字，请使用字体样式

```css
font-family: SiYuanMedium;
```
