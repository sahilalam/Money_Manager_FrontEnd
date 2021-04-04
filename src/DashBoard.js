import React from 'react';
import {Row,Col,Dropdown,Modal,Spinner} from "react-bootstrap";
import Context from "./Context.js";
import { PieChart } from 'react-minimal-pie-chart';

export default class DashBoard extends React.Component{
    static contextType=Context;
    weekly=React.createRef();
    constructor(props){
        super(props);
        this.state={
            income:0,
            expenditure:0,
            modal:false,
            personal:60,
            office:40,
            fuel:0,
            medical:0,
            movie:0,
            food:0,
            loan:0,
            other:0

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
            let personal=0;
            let office=0;
            let fuel=0;
            let medical=0;
            let movie=0;
            let food=0;
            let loan=0;
            let other=0;
            data.data.forEach((d)=>{
                expenditure=expenditure+(+d.amount);
                if(d.division==="Personal")
                {
                    personal+=(+d.amount);
                }
                else
                {
                    office+=(+d.amount);
                }
                if(d.category==="Fuel")
                {fuel+=(+d.amount)}
                if(d.category==="Medical")
                {medical+=(+d.amount)}
                if(d.category==="Food")
                {food+=(+d.amount)}
                if(d.category==="Loan")
                {loan+=(+d.amount)}
                if(d.category==="Other")
                {other+=(+d.amount)}
                if(d.category==="Movie")
                {movie+=(+d.amount)}

            });
            
            personal=+personal;
            office=+office;
            fuel=+fuel;
            medical=+medical;
            movie=+movie;
            food=+food;
            loan=+loan;
            other=+other;
            this.setState({modal:false,income,expenditure,personal,office,fuel,medical,movie,food,loan,other});
            this.dropdown.current.innerText=text
        }
        catch(err){
            console.log(err);
        }

    }
    componentDidMount(){
        this.details(7,"Last Week");

    }
    render(){
        return (
            <Col xs="12" md="6" className="mb-3">
                    <Row className="justify-content-center">
                    <Col xs="12" className="mb-3">
                        <Dropdown>
                            <Dropdown.Toggle ref={this.dropdown} id="dropdown-basic-1" className="buton" variant="bg-dark">
                                Show Details of:
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="buton bg-cyan">
                                <Dropdown.Item href="#/action-1" onClick={()=>{this.details(7,"Last Week")}} ref={this.weekly}>Last Week</Dropdown.Item>
                                <Dropdown.Item href="#/action-2" onClick={()=>{this.details(30,"Last Month")}}>Last Month</Dropdown.Item>
                                <Dropdown.Item href="#/action-3" onClick={()=>{this.details(365,"Last Year")}}>Last Year</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </Col>
                    <Col xs="11">
                    <Row className="justify-content-center">
                            <Col xs="12" className="box box-shadow-dark mb-3 p-3 text-center">
                            <Row className="mb-2">
                                <Col xs="6" >
                                    <Row className="p-1 justify-content-centerbox box-shadow-dark">
                                    <Col xs="6" className="heading ">Total Income</Col>
                                    <Col xs="6" className="text-light text-align-left"> Rs. {this.state.income}</Col>
                                    </Row>
                                </Col>
                                <Col xs="6" >
                                    <Row className="p-1 justify-content-centerbox box-shadow-dark">
                                    <Col xs="6" className="heading ">Total Expenditure</Col>
                                    <Col xs="6" className="text-light text-align-left"> Rs. {this.state.expenditure}</Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col xs="12" className="heading mb-2">Expenditure Details</Col>
                                <Col xs="12">
                                    <Row className="justify-content-center mb-3">
                                    <Col xs="5" className="box box-shadow-dark bg-danger">
                                        Office- Rs.{this.state.office}
                                    </Col>
                                    <Col xs="5" className="box box-shadow-dark bg-warning">
                                        Personal- Rs.{this.state.personal}
                                    </Col>
                                    <Col xs="6" className="mt-3">
                                    <PieChart
                                        data={[
                                            { title: 'Personal', value: this.state.personal, color: '#FFA900' },
                                            { title: 'Office', value: this.state.office, color: '#F93154' }
                                        ]}
                                        />
                                    </Col>
                                    </Row>
                                </Col>
                                <Col xs="12">
                                    <Row className="justify-content-center mb-3">
                                    <Col xs="5" className="box box-shadow-dark bg-danger">
                                        Fuel- Rs.{this.state.fuel}
                                    </Col>
                                    <Col xs="5" className="box box-shadow-dark bg-warning">
                                        Food- Rs.{this.state.food}
                                    </Col>
                                    <Col xs="5" className="box box-shadow-dark bg-primary">
                                        Medical- Rs.{this.state.medical}
                                    </Col>
                                    <Col xs="5" className="box box-shadow-dark bg-info">
                                        Movie- Rs.{this.state.movie}
                                    </Col>
                                    <Col xs="5" className="box box-shadow-dark bg-success">
                                        Loan- Rs.{this.state.loan}
                                    </Col>
                                    <Col xs="5" className="box box-shadow-dark bg-dark">
                                        Other- Rs.{this.state.other}
                                    </Col>
                                    <Col xs="6" className="mt-3">
                                    <PieChart 
                                        data={[
                                            { title: 'Fuel', value: this.state.fuel, color: '#F93154' },
                                            { title: 'Food', value: this.state.food, color: '#FFA900' },
                                            { title: 'Medical', value: this.state.medical, color: '#1266F1' },
                                            { title: 'Movie', value: this.state.movie, color: '#39C0ED' },
                                            { title: 'Loan', value: this.state.loan, color: '#00B74A' },
                                            { title: 'Other', value: this.state.other, color: '#262626' }
                                        ]}
                                        />
                                    </Col>
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