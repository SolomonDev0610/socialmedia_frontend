import React from "react"
import {
  FormGroup,
  Input,
  CustomInput,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader, Button, Form,
  // Button
} from "reactstrap"
import {history} from "../../../../history";
import axios from "axios";
import {toast} from "react-toastify"
import SweetAlert from "react-bootstrap-sweetalert";

import Flatpickr from "react-flatpickr";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"


toast.configure(); // required to work with toast
var generator = require('generate-password');

class AddUser extends React.Component {
  state = {
      Alert : false,
    data: {
      id: null,
      name: null,
      last_name: null,
      maiden_name: null,
      first_name: null,
      society_related: "Moneynci",
      email: null,
      password: generator.generate({length: 10, numbers: true}),
      civility: "Monsieur",
      martial_status: "Célibataire",
      children_number: null,
      mobile_number: null,
      office_number: null,
      military_service: null,
      birth_date: null,
      personal_address: null,
      personal_address_2: null,
      personal_zip_code: null,
      personal_city: null,
      personal_country: null,
      society_name: null,
      society_address: null,
      society_address_2: null,
      society_zip_code: null,
      society_city: null,
      society_country:null
    }
  }

  handleAlert = (value) => {
    this.setState({ Alert : value })
    if (value === false)
      history.push("/app/user/conslist")

  }

