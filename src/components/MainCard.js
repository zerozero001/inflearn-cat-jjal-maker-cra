const MainCard = (props) => {
  const headtIcon = props.heartClicked === true ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img src={props.image} alt="고양이" width="400" />
      <button onClick={props.onHeartClick}>{headtIcon}</button>
    </div>
  );
};

export default MainCard;
