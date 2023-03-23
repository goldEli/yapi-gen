import spingImg from '/newLoading.gif'

const NewLoadingTransition = (props: any) => {
  return (
    <img
      src={spingImg}
      style={{
        width: props.size ? props.size : 80,
        height: props.size ? props.size : 80,
      }}
      alt=""
    />
  )
}

export default NewLoadingTransition
