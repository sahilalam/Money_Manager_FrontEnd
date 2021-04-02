import React from "react";
import {Row,Col,Form,Modal,Spinner,Button,Navbar,Nav,Tab,Tabs} from "react-bootstrap";
import {BrowserRouter, Redirect,Route} from "react-router-dom";
import createBody from "./creatBody.js";
import Context from "./Context.js";
import DashBoard from "./DashBoard.js";
import IncomeHistory from "./IncomeHistory.js";
import ExpenditureHistory from "./EpenditureHistory.js";

export default class Content extends React.Component{
    static contextType=Context;
    incomeAmount=React.createRef();
    incomeDescription=React.createRef();
    incomeDate=React.createRef();
    expenditureDate=React.createRef();
    expenditureAmount=React.createRef();
    expenditureDescription=React.createRef();
    division=React.createRef();
    category=React.createRef();
    constructor(props)
    {
        super(props);
        this.state={
            modal:false,
            form:false,
            spinner:false,
            message:"",
            dashboard:true,
            historyincome:false
        }
    }
    addIncome=async(event)=>{
        event.preventDefault();
        this.setState({modal:true,spinner:true,form:false});
        try{
            let details={
                amount:this.incomeAmount.current.value,
                description:this.incomeDescription.current.value,
                date:this.incomeDate.current.value
            }
            let body=createBody(details);
            let data=await fetch('https://money-manager-backend-sa.herokuapp.com/add_income',{
                method:'POST',
                body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "authorization":window.localStorage.access_token
                }
            });
            if(data.status===500)
            {
                this.context.logout();
            }
            data=await data.json();
            this.setState({modal:true,spinner:false,form:false,message:data.message});
        }
        catch(err)
        {
            console.log(err);
        }
    }
    addExpenditure=async(event)=>{
        event.preventDefault();
        this.setState({modal:true,spinner:true,form:false});
        try{
            let details={
                amount:this.expenditureAmount.current.value,
                description:this.expenditureDescription.current.value,
                date:this.expenditureDate.current.value,
                division:this.division.current.value,
                category:this.category.current.value
            }
            let body=createBody(details);
            let data=await fetch('https://money-manager-backend-sa.herokuapp.com/add_expense',{
                method:'POST',
                body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "authorization":window.localStorage.access_token
                }
            });
            if(data.status===500)
            {
                this.context.logout();
            }
            data=await data.json();
            this.setState({modal:true,spinner:false,form:false,message:data.message});

        }
        catch(err)
        {
            console.log(err);
        }

    }
    dashBoard=()=>{
        this.setState({dashboard:true,historyincome:false});
    }
    incomeHistory=()=>{
        this.setState({dashboard:false,historyincome:true});
    }
    expenditureHistory=()=>{
        this.setState({dashboard:false,historyincome:false});
    }
    render()
    {
        return (
            window.localStorage.access_token
            ?
            <Col xs="12" className="p-0">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="stick bg-dark">
                <Navbar.Brand href="#home">Menu</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="#dashboard" onClick={this.dashBoard}>DashBoard</Nav.Link>
                    <Nav.Link href="#incomehistory" onClick={this.incomeHistory}>Income History</Nav.Link>
                    <Nav.Link href="#expenditurehistory" onClick={this.expenditureHistory}>Expenditure History</Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link href="#addnew" className="buton" onClick={()=>{
                        this.setState({modal:true,form:true,spinner:false})
                    }}>Add New</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
                <Row className="justify-content-center p-3">
                    <Modal show={this.state.modal} onHide={()=>{
                        this.setState({modal:false})
                    }} backdrop="static">
                        {
                            this.state.form
                            ?
                            <Modal.Header closeButton className="text text-secondary">
                            <Tabs defaultActiveKey="Form">
                                <Tab.Container eventKey="Income" title="Income">
                                    <Row className="p-3">
                                        <Col xs="12">
                                            <Form onSubmit={this.addIncome} className="">
                                            <Form.Control ref={this.incomeAmount} type="number" required={true} placeholder="Enter Income Amount.." className="mb-3 input" />
                                            <Form.Control ref={this.incomeDescription} as="textarea" required={true} placeholder="Enter Income Description.." className="mb-3 input" />
                                            <input type="datetime-local" required={true} ref={this.incomeDate} className="form-control mb-2"/>
                                            <button type="submit" className="buton mb-2 header">Submit</button>
                                            </Form>
                                            
                                        </Col>
                                    </Row>
                                </Tab.Container>
                                <Tab eventKey="Expenditure" title="Expenditure">
                                    <Row className="p-3">
                                        <Col xs="12">
                                        <Form onSubmit={this.addExpenditure}>
                                        <Form.Control ref={this.expenditureAmount} type="number" required={true} placeholder="Enter Expenditure Amount.." className="mb-3 input" />
                                        <Form.Control ref={this.expenditureDescription} type="text" as="textarea" required={true} placeholder="Enter Expenditure Description.." className="mb-3 input" />
                                        Division
                                        <select name="divsion" ref={this.division} required={true} className="form-control">
                                        <option value="Office">Office</option>
                                        <option value="Personal">Personal</option>
                                        </select>
                                        Category
                                        <select ref={this.category} required={true} name="category" className="form-control mb-2">
                                            <option value="Fuel">Fuel</option>
                                            <option value="Medical">Medical</option>
                                            <option value="Movie">Movie</option>
                                            <option value="Food">Food</option>
                                            <option value="Loan">Loan</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <input type="datetime-local" required={true} ref={this.expenditureDate} className="form-control mb-2"/>
                                        <button type="submit" className="buton mb-2 header">Submit</button>
                                    </Form>
                                        </Col>
                                    </Row>
                                </Tab>
                            </Tabs>
                            </Modal.Header>
                            :
                                this.state.spinner
                                ?
                                    <Modal.Header>
                                        Please Wait..<Spinner animation="border" />
                                    </Modal.Header>
                                :
                                    <Modal.Header >
                                        {this.state.message}
                                        <button className="btn btn-info" onClick={()=>{
                                            window.location.reload();
                                        }}>Close</button>
                                    </Modal.Header>

                        }
                    </Modal>
                    {
                        this.state.dashboard
                        ?
                        <DashBoard />
                        :
                            this.state.historyincome
                            ?
                            <IncomeHistory />
                            :
                            <ExpenditureHistory />

                    }
                    
                </Row >
            </Col>
            :
            <Redirect to="/register"></Redirect>
        )
    }
}