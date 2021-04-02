import React from "react";
import {Row,Col,Form,Modal,Spinner,Button,Dropdown,Navbar,Nav,NavDropdown} from "react-bootstrap";

export default class ExpenditureHistory extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            data:null
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
            </Col>
        )
    }
}