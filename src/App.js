import './App.css';
import React from "react";
import {BrowserRouter,Route,NavLink, Redirect} from "react-router-dom";
import RegisterMail from "./register_mail.js";
import RegisterUser from "./register_user.js";
import Login from "./login.js";
import {Row,Col} from "react-bootstrap";
import Context from "./Context.js";
import Content from './Content';


class App extends React.Component{
username=React.createRef();
login=(access_token)=>{
    window.localStorage.setItem('access_token',access_token);

    this.forceUpdate();
    
}
  logout=()=>{
    window.localStorage.clear();
    this.forceUpdate();
  }
  verify=async()=>{
    try{
      
        const access_token=window.localStorage.access_token;
        let data=await fetch('https://money-manager-backend-sa.herokuapp.com/verify_token&get_user_details',{
            method:"GET",
            mode:"cors",
            headers:{
                'authorization':access_token
            }
        })
        data=await data.json();
        if(!data.data)
        {
          this.logout();
        }
        if(!window.localStorage.name)
        {
          window.localStorage.setItem('name',data.data.name);
          this.username.current.innerHTML=window.localStorage.name
          
        }
       
        
    }
    catch(err)
    {
      console.log(err);
      this.logout();
    }
}
componentDidMount(){
  if(window.localStorage.access_token)
    {
      this.verify();
    }

}
componentDidUpdate(){
  if(!window.localStorage.name && window.localStorage.access_token)
  {
    this.verify()
  }
}
  render(){
    
    
    return (
      <BrowserRouter>
          <Row className="nav-bar box-shadow-dark">
            <Col md="7" xs="12" className="text-align-left">
            <h3 className="heading">Money Manager</h3>
            </Col>
            <Col md="5" xs="12">
              <Row className="justify-content-end p-0">
              {
              window.localStorage.access_token
              ?
                <>
                <Col xs="6" md="5" className="m-0">
                  <div  className="box box-shadow-dark p-2 m-0 " ref={this.username}>
                    {window.localStorage.name}
                  </div>
                </Col>
                  
                  <Col xs="6" md="5" onClick={this.logout}>
                    <NavLink to="/register" className="nav-link buton p-2 m-0 ">
                      Logout
                    </NavLink>
                  </Col>
                </>
              :
              <>
                <Col xs="6" md="5">
                <NavLink to="/register" className="nav-link buton p-2 m-0">
                  Register
                </NavLink>
                </Col>
                <Col xs="6" md="5">
                  <NavLink to="/login" className="nav-link buton p-2 m-0">
                      Login
                  </NavLink>
                </Col>
              </>
            }
              </Row>
            </Col>
            
          </Row>
          <Row className="p-3">
            <Route exact path="/">
              {
                window.localStorage.access_token
                ?
                <Redirect to="/home"></Redirect>
                :
                <Redirect to="/register"></Redirect>
              }
              
            </Route>
            <Route exact path="/register" component={RegisterMail}></Route>
            <Route exact path="/register/:encrypted" component={RegisterUser}></Route>
            <Context.Provider value={
              {
                login:this.login,
                logout:this.logout
              }
            }>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/home" component={Content}/>
            </Context.Provider>
          </Row>
          {
            !window.localStorage.access_token &&
            <Row className="justify-content-center p-2 p-md-5 ">
              <Col xs="12">
                <Row className="justify-content-center p-2 p-md-5  mb-5">
                  <Col xs="12" md="8">
                    <h3 className="heading">
                    Dashboard
                    </h3>
                    <p className="box box-shadow-dark img text-center  width-100">
                      Get details of your monthly ,weekly and yearly details of income and expenditure alongside with the details of money spent on different categories like food,fuel,movie,etc and divisions like office and personal.These details are reflected on a pie chart to give you better visual representation of your expenditures.
                    </p>
                   
                  </Col>
                  <Col xs="12" md="5" className="dashboard box-shadow-dark">

                  </Col>

                </Row>
                <Row className="justify-content-center p-2 p-md-5  mb-5">
                
                  <Col xs="12" md="8" className="text-align-right">
                    <h3 className="heading">
                    Income History
                    </h3>
                    <p className="box box-shadow-dark img text-center  width-100">
                      Get details of your Incomes on the Income History page .Apply filters to get income data of specific dates.Update your income details within 12 hours of adding.
                    </p>
                   
                  </Col>
                  <Col xs="12" md="5" className="income box-shadow-dark"></Col>
                </Row>
                <Row className="justify-content-center p-2 p-md-5  mb-5">
                  <Col xs="12" md="8" >
                    <h3 className="heading">
                    Expenditure History
                    </h3>
                    <p className="box box-shadow-dark img text-center width-100">
                    Get details of your Expenses on the Expenditure History page .Apply filters based on categories ,dates and divisions to get expenditure data of specific dates.Update your Expenditure details within 12 hours of adding.
                    </p>
                   
                  </Col>
                  <Col xs="12" md="5" className="expenditure box-shadow-dark">

                  </Col>

                </Row>
              </Col>

            </Row>
          }
          
        
          
          
      </BrowserRouter>
    )
  }
}

export default App;
