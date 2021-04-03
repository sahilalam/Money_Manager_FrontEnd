import React from "react";
import {Row,Col,Form,Modal,Spinner,Button,Tab,Tabs} from "react-bootstrap";
import  createBody from "./creatBody.js";
import Context from "./Context.js";

export default class ExpenditureHistory extends React.Component{
    static contextType=Context;
    dropdown=React.createRef();
    from=React.createRef();
    to=React.createRef();
    division=React.createRef();
    category=React.createRef();
    updated_amount=React.createRef();
    updated_description=React.createRef();
    updated_category=React.createRef();
    updated_division=React.createRef();

    constructor(props)
    {
        super(props);
        this.state={
            modal:false,
            data:null,
            form:true,
            filter:false,
            id:null,
            message:null
        }
    }
    details=async(text,status)=>{
        this.setState({modal:true,form:false,spinner:true})
        try{
            let d,t=0,division=0,category=0;
            if(status)
            {
                d=new Date(this.from.current.value)-0;
                t=new Date(this.to.current.value)-0;
                division=this.division.current.value;
                category=this.division.current.value;
                if(division==="All")
                {
                    division=0;
                }
                if(category==="All")
                {
                    category=0;
                }
                
            }
            else
            {
                d=new Date();
                d=d-(90*24*60*60*1000);
            }
            
            
            let data=await fetch(`https://money-manager-backend-sa.herokuapp.com/get_expense/${d}/${t}/${category}/${division}`,{
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
            this.setState({modal:false,data:data.data});
            this.dropdown.current.innerText=text
        }
        catch(err){
            console.log(err);
        }

    }
    filter=()=>{
        this.setState({modal:true,form:true,spinner:false,filter:true});
    }
    update=async(id,status,type)=>{
        try{
            if(status){
                this.setState({modal:true,spinner:true,form:false,filter:false})
                let details={
                    amount:this.updated_amount.current.value,
                    id
                    
                }
                if(type===1)
                {
                    details={
                        description:this.updated_description.current.value,
                        id
                    }
                }
                if(type===2)
                {
                    details={
                        division:this.updated_division.current.value,
                        id
                    }
                }
                if(type===3)
                {
                    details={
                        category:this.updated_category.current.value,
                        id
                    }
                }
                let body=createBody(details);
                    let data=await fetch('https://money-manager-backend-sa.herokuapp.com/update_expense',{
                        method:'PUT',
                        body,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            "authorization":window.localStorage.access_token
                        }
                    })
                    if(data.status===201)
                    {
                        data=await data.json();
                        this.setState({modal:true,spinner:false,form:true,filter:false,message:data.message});
                    }
                    else
                    {
                        this.context.logout();
                    }
            }
            else
            {
                this.setState({modal:true,spinner:false,filter:false,form:true,id:id});
            }

        }
        catch(err)
        {
            console.log(err);
        }
        

    }
    componentDidMount(){
        if(!this.state.data)
        {
            this.details("Last Three Months",0)
        }
        
    }
    render(){
        return (
            <Col xs="12">
            <Col xs="12  text-center"><h3 className="heading mb-3">Expenditure History</h3></Col>
            {
                this.state.data?
                <Row className="justify-content-around">
                
                <Col xs="12" className="mb-5">
                    <Row className="justify-content-center">
                    <Col xs="12" md="7" className="text-center"><Button className="btn-info buton mb-2" onClick={this.filter}>Filter</Button></Col>
                    <Col xs="12" md="7" className="p-2" ref={this.dropdown}>Loading..</Col>
                    <Col xs="12" md="7" className="tube bg-cyan">
                        {
                            this.state.data
                            ?
                              this.state.data.length
                              ?
                                this.state.data.map((d)=>{
                                    let date=new Date(d.date);
                                    date = date.getTime() 
                                    date = new Date(date);
                                    date.setHours(date.getHours() - 5); 
                                    date.setMinutes(date.getMinutes() - 30);
                                    date=new Date(date);
                                    date=date.toLocaleString();
                                    return (
                                        <Col xs="12" className="box mb-2" key={d._id}>
                                            <Row className="justify-content-center">
                                            <Col xs="3" className="heading text-align-right">Amount : </Col><Col xs="9" className="text-align-left">Rs. {d.amount}</Col>
                                            <Col xs="3" className="heading text-align-right">Description : </Col><Col xs="9" className="text-align-left">{d.description}</Col>
                                            <Col xs="3" className="heading text-align-right">Date : </Col><Col xs="9" className="text-align-left">{date}</Col>
                                            <Col xs="3" className="heading text-align-right">Division : </Col><Col xs="9" className="text-align-left">{d.division}</Col>
                                            <Col xs="3" className="heading text-align-right">Category : </Col><Col xs="9" className="text-align-left">{d.category}</Col>
                                                {
                                                    d.check
                                                    &&
                                                    <Col xs="12" className="text-align-right"><a href="#update" className="text"onClick={()=>{this.update(d._id,0)}}>Update</a></Col>
                                                    
                                                }
                                            </Row>
                                        </Col>
                                    )
                                })
                                :
                                <Col xs="10" md="7" className="heading text-center">No Data for the given range of dates..</Col>
                            :
                            <Col xs="10" md="7" className="heading text-center">Loading..</Col>
                        }

                    </Col>
                    </Row>
                </Col>  
            </Row>
            :
            <Col xs="10" className="heading">Loading...</Col>
            }
            <Modal show={this.state.modal} onHide={()=>{
                this.setState({modal:false})
            }} backdrop="static" className="text text-secondary">
                {
                    this.state.form
                    ?
                    this.state.filter?
                    <>
                    <Modal.Header closeButton>
                        Filter
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(event)=>{event.preventDefault();this.details("filter applied",1)}}>
                            From
                            <input type="datetime-local" className="form-control mb-2" required={true} ref={this.from}/>
                            To
                            <input type="datetime-local" className="form-control mb-2" required={true} ref={this.to}/>
                            <select className="form-control mb-2" required={true} ref={this.division}>
                                <option value="Office">Office</option>
                                <option value="Personal">Personal</option>
                                <option value="All">All</option>
                            </select>
                            <select className="form-control mb-2" required={true} ref={this.category}>
                                <option value="Fuel">Fuel</option>
                                <option value="Medical">Medical</option>
                                <option value="Movie">Movie</option>
                                <option value="Food">Food</option>
                                <option value="Loan">Loan</option>
                                <option value="Other">Other</option>
                                <option value="All">All</option>
                            </select>
                            <button type="submit" className="btn btn-info buton header mb-2">Submit</button>
                        </Form>
                    </Modal.Body>
                    </>
                    :
                    <>
                        <Modal.Header closeButton>
                           {
                               this.state.message
                               ?
                               this.state.message+",Update will be reflected once you reload the page again."
                               :
                               "Update"
                               
                           }
                        </Modal.Header>
                        {
                            !this.state.message &&
                            <Modal.Body>
                            <Tabs defaultActiveKey="Form">
                                    <Tab eventKey="Amount" title="Amount">
                                        <Row className="p-3">
                                            <Col xs="12">
                                                <Form onSubmit={(event)=>{event.preventDefault();this.update(this.state.id,1,0)}} className="">
                                                 New Amount
                                                <Form.Control ref={this.updated_amount} type="number" required={true} placeholder="Enter New Amount.." className="mb-3 input" />
                                                <button type="submit" className="buton mb-2 header">Submit</button>
                                                </Form>   
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="Description" title="Description">
                                        <Row className="p-3">
                                            <Col xs="12">
                                            <Form onSubmit={(event)=>{event.preventDefault();this.update(this.state.id,1,1)}}>
                                            New Description
                                            <Form.Control ref={this.updated_description} type="text" as="textarea" required={true} placeholder="Enter New Description.." className="mb-3 input" />
                                            <button type="submit" className="buton mb-2 header">Submit</button>
                                        </Form>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="Division" title="Division">
                                        <Row className="p-3">
                                            <Col xs="12">
                                            <Form onSubmit={(event)=>{event.preventDefault();this.update(this.state.id,1,2)}}>
                                            New Division
                                            <select ref={this.updated_division} required={true}  className="form-control mb-3 input" >
                                            <option value="Office">Office</option>
                                            <option value="Personal">Personal</option>
                                            </select>
                                            <button type="submit" className="buton mb-2 header">Submit</button>
                                        </Form>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="Category" title="Category">
                                        <Row className="p-3">
                                            <Col xs="12">
                                            <Form onSubmit={(event)=>{event.preventDefault();this.update(this.state.id,1,3)}}>
                                            New Category
                                            <select ref={this.updated_category}  required={true} className="form-control mb-3 input">
                                            <option value="Fuel">Fuel</option>
                                            <option value="Medical">Medical</option>
                                            <option value="Movie">Movie</option>
                                            <option value="Food">Food</option>
                                            <option value="Loan">Loan</option>
                                            <option value="Other">Other</option>
                                            </select>
                                            <button type="submit" className="buton mb-2 header">Submit</button>
                                        </Form>
                                            </Col>
                                        </Row>
                                    </Tab>
                                </Tabs>
                            </Modal.Body>
                        }
                        </>
                    :
                    <Modal.Header>Please Wait..<Spinner animation="border"></Spinner></Modal.Header>

                }
            </Modal>
            </Col>
        )
    }
}