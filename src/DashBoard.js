import React from 'react';
import {Row,Col,Dropdown,Modal,Spinner} from "react-bootstrap";
import Context from "./Context.js";

export default class DashBoard extends React.Component{
    static contextType=Context;
    constructor(props){
        super(props);
        this.state={
            income:0,
            expenditure:0,
            modal:false
        }
    }
    dropdown=React.createRef();
    details=async(days,text)=>{
        this.setState({modal:true})
        try{
            let income=0;
            let expenditure=0;
            let d=new Date();
            d=d-(days*24*60*60*1000);
            let data=await fetch(`https://money-manager-backend-sa.herokuapp.com/get_income/${d}/0`,{
                method:"GET",
                headers: {
                    "authorization":window.localStorage.access_token
                }
            })
            if(data.status===500)
            {
                this.context.logout();
            }
            data=await data.json();
            data.data.forEach((d)=>{
                income=income+(+d.amount);
            });
            data=await fetch(`https://money-manager-backend-sa.herokuapp.com/get_expense/${d}/0/0/0`,{
                method:"GET",
                headers: {
                    "authorization":window.localStorage.access_token
                }
            })
            if(data.status===500)
            {
                this.context.logout();
            }
            data=await data.json();
            data.data.forEach((d)=>{
                expenditure=expenditure+(+d.amount);
            });

            this.setState({modal:false,income,expenditure});
            this.dropdown.current.innerText=text
        }
        catch(err){
            console.log(err);
        }

    }
    render(){
        return (
            <Col xs="12" md="6" className="mb-3">
                    <Row className="justify-content-center">
                    <Col xs="12" className="mb-3">
                        <Dropdown>
                            <Dropdown.Toggle ref={this.dropdown} id="dropdown-basic-1" className="header buton" variant="info">
                                Show Details of:
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="buton bg-cyan">
                                <Dropdown.Item href="#/action-1" onClick={()=>{this.details(7,"Last Week")}}>Last Week</Dropdown.Item>
                                <Dropdown.Item href="#/action-2" onClick={()=>{this.details(30,"Last Month")}}>Last Month</Dropdown.Item>
                                <Dropdown.Item href="#/action-3" onClick={()=>{this.details(365,"Last Year")}}>Last Year</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </Col>
                    <Col xs="11">
                    <Row className="justify-content-center">
                            <Col xs="12" className="tube mb-3 p-3 text-center">
                            <Row >
                                <Col xs="6">
                                    <Row className="p-1 justify-content-center">
                                    <Col xs="7" className="heading ">Total Income :</Col>
                                    <Col xs="5" className="text-light text-align-left"> Rs. {this.state.income}</Col>
                                    </Row>
                                </Col>
                                <Col xs="6">
                                    <Row className="p-1 justify-content-center">
                                    <Col xs="7" className="heading ">Total Expenditure :</Col>
                                    <Col xs="5" className="text-light text-align-left"> Rs. {this.state.expenditure}</Col>
                                    </Row>
                                </Col>
                            </Row>
                            
                            </Col>
                            <Modal show={this.state.modal} onHide={()=>{
                                this.setState({modal:false})
                            }} backdrop="static" className="text text-secondary">
                                <Modal.Header>Please Wait..<Spinner animation="border"></Spinner></Modal.Header>
                            </Modal>
                            
                        </Row>
                    </Col>
                    </Row>
            </Col>
        )
    }
}