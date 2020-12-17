import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import classnames from "classnames"
import {User, Info, FileText, Folder} from "react-feather"
import AccountTab from "./Informations"
import InfoTab from "./Adress"
import SocialTab from "./Notes"
import "../../../../assets/scss/pages/users.scss"
import axios from "axios";
import Documents from "./Documents";
class UserEdit extends React.Component {
  state = {
    rowData: [],
    persoData:[],
    activeTab: "1"
  }

  async componentDidMount() {
    const Config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }

    this.setState({ activeTab: this.props.match.params.tab});
    await axios.get(global.config.server_url + "/users/" + this.props.match.params.id, Config).then(response => {
      console.log(response.data);
      let rowData = response.data
      let persoData = response.data.personal_informations;
      console.log(persoData);
      this.setState({ rowData, persoData })
    })
  }

  toggle = tab => {
    this.setState({
      activeTab: tab
    })
  }
  render() {
    return (
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1"
                    })}
                    onClick={() => {
                      this.toggle("1")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">Informations</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2"
                    })}
                    onClick={() => {
                      this.toggle("2")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Notes</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3"
                      })}
                      onClick={() => {
                        this.toggle("3")
                      }}
                  >
                    <Folder size={16} />
                    <span className="align-middle ml-50">Documents</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <AccountTab
                      data={this.state.rowData}
                      perso={this.state.persoData}
                      id={this.props.match.params.id}
                      dob={this.state.persoData["birth_date"]}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <InfoTab
                      data={this.state.rowData}
                      perso={this.state.persoData}
                      id={this.props.match.params.id}
                  />
                </TabPane>
                <TabPane tabId="3">
                  <Documents
                      name={this.state.rowData.name}
                      id={this.props.match.params.id}
                  />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
export default UserEdit
