import CommonButton from '@/components/CommonButton'
import { ProjectWrap, Wrap, Title, Footer, FooterBtn } from './style'
import { useTranslation } from 'react-i18next'

const ProjectType = (props: {
  projectType: number
  onChange(val: number): void
  onCancel(): void
}) => {
  const [t, { language: isRefresh }] = useTranslation()
  const projectList = [
    {
      type: 1,
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/sprint/sprint_guide.png',
      title: '冲刺项目',
      msg: '适用于复杂程度高、要求新颖的紧急项目',
    },
    {
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/iteration/iterat_guide.png',
      type: 2,
      title: '迭代项目',
      msg: '适用于稳定的低风险、需求明确不参与过程的项目',
    },
  ]
  const onChange = (index: number) => {
    props.onChange(index + 1)
  }
  return (
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
        {projectList.map((i: any, index: number) => (
          <Wrap
            type={props.projectType}
            hover={i.type}
            key={i.type}
            onClick={() => onChange(index)}
          >
            <img
              style={{
                width: '100%',
              }}
              src={isRefresh === 'zh' ? i.img : i.en_img}
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
          取消
        </CommonButton>
      </FooterBtn>
    </ProjectWrap>
  )
}

export default ProjectType
