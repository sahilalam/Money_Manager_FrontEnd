import React from "react";
import {Row,Col,Form,Modal,Spinner,Button,Dropdown,Navbar,Nav,NavDropdown} from "react-bootstrap";

export default class IncomeHistory extends React.Component{
    dropdown=React.createRef();
    from=React.createRef();
    to=React.createRef();
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
            let d,t=0;
            if(status)
            {
                d=new Date(this.from.current.value)-0;
                t=new Date(this.to.current.value)-0;
            }
            else
            {
                d=new Date();
                d=d-(90*24*60*60*1000);
            }
            
            
            let data=await fetch(`https://money-manager-backend-sa.herokuapp.com/get_income/${d}/${t}`,{
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
    render(){


        return (
            <Col xs="12">
            <Col xs="12  text-center"><h3 className="heading mb-3">Income History</h3></Col>
            {
                this.state.data?
                <Row className="justify-content-around">
                
                <Col xs="12" className="mb-5">
                    <Col xs="12" className="text-center"><Button className="btn-info buton mb-2" onClick={this.filter}>Filter</Button></Col>
                    <Col xs="12" className="p-2" ref={this.dropdown}>Filter Applied</Col>
                    <Col xs="12" className="tube">
                        <Col xs="12" className="box mb-2">
                            income 1<br/>
                            income 1<br/>
                            income 1<br/>
                            income 1<br/>
                        </Col>
                        <Col xs="12" className="box mb-2">
                            income 1<br/>
                            income 1<br/>
                            income 1<br/>
                            income 1<br/>
                        </Col>
                        <Col xs="12" className="box mb-2">
                            income 1<br/>
                            income 1<br/>
                            income 1<br/>
                            income 1<br/>
                        </Col>
                    </Col>
                </Col>  
            </Row>
            :
            <Col xs="12" className="heading">Feature Not Added Yet</Col>
            }
            <Modal show={this.state.modal} onHide={()=>{
                this.setState({modal:false})
            }} backdrop="static">
                {
                    this.state.form
                    ?
                    <Modal.Header closeButton>
                        <Form onSubmit={(event)=>{event.preventDefault();this.details("filter applied",1)}}>
                            <input type="datetime-local" className="form-control mb-2" required={true} ref={this.from}/>
                            <input type="datetime-local" className="form-control mb-2" required={true} ref={this.to}/>
                            <button type="submit" className="btn btn-info buton mb-2">Submit</button>
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