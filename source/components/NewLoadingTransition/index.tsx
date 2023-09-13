const NewLoadingTransition = (props: any) => {
  return (
    <img
      className="spinImg"
      src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/newLoading.gif"
      style={{
        width: props.size ? props.size : 80,
        height: props.size ? props.size : 80,
      }}
      alt=""
    />
  )
}

export default NewLoadingTransition
