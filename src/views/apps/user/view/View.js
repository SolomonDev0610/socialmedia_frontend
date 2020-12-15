import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Media,
  Row,
  Col,
  Button,
  Table
} from "reactstrap"
import { Edit, Trash, Lock, Check } from "react-feather"
import { Link } from "react-router-dom"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import userImg from "../../../../assets/img/portrait/small/avatar-s-18.jpg"
import "../../../../assets/scss/pages/users.scss"
class UserView extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
              </CardHeader>
              <CardBody>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12">
                    <Media className="d-sm-flex d-block">
                      <Media body>
                        <Row >
                          <div style={{width:'100%',textAlign:'center', fontSize:'45px', fontWeight:'bold',marginBottom:'40px', color:'#626161'}}>
                            {localStorage.getItem('username')}
                          </div>
                          <div style={{width:'100%',textAlign:'center', fontSize:'35px', fontWeight:'bold',marginBottom:'30px', color:'#626161'}}>
                            Republication
                          </div>
                          <div style={{width:'100%',textAlign:'center', fontSize:'35px', fontWeight:'bold',marginBottom:'60px', color:'#626161'}}>
                            5035 Points Earned
                          </div>

                        </Row>
                      </Media>
                    </Media>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
export default UserView