  sendForm = (data) => {
    axios.post("http://localhost:8000/api/register", {
      email: data.email,
      password: data.password,
      name: data.first_name + " " + data.last_name
    })
        .then(function(result) {
          console.log(result)
          if (result.data.accessToken) {
            axios
                .post("http://localhost:8000/api/personal_information", {
                  user_id: 10,
                  last_name: data.last_name,
                  maiden_name: data.maiden_name,
                  first_name: data.first_name,
                  society_related: data.society_related,
                  civility: data.civility,
                  martial_status: data.martial_status,
                  children_number: data.children_number,
                  mobile_number: data.mobile_number,
                  office_number: data.office_number,
                  military_service: data.military_service,
                  birth_date: data.birth_date,
                  personal_address: data.personal_address,
                  personal_address_2: data.personal_address_2,
                  personal_zip_code: data.personal_zip_code,
                  personal_city: data.personal_city,
                  personal_country: data.personal_country,
                  society_name: data.society_name,
                  society_address: data.society_address,
                  society_address_2: data.society_address_2,
                  society_zip_code: data.society_zip_code,
                  society_city: data.society_city,
                  society_country: data.society_country,
                  notes: data.notes,
                })
                .then(response => {
                })
                .catch(error => {
                  console.log(error);
                  toast.error("API injoignable.")
                })
          } else
            toast.error("Création annulé: l'utilisateur existe déjà.")
        })
        .catch(function(error) {
          toast.error("API injoignable" + data.name)
        })
  }
    handledob = date => {
        var test = new Date(date[0])
        var MyDateString = test.getFullYear() + "-" + ('0' + (test.getMonth()+1)).slice(-2) + "-" + ('0' + test.getDate()).slice(-2);

        this.setState({ data: { ...this.state.data, birth_date: MyDateString} })
    }
  handleSubmit = e => {
    e.preventDefault()
    this.sendForm(this.state.data)
    this.handleAlert(true)
  }
  render() {
    return (
      <Form action="/" onSubmit={this.handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Création client</CardTitle>
        </CardHeader>
        <SweetAlert success title="Utilisateur enregistré"
                    show={this.state.Alert}
                    onConfirm={() => this.handleAlert(false)}
        >
          <p className="sweet-alert-text">Merci de copier son mot de passe : <b>{this.state.data.password}</b></p>
        </SweetAlert>
        <CardBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Nom"
                    required
                    value={this.state.data.last_name}
                    onChange={e => this.setState({ data: { ...this.state.data, last_name: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Nom de jeune fille"
                    onChange={e => this.setState({ data: { ...this.state.data, maiden_name: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Prénom"
                    required
                    onChange={e => this.setState({ data: { ...this.state.data, first_name: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <CustomInput type="select" name="select" id="city" onChange={e => this.setState({ data: { ...this.state.data, society_related: e.target.value} })}>
                  <option>EOR</option>
                  <option>Moneynci</option>
                  <option>Les deux</option>
                </CustomInput>
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={this.state.data.email}
                    onChange={e => this.setState({ data: { ...this.state.data, email: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="pass"
                    placeholder="Mot de passe"
                    required
                    value={this.state.data.password}
                    onChange={e => this.setState({ data: { ...this.state.data, password: e.target.value} })}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <CustomInput type="select" name="select" id="status" onChange={e => this.setState({ data: { ...this.state.data, civility: e.target.value} })}>
                  <option>Monsieur</option>
                  <option>Madame</option>
                  <option>Docteur</option>
                  <option>Maître</option>
                </CustomInput>
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <CustomInput type="select" name="select" id="status" onChange={e => this.setState({ data: { ...this.state.data, martial_status: e.target.value} })}>
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
                <Input
                    type="number"
                    placeholder="Nombre d'enfants"
                    value={this.state.data.children_number}
                    onChange={e => this.setState({ data: { ...this.state.data, children_number: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="Input-Number" placeholder="Téléphone portable"
                    onChange={e => this.setState({ data: { ...this.state.data, mobile_number: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <CustomInput type="select" name="select" id="status" onChange={e => this.setState({ data: { ...this.state.data, military_service: e.target.value} })}>
                  <option >Service militaire</option>
                  <option>oui</option>
                  <option>non</option>
                </CustomInput>
              </FormGroup>
            </Col>
              <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="Input-Number" placeholder="Téléphone fixe"
                    onChange={e => this.setState({ data: { ...this.state.data, office_number: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                  <Flatpickr
                      id="dob"

                      className="form-control"
                      options={{ dateFormat: "d/m/Y" }}
                      placeholder="Date de naissance"
                      defaultValue={this.state.data["birth_date"]}
                      onChange={date => this.handledob(date)}
                  />
              </FormGroup>
            </Col>
          </Row>
          <h4>Perso</h4>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Adresse 1"
                    onChange={e => this.setState({ data: { ...this.state.data, personal_address: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Adresse 2"
                    onChange={e => this.setState({ data: { ...this.state.data, personal_address_2: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="number" placeholder="CP"
                    onChange={e => this.setState({ data: { ...this.state.data, personal_zip_code: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Ville"
                    onChange={e => this.setState({ data: { ...this.state.data, personal_city: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Pays "
                    onChange={e => this.setState({ data: { ...this.state.data, personal_country: e.target.value} })}
                />
              </FormGroup>
            </Col>
          </Row>
          <h4>Société</h4>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Nom Société"
                    onChange={e => this.setState({ data: { ...this.state.data, society_name: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Adresse 1"
                    onChange={e => this.setState({ data: { ...this.state.data, society_address: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Adresse 2"
                    onChange={e => this.setState({ data: { ...this.state.data, society_address_2: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="number" placeholder="CP"
                    onChange={e => this.setState({ data: { ...this.state.data, society_zip_code: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Ville"
                    onChange={e => this.setState({ data: { ...this.state.data, society_city: e.target.value} })}
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Input
                    type="text" placeholder="Pays"
                    onChange={e => this.setState({ data: { ...this.state.data, society_country: e.target.value} })}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <CustomInput type="select" name="select" id="status">
                  <option>Consultant</option>
                  <option>Mike</option>
                  <option>José</option>
                  <option>Donald</option>
                </CustomInput>
              </FormGroup>
            </Col>
          </Row>
          <h4>Notes</h4>
          <Row>
            <Col md="12" sm="12">
              <FormGroup>
                <Input type="textarea" rows="5" placeholder="Notes"
                       onChange={e => this.setState({ data: { ...this.state.data, notes: e.target.value} })}/>
              </FormGroup>
            </Col>
            <Col md={{ size: 8, offset: 4 }}>
              <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
              >
                Enregistrer
              </Button.Ripple>
              <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
              >
                Prestations
              </Button.Ripple>
            </Col>
          </Row>
        </CardBody>
      </Card>
      </Form>
    )
  }
}

export default AddUser
