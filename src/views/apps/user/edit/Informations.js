import React from "react"
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup, CustomInput,
} from "reactstrap"
import Flatpickr from "react-flatpickr";
import { User, MapPin } from "react-feather"
import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"

//import { updateUsersInformation } from "../../../../redux/actions/form/informationsFormActions"
import axios from "axios";
import moment from "moment"
import {toast} from "react-toastify";
import {history} from "../../../../history";

class UserAccountTab extends React.Component {
  state = {
    dob: this.props.perso["birth_date"],
    username: this.props.data.username,
    p_password: this.props.data.p_password,
    status: this.props.perso.status,
    first_name: this.props.perso.first_name,
    last_name: this.props.perso.last_name,
    role: this.props.data.role,
    email: this.props.data.email,
    contact_number: this.props.perso.contact_number,
    office_number: this.props.perso.office_number,
    martial_status: this.props.perso.martial_status,
    children_number: this.props.perso.children_number,

      personal_address: this.props.perso.personal_address,
      personal_zip_code: this.props.perso.personal_zip_code,
      personal_city: this.props.perso.personal_city,
      personal_country: this.props.perso.personal_country,
      society_name: this.props.perso.society_name,
      society_address: this.props.perso.society_address,
      society_zip_code: this.props.perso.society_zip_code,
      society_city: this.props.perso.society_city,
      society_country: this.props.perso.society_country,
      military_service: this.props.perso.military_service,
  }

  updateUsersInformation = information => {

    const Config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    // console.log(localStorage.getItem("token"))
    axios
        .put("http://localhost:8000/api/users/" + this.props.id, {
          name: information.username,
          email: information.email,
          role: information.role,
          p_password: information.p_password
        }, Config)
        .then(response => {
          axios
              .put("http://localhost:8000/api/personal_information/" + this.props.id,{
                civility: information.status,
                first_name: information.first_name,
                last_name: information.last_name,
                birth_date: information.dob,
                martial_status: information.martial_status,
                children_number: information.children_number,
                mobile_number: information.contact_number,
                office_number: information.office_number,

                  personal_address: information.personal_address,
                  personal_zip_code: information.personal_zip_code,
                  personal_city: information.personal_city,
                  personal_country: information.personal_country,
                  society_address: information.society_address,
                  society_zip_code: information.society_zip_code,
                  society_city: information.society_city,
                  society_country: information.society_country,
                  society_name: information.society_name,
                  military_service: information.military_service,
              }, Config)
              .then(response => {
                  history.push("/app/user/conslist")
                  toast.info("Modifications enregistrées");
              })
              .catch(error => {
                console.log(error);
                toast.error("API injoignable.")
              })
        })
        .catch(error => {
          console.log(error);
          toast.error("API injoignable.")
        })
  }

  ifDateExist(name)
  {
    if (this.props.perso)
      return new Date(this.props.perso[name]);
    else
      return "";
  }

  ifExist(name)
  {
    if (this.props.perso)
      return this.props.perso[name];
    else
      return "";
  }

  ifDataExist(name)
  {
    if (this.props.data)
      return this.props.data[name];
    else
      return "";
  }

  handledob = date => {
    var test = new Date(date[0])
    //var MyDateString = ('0' + test.getDate()).slice(-2) + '/'
    //    + ('0' + (test.getMonth()+1)).slice(-2) + '/'
     //   + test.getFullYear();
    var MyDateString = test.getFullYear() + "-" + ('0' + (test.getMonth()+1)).slice(-2) + "-" + ('0' + test.getDate()).slice(-2)
    this.setState({
      dob: MyDateString
    })
  }

  updateData = e => {
    e.preventDefault();
    this.updateUsersInformation(this.state);
  }

