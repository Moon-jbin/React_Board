class HeaderComponent extends React.Component {
  render(){
    return(
      <>
        <header id="header">
          <div className="title">
             <span>Simple</span>  <strong>REACT</strong> <span>TODO LIST</span> 
          </div>
        </header>
      </>
    )
  }
}

class MainComponent extends React.Component {
  constructor(props){
    super(props)
    this.state={
      txt: [],  // 넣은 데이터를 담을 용
      content:'',   // php에 집어넣기 용
      no:1,
      regdate: new Date().getFullYear() + "-"+ (new Date().getMonth()+1) + "-" + new Date().getDate()
    }
  }

  deleteFn = (data, numData) => {
    return(
      this.setState({txt: data}),
      this.setState({no: numData })
    )
  }
  updateFn = (data) => {
    return(
      this.setState({txt: data})
    )
  }

  getData = () => {
    axios({
      url:'./PHP/select.php',
      method:'GET'
    })
    .then((result)=>{
      this.setState({txt: result.data});
      this.setState({no: result.data.length+1});
      // console.log(this.state.no);
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  componentDidMount(){
    this.getData();
    // console.log("componentDidMunt")
  }



  onChangeFn = (e) => {
    e.preventDefault();
    this.setState({ content: e.target.value })
  }

  onClickFn = (e) => {
    e.preventDefault();
    const {content, no, regdate} = this.state;

    let formData = new FormData();
    formData.append('content', content);
    formData.append('no', no);
    formData.append('regdate', regdate);

    axios({
      url:'./PHP/insert.php',
      method:"POST",
      data: formData
    })
    .then((result)=>{
      this.setState({txt: result.data})
    })
    .catch((err)=>{
      console.log(err)
    })

    this.setState({no : this.state.no + 1});
    this.setState({content: ''});
  }
  render(){
    return(
      <>
        <main id="main">
          <div className="container">
            <form action="./PHP/insert.php" method="post">
              <div className="input-box">
                <input type="text" 
                name="todoInput" id="todoInput" 
                placeholder="계획을 작성해주세요."
                value={this.state.content}
                onChange={this.onChangeFn}
                />
                <button type="submit" onClick={this.onClickFn}>ADD</button>
              </div>
            </form>
            <ContentComponent txt={this.state.txt} deleteFn={this.deleteFn} updateFn={this.updateFn} />
          </div>
        </main>
      </>
    )
  }
}

class ContentComponent extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputTxt:''
    }
  }

  onClickDeleteFn = (e)=> {
    e.preventDefault();

    const {deleteFn} = this.props;

    let deleteId = e.target.id;
    let deleteData = new FormData();
    deleteData.append("deleteData", deleteId);

    axios({
      url:"./PHP/delete.php",
      method:"POST",
      data: deleteData
    })
    .then((result)=>{
      deleteFn(result.data, result.data.length+1)

    })
    .catch((err)=>{
      console.log(err)
    })

  }

  onClickUpdateFn = (e) => {
    e.preventDefault();
    let updateBox = $(e.target).parent().parent() // update-box
    updateBox.prev().addClass("add-input-content")
    let itemContent = $(e.target).parent().parent().prev().prev(); // item-content
    itemContent.css("display","none");
    
    // console.log($(e.target).parent().prev())

    // chk 버튼 addClass
    $(e.target).parent().prev().addClass('addChk');
    // update 버튼 addClass
    $(e.target).parent().addClass('add-update');

 

    const inputFetchData = $(e.target).parent().parent().prev().prev()[0].innerText;
    let inputUpdate = $(e.target).parent().parent().prev().children();
    // input태그 value 값을 넣어줬다.
    inputUpdate.val(inputFetchData);
  }

  onClickChkFn = (e) => {
    e.preventDefault();

    //input-update
    // console.log($(e.target).parent().parent().prev().children())
    let updateValue = $(e.target).parent().parent().prev().children().val();
    let updateId = e.target.id;

    let updateData = new FormData();
    updateData.append("updateValue", updateValue)
    updateData.append("updateId", updateId)

    const {updateFn} = this.props;
    // axios post로 id값 보내고 결과값 result.data로 받아오기
    axios({
      url: "./PHP/updateData.php",
      method: "POST",
      data: updateData
    })
    .then((result)=>{
      console.log(result.data)
      updateFn(result.data)
      // const inputFetchData = result.data[0].내용;
      // 부모 컴포넌트에서 state 움직일 함수 정의 한후 여기서 state 값을 변경하자.

    })
    .catch((err)=>{
      console.log(err)
    })

    // chk
    $(e.target).parent().removeClass("addChk");
    // update
    $(e.target).parent().next().removeClass("add-update");

    let updateBox = $(e.target).parent().parent() // update-box
    // updateBox.before('<span class="input-content"><input type="text" class="input-update"/></span>');
    updateBox.prev().removeClass("add-input-content")
    let itemContent = $(e.target).parent().parent().prev().prev(); // item-content
    itemContent.css("display","block");
  }



  onChangeUpdateFn = (e) => {
    e.preventDefault();
    this.setState({inputTxt:e.target.value})
  }
  
  render(){
    const {txt} = this.props;
    const txtList = txt.map((item)=>{
      
      return(
        <li key={item.번호} className="list-item">
          <span className="item-content">{item.내용}</span>
          <span className="input-content">
            <input type="text" value={this.state.inputTxt} onChange={this.onChangeUpdateFn} className="input-update"/>
          </span>          
          <div className="update-box">
            <span className="chk">
              <button id={item.번호} type="submit" className="chk-btn" onClick={this.onClickChkFn}>확인</button>
            </span>
            <span className="update">
              <button id={item.번호} type="submit" onClick={this.onClickUpdateFn} className="update-btn">
                수정
              </button>
            </span>
            <span className="delete">
              <button id={item.번호} type="submit" className="delete-btn" onClick={this.onClickDeleteFn}>
                삭제
              </button>
            </span>               
          </div>
        </li>
      )
    })
    // 이제 여기에 map 함수로 불러올것
    return(
      <>
        <ul className="content">
          {txtList}
        </ul>
      </>
    )
  }
}


class WrapComponent extends React.Component{
  render(){
    return(
      <>
        <div id="wrap">
          <HeaderComponent/>
          <MainComponent/>
        </div>
      </>
    )
  }
}

ReactDOM.render(
  <WrapComponent/>,
  document.querySelector("#root")
)