import CommonButton from '@/components/CommonButton'
import {
  ProjectWrap,
  HeaderWrap,
  Wrap,
  Title,
  Footer,
  FooterBtn,
  IconFontWrap,
} from './style'
import { useTranslation } from 'react-i18next'

const ProjectType = (props: {
  projectType: number
  title: string
  onChange(val: number): void
  onCancel(): void
}) => {
  const [t, { language: isRefresh }] = useTranslation()
  const projectList = [
    {
      type: 2,
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/sprint/sprint_guide.png',
      title: t('sprint_project'),
      msg: t('Msg1'),
    },
    {
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/iteration/iterat_guide.png',
      type: 1,
      title:t('iteration_project'),
      msg: t('Msg2'),
    },
  ]
  const onChange = (index: number) => {
    props.onChange(index)
  }
  return (
    <div>
      <HeaderWrap>
        <span className="title">{props.title}</span>
        <IconFontWrap onClick={props.onCancel} type="close" />
      </HeaderWrap>
      <ProjectWrap>
        <Title>{t('select_project_type')}</Title>
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginBottom: '134px',
            padding: '0 72px',
          }}
        >
          {projectList.map((i: any) => (
            <Wrap
              type={props.projectType}
              hover={i.type}
              key={i.type}
              onClick={() => onChange(i.type)}
            >
              <img
                style={{
                  width: '100%',
                }}
                src={i.img}
                alt=""
              />
              <Footer>
                <div className="title">{i.title}</div>
                <div className="msg">{i.msg}</div>
              </Footer>
            </Wrap>
          ))}
        </div>
        <FooterBtn>
          <CommonButton onClick={props.onCancel} type="primary">
            {t('cancel')}
          </CommonButton>
        </FooterBtn>
      </ProjectWrap>
    </div>
  )
}

export default ProjectType