  render() {
    return (
      <Row>
        <Col sm="12">
          <Form onSubmit={this.updateData}>
            <Row>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="name">Prénom</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifExist("first_name")}
                            onChange={e => this.setState({ first_name: e.target.value })}
                            id="name"
                            placeholder="Name"
                        />
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="name">Nom</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifExist("last_name")}
                            onChange={e => this.setState({ last_name: e.target.value })}
                            id="name"
                            placeholder="Name"
                        />
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="p_password">Password</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifDataExist('p_password')}
                            onChange={e => this.setState({ p_password: e.target.value })}
                            id="p_password"
                            placeholder="Password"
                        />
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="role">Role</Label>
                        <CustomInput type="select" name="select" id="role" onChange={e => this.setState({ role: e.target.value })}>
                            <option>{this.ifDataExist('role')}</option>
                            <option>user</option>
                            <option>admin</option>
                        </CustomInput>
                    </FormGroup>
                </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="status">Civilité</Label>
                  <Input
                      type="txt"
                      name="status"
                      defaultValue={this.ifExist("civility")}
                      onChange={e => this.setState({ status: e.target.value })}
                      id="status">
                  </Input>
                </FormGroup>
              </Col>


              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="text"
                    defaultValue={this.ifDataExist('email')}
                    onChange={e => this.setState({ email: e.target.value })}
                    id="email"
                    placeholder="Email"
                  />
                </FormGroup>
              </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="martiel_status">Status Marital</Label>
                        <CustomInput type="select" name="select" id="martiel_status" onChange={e => this.setState({ martial_status: e.target.value })}>
                            <option>{this.ifExist("martial_status")}</option>
                            <option>Célibataire</option>
                            <option>Pacsé</option>
                            <option>Marié</option>
                            <option>Veuf</option>
                            <option>Divorcé</option>
                        </CustomInput>
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="officenumber">Office Number</Label>
                        <Input
                            type="text"
                            id="officenumber"
                            defaultValue={this.ifExist("office_number")}
                            placeholder="Office Number"
                            onChange={e => this.setState({ office_number: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label className="d-block" for="dob">
                            Date de naissance
                        </Label>
                        <Flatpickr
                            id="dob"
                            className="form-control"
                            options={{ dateFormat: "d/m/Y" }}
                            placeholder={this.props.perso["birth_date"]}
                            defaultValue={this.props.perso["birth_date"]}
                            onChange={date => this.handledob(date)}
                        />
                    </FormGroup>
                </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="contactnumber">Contact Number</Label>
                  <Input
                    type="text"
                    id="contactnumber"
                    placeholder="Contact Number"
                    defaultValue={this.ifExist("mobile_number")}
                    onChange={e => this.setState({ contact_number: e.target.value })}
                  />
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="child_nbr">Nombre d'enfants</Label>
                  <Input
                      type="number"
                      id="child_nbr"
                      placeholder="Nombre d'enfants"
                      defaultValue={this.ifExist("children_number")}
                      onChange={e => this.setState({ children_number: e.target.value })}
                  />
                </FormGroup>
              </Col>

                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="child_nbr">Service militaire</Label>
                        <CustomInput type="select" name="military_service" id="military_service"
                                     value={this.ifExist("military_service")}
                                     onChange={e => this.setState({ military_service: e.target.value })}>
                            <option value="Service militaire">Service militaire</option>
                            <option value="oui">oui</option>
                            <option value="non">non</option>
                        </CustomInput>
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                    <FormGroup>
                        <Label for="child_nbr">Nom Société</Label>
                        <Input
                            type="text"
                            id="society_name"
                            placeholder="Nom Société"
                            defaultValue={this.ifExist("society_name")}
                            onChange={e => this.setState({ society_name: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col md="6" sm="12">
                </Col>

                <Col className="mt-1" md="6" sm="12">
                    <h5 className="mb-1">
                        <User className="mr-50" size={16} />
                        <span className="align-middle">Adresse du client</span>
                    </h5>
                    <FormGroup>
                        <Label for="address1">Adresse</Label>
                        <Input
                            type="text"
                            id="address1"
                            defaultValue={this.ifExist("personal_address")}
                            onChange={e => this.setState({ personal_address: e.target.value })}
                            placeholder="Address personnelle"
                        />
                    </FormGroup>
                    <FormGroup form-group-lg>
                        <Label for="pincode">Code postal</Label>
                        <Input
                            type="number"
                            id="pincode"
                            placeholder="Code postal de personnel"
                            defaultValue={this.ifExist("personal_zip_code")}
                            onChange={e => this.setState({ personal_zip_code: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="city">Ville</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifExist("personal_city")}
                            onChange={e => this.setState({ personal_city: e.target.value })}
                            id="city"
                            placeholder="Ville personnel"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Country">Pays</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifExist("personal_country")}
                            onChange={e => this.setState({ personal_country: e.target.value })}
                            id="Country"
                            placeholder=">Pays personnel"
                        />
                    </FormGroup>
                </Col>
                <Col className="mt-1" md="6" sm="12">
                    <h5 className="mb-1">
                        <MapPin className="mr-50" size={16} />
                        <span className="align-middle">Adresse de sa société</span>
                    </h5>
                    <FormGroup>
                        <Label for="address1">Adresse</Label>
                        <Input
                            type="text"
                            id="address1"
                            placeholder="Address de société"
                            defaultValue={this.ifExist("society_address")}
                            onChange={e => this.setState({ society_address: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup form-group-lg>
                        <Label for="pincode">Code postal</Label>
                        <Input
                            type="number"
                            id="pincode"
                            placeholder="Code postal de société"
                            defaultValue={this.ifExist("society_zip_code")}
                            onChange={e => this.setState({ society_zip_code: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="city">Ville</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifExist("society_city")}
                            onChange={e => this.setState({ society_city: e.target.value })}
                            id="city"
                            placeholder="Ville société"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Country">Pays</Label>
                        <Input
                            type="text"
                            defaultValue={this.ifExist("society_country")}
                            onChange={e => this.setState({ society_country: e.target.value })}
                            id="Country"
                            placeholder="Pays de la société"
                        />
                    </FormGroup>
                </Col>
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary" type="submit">
                  Modifier
                </Button.Ripple>
                {/*<Button.Ripple color="flat-warning">Reset</Button.Ripple>*/}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
}
export default UserAccountTab
