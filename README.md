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

### 图标加文字操作

使用公共样式 Y:\project\敏捷系统\scrum\source\components\StyleCommon.ts ---> CloseWrap
并且需要使用 Y:\project\敏捷系统\scrum\source\components\ScreenMinHover ---> ScreenMinHover 组件

### 表格分页

Y:\project\敏捷系统\scrum\source\components\TablePagination ---> TablePagination

### 带有拖拽的表格

Y:\project\敏捷系统\scrum\source\components\ResizeTable

### 搜索条件中带有左侧快捷操作时间组件

Y:\project\敏捷系统\scrum\source\components\RangePicker.tsx

### 大页面的无权限组件

Y:\project\敏捷系统\scrum\source\components\PermissionWrap.tsx

### 搜索组件

例：项目列表搜索
Y:\project\敏捷系统\scrum\source\components\InputSearch.tsx

### 暂无数据组件

Y:\project\敏捷系统\scrum\source\components\NoData.tsx

### 表格自定义过滤组件

Y:\project\敏捷系统\scrum\source\components\TableFilter.tsx

### 快捷修改

例：需求列表快捷修改
Y:\project\敏捷系统\scrum\source\components\TableQuickEdit.tsx

### 上传附件组件

Y:\project\敏捷系统\scrum\source\components\UploadAttach.tsx

### 头像组件

Y:\project\敏捷系统\scrum\source\components\CommonUserAvatar.tsx

### 删除确认弹窗

Y:\project\敏捷系统\scrum\source\components\DeleteConfirm.tsx

### 公用的弹窗组件

Y:\project\敏捷系统\scrum\source\components\CommonModal.tsx

### 公用按钮组件

Y:\project\敏捷系统\scrum\source\components\CommonButton.tsx

### 设置组件

例：需求列表右侧设置下拉
Y:\project\敏捷系统\scrum\source\components\SetShowField

### 自定义下拉组件

Y:\project\敏捷系统\scrum\source\components\CustomSelect

### 三个点下拉操作组件

Y:\project\敏捷系统\scrum\source\components\MoreDropdown.tsx

### dropdown 下拉组件

Y:\project\敏捷系统\scrum\source\components\DropDownMenu.tsx

### 带有侧边栏折叠及拖拽

Y:\project\敏捷系统\scrum\source\components\HasSideCommonLayout

### 视图管理

D:\Project\敏捷\scrum\store\view\index.ts

视图中筛选字段调用 sotre 的 onTapSearchChoose 方法 1.传参内容为
示例，根据 Tablefilter 组件

```json
{
  "tag": null,
  "status": null,
  "category": null,
  "priority": null,
  "schedule": null,
  "user_name": null,
  "created_at": null,
  "iterate_name": null,
  "users_copysend_name": null
}
```

searchChoose 该值为需要给到后端的字段值。 2.筛选字段值为 store 中的字段，要清空，可以在组件离开或手动清除。

```js
useEffect(() => {
  init()
  return () => {
    dispatch(onTapSearchChoose({}))
  }
}, [])
```

### 成员选择弹窗

D:\Project\敏捷\scrum\source\components\NewAddUserModal\NewAddUserModalForTandD\NewAddUserModalForTandD.tsx

```js
<NewAddUserModalForTandD
  title={t('formWork.addUser')}
  state={2}
  isVisible={isVisible}
  onConfirm={onConfirm}
  onClose={() => setIsVisible(false)}
/>
```
