import CommonModal from '../CommonModal'

interface AddTeamModalProps {
  isVisible: boolean
}

const AddTeamModal = (props: AddTeamModalProps) => {
  return (
    <CommonModal isVisible={props.isVisible}>
      <div>AddTeamModal</div>
    </CommonModal>
  )
}

export default AddTeamModal
