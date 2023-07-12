// 登陆国际化
const language = [
  {
    id: 0,
    name: '简体中文',
    salutatory: '欢迎登录IFUN OA',
    remark: '提示：忘记密码、动态口令请联系管理员',
    title: '登录',
    user: '请输入手机或邮箱或工号',
    password: '请输入密码',
    code: '请输入动态口令',
    login: '登录',
    mode1: '验证码',
    mode2: '请输入动态口令',
    operationNotes: '使用Google Authenticaor，扫描二维码绑定账号',
    operationManual: '点击《阅读操作手册》',
    bigChar: '大写键盘已经开启',
    OALogin: '登录IFUN OA',
    useOALogin: '使用IFUN OA账号登录',
    readed: '已阅读并同意IFUN OA账户',
    agreement: '《用户协议》',
    privacy: '《隐私政策》',
    getPermission: '用以该应用获得以下权限',
    publicInformation: '访问您的公开信息(昵称、头像)',
    book: '获取您的企业组织通讯录',
    and: '和',
    auth: '授权将获取你以下权限信息：',
    oaAuth: '授权登录',
    userWarning: '请输入手机或邮箱或工号',
    passwordWarning: '请输入密码',
    emailWarning: '请输入邮箱',
    codeWarning: '请输入动态口令',
    userError: '手机或邮箱或工号不正确',
    passwordError: '密码不正确',
    codeError: '动态口令不正确',
    authorizedLogin: '授权登录将获取以下权限',
    AgileLogin: '登录IFUN Agile',
    CarouselTitle1: '专业的项目协作工具',
    CarouselTitle2: 'IFUN Agile 智能研发管理',
    CarouselTitle3: '效能洞察',
    CarouselDesc1:
      '提供项目管理、需求管理、缺陷管理、任务管理、Kanban管理、版本管理等丰富的项目管理功能及效能数据统计。',
    CarouselDesc2:
      '为研发过程中提供标准化管理和沉淀工具，方便测试人员对用例进行标准化管理和沉淀，同时实现需求、缺陷、用例关联，告别测试用例重复撰写、进展反馈不同步的问题。',
    CarouselDesc3:
      '交付过程观测和研发效能度量分析工具，提供丰富的度量图表覆盖软件交付全生命周期，在交付过程中提前暴露交付风险，保障交付效率和质量，多维度可视化分析团队效能状态、及时发现问题。',
  },
  {
    id: 1,
    name: 'English',
    salutatory: 'Welcome to IFUN OA',
    remark:
      'Tip: Forget the password, dynamic password please contact the administrator',
    title: 'Login Form',
    user: 'Username',
    password: 'Password',
    code: 'CaptchaCode',
    login: ' Login ',
    mode1: 'verification code',
    mode2: 'Google Captcha',
    operationNotes:
      'Use Google Authenticaor and scan the QR code to bind your account',
    operationManual: 'Click  Read operation Manual',
    bigChar: 'Uppercase keyboard is turned on',
    OALogin: 'Login as the IFUN OA account',
    useOALogin: 'Login as user IFUN OA',
    readed: 'You have read and agree to the IFUN OA Account',
    agreement: ' User Agreement',
    privacy: ' Privacy Policy',
    getPermission: ' Obtain the following permissions with this application',
    publicInformation: 'Access your public information (nickname, avatar)',
    book: 'Get your corporate organization directory',
    and: ' and',
    auth: 'Authorization will obtain the following information about your permissions：',
    oaAuth: 'Authorized Login',
    userWarning: 'Enter phone number or email or job number',
    passwordWarning: 'Enter input a password',
    codeWarning: 'Enter the dynamic password',
    userError: 'Incorrect phone number or email or job number',
    passwordError: 'Incorrect password',
    codeError: 'Incorrect dynamic password',
    authorizedLogin: 'Authorizing login will obtain the following permissions',
    AgileLogin: 'Login as the IFUN Agile account',
    CarouselTitle1: 'Professional project collaboration tools',
    CarouselTitle2: 'IFUN Agile Intelligent R&D management',
    CarouselTitle3: 'Performance insight',
    CarouselDesc1:
      'Provide project management, requirements management, defect management, task management, Kanban management, version management and other rich project management functions and performance data statistics.',
    CarouselDesc2:
      'Provide standardized management and precipitation tools for the research and development process, which is convenient for testers to standardize management and precipitation of use cases, and realize the association of requirements, defects and use cases, and bid farewell to the problems of repeated writing of test cases and asynchronous progress feedback.',
    CarouselDesc3:
      'Delivery process observation and development of performance measurement analysis tools, providing a wealth of measurement charts covering the entire life cycle of software delivery, in the delivery process to expose delivery risks in advance, ensure delivery efficiency and quality, multi-dimensional visual analysis of team performance status, timely detection of problems.',
  },
]
const reducer = (prevState: LanguageMode, action: { type: number }) => {
  let newCount = { ...prevState }

  switch (action.type) {
    case 0:
      localStorage.languageMode = 0
      newCount = language[0]
      return newCount
    case 1:
      localStorage.languageMode = 1
      newCount = language[1]
      return newCount
    case 2:
      localStorage.languageMode = 2
      newCount = language[2]
      return newCount
    case 3:
      localStorage.languageMode = 3
      newCount = language[3]
      return newCount
    default:
      return prevState
  }
}
const installState = localStorage.languageMode
  ? language[localStorage.languageMode]
  : language[0]
export type TForm = {
  username?: string
  password?: string
  code?: any
  captchaId?: any
  [key: string]: any
}
export type LanguageMode = {
  id: number
  name: string
  title: string
  user: string
  password: string
  code: string
  login: string
  mode1: string
  mode2: string
  salutatory: string
  remark: string
  operationNotes: string
  operationManual: string
  bigChar: string
  codeWarning: string
  passwordWarning: string
  userWarning: string
  codeError: string
  passwordError: string
  userError: string
  OALogin: string
  useOALogin: string
  readed: string
  agreement: string
  privacy: string
  getPermission: string
  publicInformation: string
  book: string
  and: string
  auth: string
  oaAuth: string
  CarouselTitle1: string
  CarouselTitle2: string
  CarouselTitle3: string
  CarouselDesc1: string
  CarouselDesc2: string
  CarouselDesc3: string
}
enum InputMode {
  NORMAL,
  LOCK,
  CODE,
}

const systemData: any = {
  oa: {
    logo: '/sso/logo.svg',
    logoNamePic: '/sso/IFUN_OA.svg',
    loginFormTitle: 'OALogin',
  },
  meeting: {
    logo: '/sso/iFUNMeetingLogo.svg',
    name: 'IFUN Meeting',
  },
  mail: {
    logo: '/sso/iFUNMailLogo.svg',
    name: 'IFUN Mail',
  },
  agile: {
    logo: '/sso/iFUNAgileLogo.svg',
    name: 'IFUN Agile',
    loginFormTitle: 'AgileLogin',
  },
}

export { language, InputMode, reducer, installState, systemData }
