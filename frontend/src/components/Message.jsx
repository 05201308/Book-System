// Shows an error (red) or success (green) message. Shows nothing if text is empty.
function Message(props) {
  if (!props.text) {
    return null;
  }
  return <p className={'message ' + props.type}>{props.text}</p>;
}

export default Message;
