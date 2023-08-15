// 登陆国际化
const language = [
  {
    id: 0,
    name: '简体中文',
    salutatory: '欢迎登录IFUN OA',
    remark: '提示：忘记密码、动态口令请联系管理员',
    title: '登录',
    user: '请输入手机号或邮箱',
    password: '请输入登录密码',
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
    userWarning: '请输入手机号或邮箱',
    passwordWarning: '请输入密码',
    emailWarning: '请输入邮箱',
    codeWarning: '请输入动态口令',
    userError: '手机号或邮箱不正确',
    passwordError: '密码不正确',
    codeError: '动态口令不正确',
    authorizedLogin: '授权登录将获取以下权限',
    AgileLogin: '欢迎使用 IFUN Agile',
    title1: '新一代AI研发敏捷协同神器',
    title2: '让您的研发工作更轻松，更高效，更有价值！',
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
    userWarning: 'Enter phone number or email',
    passwordWarning: 'Enter input a password',
    codeWarning: 'Enter the dynamic password',
    userError: 'Incorrect phone number or email ',
    passwordError: 'Incorrect password',
    codeError: 'Incorrect dynamic password',
    authorizedLogin: 'Authorizing login will obtain the following permissions',
    AgileLogin: 'Welcome to IFUN Agile',
    title1: 'A new generation of AI develops agile synergies',
    title2:
      'Make your research and development work easier, more efficient and more valuable!',
  },
]
const reducer = (prevState: LanguageMode, action: { type: number }) => {
  let newCount: any = { ...prevState }

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
  agile: {
    logo: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/sso/iFUNAgileLogo.png',
    name: 'IFUN Agile',
    loginFormTitle: 'AgileLogin',
  },
}

export { language, InputMode, reducer, installState, systemData }
