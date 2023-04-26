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

###### 检测项目中的中文

```sh
npm run findCN
```

输出

```sh
PS D:\miaoyu\projects\scrum> npm run findCN

> @jihe/template-react@2.1.0 findCN
> npx @samuel.miao/findcn

开始检测包含文件的中文...
脚本运行的路径:D:\miaoyu\projects\scrum
👉️ 文件包含中文：D:\miaoyu\projects\scrum\socket.js
👉️ 文件包含中文：D:\miaoyu\projects\scrum\source\components\GlobalStyle.tsx
👉️ 文件包含中文：D:\miaoyu\projects\scrum\source\components\ErrorBoundary.tsx
👉️ 文件包含中文：D:\miaoyu\projects\scrum\source\components\Shape.tsx
```

###### 自动生成国际化资源

添加文件`script\translate\zhArr.js`

```js
// 数组中天剑要翻译的中文
const zhArr = ['你好', '中国制造']

module.exports = zhArr
```

然后执行命令

```shell
npm run tran
```

输出

```js
{
  objZh: { hello: '你好', made_in_China: '中国制造' },
  objEn: { hello: 'Hello', made_in_China: 'Made in China' }
}
```

### 字重

字重不要用`font-weight`，使用字体样式

### 全局字体样式

```css
font-family: SiYuanRegular;
```

### 加粗字体样式

遇到需要加粗的文字，使用`SiYuanMedium`字体样式

```css
font-family: SiYuanMedium;
```

### 主题 0-是白色 1-是黑色

在 store 中获取

```js
// \scrum\store\global.ts

theme
```

在浏览器缓存中获取

```js
localStorage.getItem('theme')
```

颜色配置文件

```js
// scrum\source\components\GlobalStyle.tsx
```

颜色配置文件命名

<!-- 例： Light/Neutral/N6-D1  命名：--neutral-n6-d1 -->

### 公司权限

在 store 中获取

```js
// \scrum\store\user.ts

userInfo.company_permissions
```

使用 identity：权限唯一标识(b/story/update)
getIsPermission(userInfo.company_permissions,identity)

### 项目权限

在 store 中获取

```js
// \scrum\store\project.ts

projectInfo.projectPermissions
```

权限组使用：group_name 值进行匹配
其他权限：getIsPermission(projectInfo.projectPermissions,identity)
特别处理：附件上传和附件下载使用 name 值匹配

### 项目下拉配置

在 store 中获取

```js
// \scrum\store\project.ts

projectInfoValues
```
