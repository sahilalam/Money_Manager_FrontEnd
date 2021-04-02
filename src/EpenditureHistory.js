import React from "react";
import {Row,Col,Form,Modal,Spinner,Button,Dropdown,Navbar,Nav,NavDropdown} from "react-bootstrap";

export default class ExpenditureHistory extends React.Component{
    dropdown=React.createRef();
    from=React.createRef();
    to=React.createRef();
    division=React.createRef();
    category=React.createRef();
    constructor(props)
    {
        super(props);
        this.state={
            modal:false,
            data:null,
            form:true
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
            console.log(data);
            this.setState({modal:false,data:data.data});
            this.dropdown.current.innerText=text
        }
        catch(err){
            console.log(err);
        }

    }
    filter=()=>{
        this.setState({modal:true,form:true,spinner:false});
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
                    <Col xs="12" className="text-center"><Button className="btn-info buton mb-2" onClick={this.filter}>Filter</Button></Col>
                    <Col xs="12" className="p-2" ref={this.dropdown}>Loading..</Col>
                    <Col xs="12" className="tube bg-cyan">
                        {
                            this.state.data
                            ?
                              this.state.data.length
                              ?
                                this.state.data.map((d)=>{
                                    let date=new Date(d.date);
                                    date=date.toString();
                                    return (
                                        <Col xs="12" className="box mb-2" key={d._id}>
                                            <Row className="justify-content-center">
                                                <Col xs="4">Amount : </Col><Col xs="8">Rs. {d.amount}</Col>
                                                <Col xs="4">Description : </Col><Col xs="8">{d.description}</Col>
                                                <Col xs="4">Date : </Col><Col xs="8">{date}</Col>
                                                <Col xs="4">Division : </Col><Col xs="8">{d.division}</Col>
                                                <Col xs="4">Category : </Col><Col xs="8">{d.category}</Col>
                                            </Row>
                                        </Col>
                                    )
                                })
                                :
                                <Col xs="12" className="heading text-center">No Data for the given range of dates..</Col>
                            :
                            <Col xs="12" className="heading text-center">Loading..</Col>
                        }

                    </Col>
                </Col>  
            </Row>
            :
            <Col xs="12" className="heading">Loading...</Col>
            }
            <Modal show={this.state.modal} onHide={()=>{
                this.setState({modal:false})
            }} backdrop="static" className="text text-secondary">
                {
                    this.state.form
                    ?
                    <Modal.Header closeButton>
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
                    </Modal.Header>
                    :
                    <Modal.Header>Please Wait..<Spinner animation="border"></Spinner></Modal.Header>

                }
            </Modal>
            </Col>
        )
    }
}