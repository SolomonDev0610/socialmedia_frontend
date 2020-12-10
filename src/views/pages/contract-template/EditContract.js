import React from "react"
import moment from "moment";
import {
  Card,
  CardBody,
  Row,
  Col,
  Media,
  Table,
  InputGroup,
  Input,
  InputGroupAddon,
  Button
} from "reactstrap"
import LabeledCheckboxMaterialUi from 'labeled-checkbox-material-ui';
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import logo from "../../../assets/img/logo/contract_logo.jpg"
import { Mail, Phone, FileText, Download } from "react-feather"
import { Check } from "react-feather"
import "../../../assets/scss/pages/contract.scss"
import axios from "axios";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";
import {toast} from "react-toastify";
import {history} from "../../../history";

var input_values = {
    "c1":false,     "c2":true,    "c3":true,   "c4":false,     "c5":true,
    "c6":true,  "c7":true,   "cnb2":false,    "cnb4":true,   "cnb5":false,     "cc5":true,
    "nb1":"5",      "nb2":"1",     "nb4":"0",     "nb5":"10",
    "p2":"1500",       "p3":"1500",      "p4":"1500",      "p5":"1500",     "p6":"1500",    "p7":"1500",
    "TVAP":"20", "fp1":'75', "fp2":'25'
};
class EditContract extends React.Component {
  state = {
    rowData: [],
    perso:[],
    services:[],
    activeTab: "1",
    formValues:{
        "c1":false,     "c2":true,    "c3":true,   "c4":false,     "c5":true,
        "c6":true,  "c7":true,   "cnb2":false,    "cnb4":true,   "cnb5":false,     "cc5":true,
    },
  }

  ifExist(name)
  {
    if (this.state.perso)
      return this.state.perso[name];
    else
      return "N/a";
  }
  handleFieldChange = (field, value) => {
      input_values[field] = value;
      this.state.formValues[field] = value;
      if(field == "fp1") {
          this.state.formValues["fp2"] = 100 - value;
          input_values["fp2"] = 100 - value;
      }
      if(field == "fp2") {
          this.state.formValues["fp1"] = 100 - value;
          input_values["fp1"] = 100 - value;
      }

      this.setState(
          {
              formValues: this.state.formValues
          }
      );
      this.calculate();
  };
  handleCheckChange = (check, field) => {
      input_values[field] = check;
      this.state.formValues[field] = check;
      this.setState({
          formValues: this.state.formValues
      });
      this.calculate();
  };
  calculate = () =>{
      var VTA = (1 + input_values['TVAP'] / 100);

      //------- section1 -------
      var nbHT1 = 0;
      if(input_values['c1'])
          nbHT1 = Math.trunc((260 / 60) * parseInt(this.state.formValues['nb1'], 10));
      this.state.formValues['nbHT1'] = nbHT1;
      this.state.formValues['TTC1'] = nbHT1 * VTA;

     //------- section2 -------
      var HT2 = 0;
      if(input_values['c2'])
          HT2 = input_values['p2'];
      this.state.formValues['HT2'] = HT2;
      var nbHT2 = 0;
      if(input_values['c2'] && input_values['cnb2'])
          nbHT2 = 300 * input_values['nb2'];
      this.state.formValues['nbHT2'] = nbHT2;

      this.state.formValues['TTC2'] = (parseInt(HT2) + parseInt(nbHT2)) * VTA;

      //------- section3 -------
      var HT3 = 0;
      if(input_values['c3'])
          HT3 = input_values['p3'];
      this.state.formValues['HT3'] = HT3;

      //------- section4 -------
      var HT4 = 0;
      if(input_values['c4'])
          HT4 = input_values['p4'];
      this.state.formValues['HT4'] = HT4;
      this.state.formValues['TTC4'] = (parseInt(HT3) + parseInt(HT4)) * VTA;

      var nbHT4 = 0;
      if(input_values['cnb4'])
          nbHT4 = 850 * input_values['nb4'];
      this.state.formValues['nbHT4'] = nbHT4;
      this.state.formValues['TTC34'] = (parseInt(HT3) + parseInt(HT4) + parseInt(nbHT4) ) * VTA;

      //------- section5 -------
      var HT5 = 0;
      var nbHT5 = 0;

      if(input_values['c5'] && !input_values['cc5']){
          HT5 = input_values['p5'];
      }
      if(input_values['c5'] && input_values['cnb5']){
          nbHT5 = 750 * input_values['nb5'];
      }

      this.state.formValues['HT5'] = HT5;
      this.state.formValues['nbHT5'] = nbHT5;
      this.state.formValues['TTC5'] = (parseInt(HT5) + parseInt(nbHT5)) * VTA;

      //------- section6 -------
      var HT6 = 0;
      if(input_values['c6'])
          HT6 = input_values['p6'];
      this.state.formValues['HT6'] = HT6;
      this.state.formValues['TTC6'] = parseInt(HT6)* VTA;

      //------- section7 -------
      var HT7 = 0;
      if(input_values['c7'])
          HT7 = input_values['p7'];
      this.state.formValues['HT7'] = HT7;

      this.state.formValues['TTC7'] = parseInt(HT7)* VTA;

      //------- total -------
      var TOTALHT =
          parseInt(nbHT1) + parseInt(HT2) + parseInt(nbHT2) +
          parseInt(HT3) + parseInt(HT4) + parseInt(nbHT4)+
          parseInt(HT5) + parseInt(nbHT5) + parseInt(HT6) + parseInt(HT7);

      this.state.formValues['TOTALHT'] = TOTALHT;
      this.state.formValues['TVA'] = TOTALHT * input_values['TVAP'] / 100;
      this.state.formValues['TOTALTTC'] = Math.trunc(TOTALHT* VTA);

      var percent1 = input_values['fp1'] / 100 ;
      var percent2 = 1 - input_values['fp1'] / 100 ;
      this.state.formValues['FINAL75'] = Math.trunc(TOTALHT* VTA * percent1)+".00";
      this.state.formValues['FINAL25'] = Math.trunc(TOTALHT* VTA * percent2)+".00";

      this.setState({
          formValues: this.state.formValues
      })
  }
  async componentDidMount() {
      const Config = {
          headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
          }
      }
      axios.get("http://localhost:8000/api/get_contract/" + this.props.match.params.id, Config).then(response => {
          let rowData = response.data.data
          let perso = response.data.data.personal_informations;
          let userData = response.data.data.user;
          perso = Object.assign(perso, userData);
          this.setState(
              {
                  user_id: response.data.data.user.id
              }
          );
          this.setState({ rowData, perso});
          if(response.data.data.values != null) {
              let values = JSON.parse(response.data.data.values);
              this.setState(
                  {
                      formValues: values
                  }
              );
              input_values = { ...values};
              this.calculate();
          }else {
              console.log("Values are empty!");
          }
      })
  }

  sendForm = () => {
      const Config = {
          headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
          }
      }
      var parameters = {};
      var userid = this.state.user_id;
      parameters['user_id'] = userid;
      parameters['values'] = JSON.stringify(input_values);
      parameters['advanced_payment'] = this.state.formValues['TOTALTTC'];

      axios.put("http://localhost:8000/api/documents/" + this.props.match.params.id, parameters, Config)
          .then(function(result) {
              history.push("/app/user/edit/" + userid + "/3")
          })
          .catch(function(error) {
              toast.error("API injoignable" + error)
          })
  }
  print = () =>{
      document.getElementById("send_contract_section").remove();
      document.getElementById("button_section").remove();
      document.getElementById("print-section").style.marginTop = '-90px';
      document.getElementById("print-section").style.fontSize = '18px';
      var userid = this.state.user_id;
      window.onafterprint = function(e){
          history.push("/app/user/edit/" + userid + "/3")
      };
      window.print();
  }

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Edit Contract"
          breadCrumbParent="Pages"
          breadCrumbActive="Edit Contract"
        />
        <Row>
          <Col className="mb-1 contract-header" md="5" sm="12" id="send_contract_section">
            <InputGroup>
              <Input placeholder="Email" />
              <InputGroupAddon addonType="append">
                <Button.Ripple color="primary" outline>
                  Send Contract
                </Button.Ripple>
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col
            className="d-flex flex-column flex-md-row justify-content-end contract-header mb-1"
            md="7"
            sm="12"
            id="button_section"
          >
            <Button
                className="mr-1 mb-md-0 mb-1"
                color="primary"
                onClick={() => {
                    this.sendForm()
                }}
            >
                Save Contract
            </Button>
              <Button
                  className="mr-1 mb-md-0 mb-1"
                  color="primary"
                  onClick={this.print}
              >
                  <FileText size="15" />
                  <span className="align-middle ml-50">Print</span>
              </Button>
              {/*<Button.Ripple color="primary" outline>*/}
                  {/*<Download size="15" />*/}
                  {/*<span className="align-middle ml-50">Download</span>*/}
              {/*</Button.Ripple>*/}
          </Col>
          <Col className="contract-wrapper" sm="10" style={{marginLeft:'auto', marginRight:'auto',marginTop:'30px'}}>
            <Card className="contract-page" style={{padding:'1.5rem 2.5rem 2.2rem 2.5rem'}} id="print-section">
              <CardBody>
                <Row>
                  <Col md="12" sm="12" >
                      <img src={logo} alt="logo" style={{height:'100px'}}/>
                  </Col>
                </Row>
                <Row style={{marginTop:"30px"}}>
                  <Col md="6" sm="12">
                    <div className="recipient-info" style={{paddingTop:'1.5rem', paddingBottom:'0.5rem'}}>
                        <Row>
                          <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Civilité</h5> </Col>
                          <Col md="7" sm="12"> <h6>{this.ifExist("civility")}</h6> </Col>
                        </Row>
                        <Row>
                          <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Nom</h5> </Col>
                          <Col md="7" sm="12"> <h6>{this.ifExist("last_name")}</h6> </Col>
                        </Row>
                        <Row>
                            <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Prénom</h5> </Col>
                          <Col md="7" sm="12"> <h6>{this.ifExist("first_name")}</h6> </Col>
                        </Row>
                        <Row>
                            <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Date Nais. </h5> </Col>
                          <Col md="7" sm="12"> <h6>{this.ifExist("birth_date")}</h6> </Col>
                        </Row>
                    </div>
                  </Col>
                  <Col md="6" sm="12" className="text-right">
                    <div className="contract-details" style={{paddingTop:'1.5rem', paddingBottom:'0.5rem'}}>
                      <strong>Date du contrat</strong>
                      <h5>{moment().format("DD/MM/YYYY")}</h5>
                    </div>
                  </Col>
                  <Col md="6" sm="12">
                      <div className="recipient-info" style={{paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Statut Martial</h5> </Col>
                              <Col md="7" sm="12"> <h6>{this.ifExist("martial_status")}</h6> </Col>
                          </Row>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Service Nat.</h5> </Col>
                              <Col md="7" sm="12"> <h6>non</h6> </Col>
                          </Row>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Nb d'enfant(s)</h5> </Col>
                              <Col md="7" sm="12"> <h6>{this.ifExist("children_number")}</h6> </Col>
                          </Row>
                      </div>
                  </Col>
                  <Col md="6" sm="12">
                      <div className="recipient-info" style={{paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                          <Row>
                              <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Tel mob</h5> </Col>
                              <Col md="8" sm="12"> <h6>{this.ifExist("mobile_number")}</h6> </Col>
                          </Row>
                          <Row>
                              <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Tel bur</h5> </Col>
                              <Col md="8" sm="12"> <h6>{this.ifExist("office_number")} </h6> </Col>
                          </Row>
                          <Row>
                              <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Mail</h5> </Col>
                              <Col md="8" sm="12"> <h6>{this.ifExist("email")}</h6> </Col>
                          </Row>
                      </div>
                  </Col>
                  <Col md="6" sm="12">
                      <div className="recipient-info" style={{paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Personnel</h5> </Col>
                          </Row>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Adresse</h5> </Col>
                              <Col md="7" sm="12"> <h6>{this.ifExist("personal_address")} </h6> </Col>
                          </Row>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">CP</h5> </Col>
                              <Col md="7" sm="12"> <h6>{this.ifExist("personal_zip_code")} </h6> </Col>
                          </Row>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">VILLE</h5> </Col>
                              <Col md="7" sm="12"> <h6>{this.ifExist("personal_city")} </h6> </Col>
                          </Row>
                          <Row>
                              <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">PAYS</h5> </Col>
                              <Col md="7" sm="12"> <h5>{this.ifExist("personal_country")} </h5> </Col>
                          </Row>
                      </div>
                  </Col>
                    <Col md="6" sm="12">
                        <div className="recipient-info" style={{paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                            <Row>
                                <Col md="5" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Société</h5> </Col>
                            </Row>
                            <Row>
                                <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">Adresse</h5> </Col>
                                <Col md="8" sm="12"> <h6>{this.ifExist("society_address")}</h6> </Col>
                            </Row>
                            <Row>
                                <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">CP</h5> </Col>
                                <Col md="8" sm="12"> <h6>{this.ifExist("society_zip_code")}</h6> </Col>
                            </Row>
                            <Row>
                                <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">VILLE</h5> </Col>
                                <Col md="8" sm="12"> <h6>{this.ifExist("society_city")}</h6> </Col>
                            </Row>
                            <Row>
                                <Col md="4" sm="12" className="contract-caption1-section"> <h5 className="bold-black">PAYS</h5> </Col>
                                <Col md="8" sm="12"> <h6>{this.ifExist("society_country")}</h6> </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <div className="contract-items-table" style={{border:'2px solid #8d8d8d', padding:'30px 20px 230px 20px', marginTop:'30px', height:'800px',marginBottom:'50px'}}>
                    <h5 className="bold-black"><u>NOTES :</u></h5>
                    <h5 style={{marginTop:'20px'}}>
                        {this.ifExist("notes") && this.ifExist("notes").split('\n').map(function(item) {
                            return (<>{item}<br/></>)
                            })
                        }
                    </h5>
                </div>
                  <div className="pt-3 contract-footer"  style={{textAlign:'center'}}>
                      <p>
                          EOR - 36, RUE DE LABORDE 75008 PARIS  - SIRET N° 48488721100023 - APE N° 7022Z
                      </p>
                  </div>
              </CardBody>
            </Card>
              <Card className="contract-page" style={{padding:'1.5rem 2.5rem 2.2rem 2.5rem'}} style={{marginTop:'50px'}}>
                  <CardBody>
                      <Row >
                          <Col md="12" sm="12" >
                              <img src={logo} alt="logo" style={{height:'100px', marginTop:'50px'}}/>
                          </Col>
                      </Row>
                      <div style={{width: '100%', textAlign: 'center', marginTop: '70px'}}>
                          <h1>Contrat de Monsieur {this.ifExist("last_name")}</h1>
                      </div>
                      {/******* table1 ********/}
                      <div style={{display: 'flex'}}>
                          <table className="tableCSS" style={{textAlign: 'left', fontSize: '12px', marginTop: '30px'}}>
                              {/*------- section1 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingTop: '20px'}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c1']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c1')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title1']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div className="bold-black" style={{display: 'inline-block'}}>
                                                  Nb mm:
                                              </div>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text"
                                                      value={this.state.formValues['nb1']}
                                                      onChange={e => this.handleFieldChange("nb1", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                          </Col>
                                      </Row>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent1-1']}
                                      </div>
                                      <div style={{marginLeft: '30px'}} className="contract-subcontent">
                                          {this.state.formValues['subcontent1-2']}
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingTop: '15px'}}>
                                      <Row>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '45px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['nbHT1']} €
                                          </div>
                                      </Row>
                                      <Row style={{marginTop: '5px'}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '45px'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC1']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              {/*------- section2 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c2']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c2')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title2']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{fontWeight: 'bold'}}
                                                      value={this.state.formValues['p2']}
                                                      onChange={e => this.handleFieldChange("p2", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '5px',
                                                  paddingTop: '10px'
                                              }}>
                                                  € HT
                                              </div>
                                          </Col>
                                      </Row>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent2-1']}
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0}}>
                                      <Row style={{verticalAlign: "top", marginTop: '15px'}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '45px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['HT2']} €
                                          </div>
                                      </Row>
                                      <br/>
                                      <br/>
                                  </td>
                              </tr>
                              <tr>
                                  <td colSpan="2" style={{paddingTop: '0'}}>
                                      <Row style={{borderBottom: '2px dashed #827b7b', width: '90%', float: 'right'}}>
                                          <div style={{display: 'inline-block', width: '70%'}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['cnb2']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'cnb2')}
                                                  />
                                              </div>
                                              <div style={{display: 'inline-block', width: '65%'}}>
                                                  {this.state.formValues['subcontent2-2']}
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '30px',
                                                  verticalAlign: 'top',
                                                  marginTop: '5px'
                                              }}>
                                                  Nb:
                                              </div>
                                              <div style={{
                                                  display: 'inline-block',
                                                  paddingTop: '3px',
                                                  verticalAlign: 'top'
                                              }}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text"
                                                      style={{fontWeight: 'bold', height: '20px'}}
                                                      value={this.state.formValues['nb2']}
                                                      onChange={e => this.handleFieldChange("nb2", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                          </div>
                                          <div style={{display: 'inline-block', width: '30%'}}>
                                              <div style={{
                                                  display: 'inline-block',
                                                  marginLeft: '40px',
                                                  width: '55px'
                                              }}></div>
                                              <div style={{
                                                  display: 'inline-block',
                                                  width: '40px',
                                                  textAlign: 'center'
                                              }}> HT
                                              </div>
                                              <div style={{display: 'inline-block'}} className="contract-div">
                                                  {this.state.formValues['nbHT2']} €
                                              </div>
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0, paddingTop: 0}}>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0, paddingTop: 0}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '47px',
                                              textAlign: 'center'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC2']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              {/*------- section3 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c3']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c3')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title3']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{fontWeight: 'bold'}}
                                                      value={this.state.formValues['p3']}
                                                      onChange={e => this.handleFieldChange("p3", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '5px',
                                                  paddingTop: '10px'
                                              }}>
                                                  € HT
                                              </div>
                                          </Col>
                                      </Row>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '47px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['HT3']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              {/*------- section4 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c4']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c4')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title4']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{fontWeight: 'bold'}}
                                                      value={this.state.formValues['p4']}
                                                      onChange={e => this.handleFieldChange("p4", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '5px',
                                                  paddingTop: '10px'
                                              }}>
                                                  € HT
                                              </div>
                                          </Col>
                                      </Row>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent4-1']}
                                      </div>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent4-2']}
                                      </div>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent4-3']}
                                      </div>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent4-4']}
                                      </div>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent4-5']}
                                      </div>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent4-6']}
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0}}>
                                      <Row style={{verticalAlign: "top", marginTop: '8px'}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '47px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['HT4']} €
                                          </div>
                                      </Row>
                                      <Row style={{verticalAlign: "top", marginTop: '3px'}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '47px',
                                              textAlign: 'center'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC4']} €
                                          </div>
                                      </Row>
                                      <br/>
                                      <br/>
                                      <br/>
                                      <br/>
                                      <br/>
                                  </td>
                              </tr>
                              <tr>
                                  <td colSpan="2" style={{paddingTop: '0'}}>
                                      <Row style={{borderBottom: '2px dashed #827b7b', width: '90%', float: 'right'}}>
                                          <div style={{display: 'inline-block', width: '70%'}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['cnb4']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'cnb4')}
                                                  />
                                              </div>
                                              <div style={{display: 'inline-block', width: '65%'}}>
                                                  {this.state.formValues['subcontent4-7']}
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '30px',
                                                  verticalAlign: 'top',
                                                  marginTop: '5px'
                                              }}>
                                                  Nb:
                                              </div>
                                              <div style={{
                                                  display: 'inline-block',
                                                  paddingTop: '3px',
                                                  verticalAlign: 'top'
                                              }}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text"
                                                      style={{fontWeight: 'bold', height: '20px'}}
                                                      value={this.state.formValues['nb4']}
                                                      onChange={e => this.handleFieldChange("nb4", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                          </div>
                                          <div style={{display: 'inline-block', width: '30%'}}>
                                              <div style={{
                                                  display: 'inline-block',
                                                  marginLeft: '40px',
                                                  width: '55px'
                                              }}></div>
                                              <div style={{
                                                  display: 'inline-block',
                                                  width: '40px',
                                                  textAlign: 'center'
                                              }}> HT
                                              </div>
                                              <div style={{display: 'inline-block'}} className="contract-div">
                                                  {this.state.formValues['nbHT4']} €
                                              </div>
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0, paddingTop: 0}}>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0, paddingTop: 0}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '50px',
                                              textAlign: 'center'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC34']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              {/*------- section5 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c5']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c5')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title5']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{fontWeight: 'bold'}}
                                                      value={this.state.formValues['p5']}
                                                      onChange={e => this.handleFieldChange("p5", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '5px',
                                                  paddingTop: '10px'
                                              }}>
                                                  € HT
                                              </div>
                                          </Col>
                                      </Row>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent5-1']}
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '50px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['HT5']} €
                                          </div>
                                      </Row>
                                      <br/>
                                  </td>
                              </tr>
                              <tr>
                                  <td colSpan="2" style={{paddingTop: '0'}}>
                                      <Row style={{borderBottom: '2px dashed #827b7b', width: '90%', float: 'right'}}>
                                          <div style={{display: 'inline-block', width: '70%'}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['cnb5']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'cnb5')}
                                                  />
                                              </div>
                                              <div style={{display: 'inline-block', width: '65%'}}>
                                                  {this.state.formValues['subcontent5-2']}
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '30px',
                                                  verticalAlign: 'top',
                                                  marginTop: '5px'
                                              }}>
                                                  Nb:
                                              </div>
                                              <div style={{
                                                  display: 'inline-block',
                                                  paddingTop: '3px',
                                                  verticalAlign: 'top'
                                              }}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text"
                                                      style={{fontWeight: 'bold', height: '20px'}}
                                                      value={this.state.formValues['nb5']}
                                                      onChange={e => this.handleFieldChange("nb5", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                          </div>
                                          <div style={{display: 'inline-block', width: '30%'}}>
                                              <div style={{
                                                  display: 'inline-block',
                                                  marginLeft: '40px',
                                                  width: '57px'
                                              }}></div>
                                              <div style={{
                                                  display: 'inline-block',
                                                  width: '40px',
                                                  textAlign: 'center'
                                              }}> HT
                                              </div>
                                              <div style={{display: 'inline-block'}} className="contract-div">
                                                  {this.state.formValues['nbHT5']} €
                                              </div>
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0, paddingTop: 0}}>
                                      <div style={{display: 'inline-block', width: '90%'}}>
                                          {this.state.formValues['subcontent5-3']}
                                      </div>
                                      <div style={{display: 'inline-block', marginLeft: '10px',}}>
                                          <LabeledCheckboxMaterialUi label=""
                                                                     checked={this.state.formValues['cc5']}
                                                                     onChange={(event) => this.handleCheckChange(event, 'cc5')}
                                          />
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0, paddingTop: 0}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '50px',
                                              textAlign: 'center'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC5']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              {/*------- section6 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingBottom: 0}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c6']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c6')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title6']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{fontWeight: 'bold'}}
                                                      value={this.state.formValues['p6']}
                                                      onChange={e => this.handleFieldChange("p6", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '5px',
                                                  paddingTop: '10px'
                                              }}>
                                                  € HT
                                              </div>
                                          </Col>
                                      </Row>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent6-1']}
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingBottom: 0}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '50px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['HT6']} €
                                          </div>
                                      </Row>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '52px',
                                              textAlign: 'center'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC6']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                              {/*------- section7 -------*/}
                              <tr>
                                  <td width="75%" style={{paddingBottom: '30px'}}>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div style={{display: 'inline-block', marginLeft: '20px'}}>
                                                  <LabeledCheckboxMaterialUi label=""
                                                                             checked={this.state.formValues['c7']}
                                                                             onChange={(event) => this.handleCheckChange(event, 'c7')}
                                                  />
                                              </div>
                                              <div className="bold-black width-85" style={{display: 'inline-block'}}>
                                                  {this.state.formValues['title7']}
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '-5px'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{fontWeight: 'bold'}}
                                                      value={this.state.formValues['p7']}
                                                      onChange={e => this.handleFieldChange("p7", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{
                                                  display: 'inline-block',
                                                  marginLeft: '5px',
                                                  paddingTop: '10px'
                                              }}>
                                                  € HT
                                              </div>
                                          </Col>
                                      </Row>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['subcontent7-1']}
                                      </div>
                                  </td>
                                  <td width="25%" style={{paddingBottom: '30px'}}>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '52px',
                                              textAlign: 'center'
                                          }}> Total
                                          </div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['HT7']} €
                                          </div>
                                      </Row>
                                      <Row style={{verticalAlign: "top"}}>
                                          <div style={{
                                              display: 'inline-block',
                                              marginLeft: '40px',
                                              width: '53px',
                                              textAlign: 'center'
                                          }}></div>
                                          <div
                                              style={{display: 'inline-block', width: '40px', textAlign: 'center'}}> TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TTC7']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                          </table>
                          <div className="vertical-line" style={{height: '710px'}}></div>
                      </div>
                      {/******* table2 ********/}
                      <div style={{display: 'flex'}}>
                          <table className="tableCSS" style={{textAlign: 'left', fontSize: '12px', marginTop: '30px'}}>
                              <tr>
                                  <td width="75%" style={{paddingTop: '20px', borderRight: '2px solid #8d8d8d'}}>
                                      <div style={{marginLeft: '30px', fontStyle: 'italic'}} className="bold-black">
                                          <u>
                                              {this.state.formValues['table2-title']}
                                          </u>
                                      </div>
                                      <div style={{marginLeft: '30px'}}>
                                          {this.state.formValues['table2-subcontent1']}
                                          {this.state.formValues['table2-subcontent2']}
                                      </div>
                                      <br/>
                                      <br/>
                                  </td>
                                  <td width="25%" style={{paddingTop: '15px', borderLeft: '2px solid #8d8d8d'}}>
                                      <Row>
                                          <div style={{display: 'inline-block', marginLeft: '40px', width: '52px'}}>
                                              TOTAL
                                          </div>
                                          <div style={{display: 'inline-block', width: '40px', textAlign: 'center'}}>
                                              HT
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TOTALHT']} €
                                          </div>
                                      </Row>
                                      <Row style={{marginTop: '5px'}}>
                                          <div
                                              style={{display: 'inline-block', marginLeft: '40px', width: '52px'}}>TVA
                                          </div>
                                          <div style={{display: 'inline-block', width: '40px', textAlign: 'center'}}>
                                              <div style={{display: 'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-text2"
                                                      style={{width: '20px'}}
                                                      value={this.state.formValues['TVAP']}
                                                      onChange={e => this.handleFieldChange("TVAP", e.target.value)}
                                                      required
                                                  />
                                              </div>
                                              <div style={{display: 'inline-block'}}>
                                                  %
                                              </div>
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TVA']} €
                                          </div>
                                      </Row>
                                      <Row style={{marginTop: '5px'}}>
                                          <div
                                              style={{display: 'inline-block', marginLeft: '40px', width: '52px'}}>TOTAL
                                          </div>
                                          <div style={{display: 'inline-block', width: '40px', textAlign: 'center'}}>
                                              TTC
                                          </div>
                                          <div style={{display: 'inline-block'}} className="contract-div">
                                              {this.state.formValues['TOTALTTC']} €
                                          </div>
                                      </Row>
                                  </td>
                              </tr>
                          </table>
                      </div>
                      {/******* table3 ********/}
                      <div style={{display: 'flex'}} style={{marginBottom:'130px'}}>
                          <table className="tableCSS" style={{textAlign: 'left', fontSize: '12px', marginTop: '30px'}}>
                              <tr>
                                  <td width="75%" style={{paddingTop: '20px', borderRight: '2px solid #8d8d8d'}}>
                                      <div style={{marginLeft: '30px', fontStyle: 'italic'}} className="bold-black">
                                          <u>
                                              {this.state.formValues['table3-title']}
                                          </u>
                                      </div>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div className="bold-black" style={{display:'inline-block',marginLeft:'30px',width:'50%'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-subcontent"
                                                      value={this.state.formValues['table3-subcontent1']}
                                                      onChange={e => this.handleFieldChange("table3-subcontent1", e.target.value )}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{display:'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-subcontent"
                                                      value={this.state.formValues['fp1']}
                                                      onChange={e => this.handleFieldChange("fp1", e.target.value )}
                                                      required
                                                      style={{width:"45px"}}
                                                  />
                                              </div>
                                              <div className="bold-black" style={{display:'inline-block',}}>
                                                  %
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '5px'}}>
                                              <div style={{display: 'inline-block'}} className="contract-div" style={{width:'80px'}}>
                                                  {this.state.formValues['FINAL75']} €
                                              </div>
                                          </Col>
                                      </Row>
                                      <Row>
                                          <Col md="9" sm="12" style={{paddingRight: 0}}>
                                              <div className="bold-black" style={{display:'inline-block',marginLeft:'30px',width:'50%'}}>
                                                  <Input
                                                      type="text"
                                                      className="contract-subcontent"
                                                      value={this.state.formValues['table3-subcontent2']}
                                                      onChange={e => this.handleFieldChange("table3-subcontent2", e.target.value )}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{display:'inline-block'}}>
                                                  <Input
                                                      type="text"
                                                      style={{width:"45px"}}
                                                      className="contract-subcontent"
                                                      value={this.state.formValues['fp2']}
                                                      onChange={e => this.handleFieldChange("fp2", e.target.value )}
                                                      required
                                                  />
                                              </div>
                                              <div className="bold-black" style={{display:'inline-block',}}>
                                                  %
                                              </div>
                                          </Col>
                                          <Col md="3" sm="12" style={{paddingLeft: 0, marginTop: '5px'}}>
                                              <div style={{display: 'inline-block'}} className="contract-div" style={{width:'80px'}}>
                                                  {this.state.formValues['FINAL25']} €
                                              </div>
                                          </Col>
                                      </Row>
                                  </td>
                                  <td width="25%" style={{paddingTop: '15px', borderLeft: '2px solid #8d8d8d'}}>
                                      <div style={{fontStyle: 'italic'}} className="bold-black"><u>Date & signature du
                                          client:</u></div>
                                      <br/>
                                      <br/>
                                      <br/>
                                  </td>
                              </tr>
                          </table>
                      </div>
                      <div className="pt-3 contract-footer" style={{marginBottom:'100px', textAlign:'center'}}>
                          <p>
                              EOR - 36, RUE DE LABORDE 75008 PARIS  - SIRET N° 48488721100023 - APE N° 7022Z
                          </p>
                      </div>
                  </CardBody>
              </Card>
              <Card className="contract-page" style={{padding:'1.5rem 2.5rem 2.2rem 2.5rem'}}>
                  <CardBody>
                      <Row>
                          <Col md="12" sm="12" >
                              <img src={logo} alt="logo" style={{height:'100px'}}/>
                          </Col>
                      </Row>
                      <div className="text-left pt-3 contract-footer">
                          <div style={{textAlign:'center'}}><h1>Conditions Générales de ventes de {this.ifExist("first_name")} {this.ifExist("last_name")}</h1></div>
                          <p>
                              Le Client dispose de 2 jours après la date figurant sur le Contrat de Prestations Retraite pour annuler sa commande auprès d’E.O.R.
                              Passé ce délai, et après avoir reçu les premières correspondances destinées aux Caisses de Retraite, le dossier est considéré comme engagé et le Client ne peut plus interrompre le Contrat de Prestations Retraite conclu : les premières correspondances étant décisives pour la présentation et les orientations d'un dossier.
                          </p><p>
                          Chaque prestation correspond à une mission précise décrite sur le Contrat de Prestation Retraite. Toute intervention de conseil de la part d’E.O.R qui sort du cadre décrit par le présent contrat fera l’objet d’un devis et d’une facturation complémentaire.
                      </p><p>
                          E.O.R effectue pour le compte de ses Clients toutes les démarches et opérations qu'elle juge utile pour le bon développement de la mission qui lui est confiée, et ce, jusqu'au terme de cette dernière.
                          La prestation "Montage Départ en Retraite Anticipé" est indépendante de l'Audit Retraite et ne permet donc pas au client de bénéficier d'une reconstitution de carrière complète au sens de l'Audit Retraite, elle n'assure pas non plus le Traitement des Formalités de Départ en Retraite.
                          La prestation "Traitement des Formalités de Départ en Retraite" n'inclut pas les recours éventuels et ultérieurs à effectuer envers les Caisses de Retraite en cas d'erreurs de ces dernières.
                      </p><p>
                          Le Client doit impérativement fournir les notifications de versement des pensions de la part des Caisses de Retraite dès qu'il les reçoit, afin qu’EOR puisse intervenir avant le délai de recours imposé par les Caisses de Retraite qui est de 2 mois, si une anomalie est constatée. Faute de quoi la responsabilité d’EOR ne saurait être engagée
                      </p><p>
                          Les actions effectuées par EOR auprès des Caisses de Retraite sont totalement transparentes et doivent être signées par le Client avant d'être transmises aux Caisses de Retraite. EOR n'est pas responsable des modifications que le client pourrait effectuer sur les correspondances destinées aux Caisses de Retraite, ni des interventions téléphoniques effectuées par le client directement auprès des Caisses de Retraite, sans en référer à EOR.
                      </p><p>
                          Les honoraires perçus par EOR concernent les actions entreprises à l'égard des caisses privées et ne concernent pas le Régime Général de la Sécurité Sociale (CNAV, CNAVTS, CRAM), EOR donnant ses conseils gratuitement et à titre indicatif envers cette dernière Institution.
                          EOR agit en fonction des informations et des documents fournis par le client.
                      </p><p>
                          EOR n'est pas responsable des délais imposés par les Caisses de Retraite, et effectue ses relances, si elle le juge utile pour le dossier, selon le délai usuel de deux mois sans réponse de la part d'une Caisse de Retraite.
                          Pour toutes les contestations relatives aux prestations réalisées par EOR et à l’application ou à l’interprétation des présentes Conditions Générale de Vente, seul sera compétent le Tribunal de Commerce de Paris pour les personnes morales, et le Tribunal d’Instance de Paris pour les personnes physiques.
                      </p><p>
                          Toutes les prestations fournies par E.O.R sont soumises à la loi française.
                      </p><p>
                          A la fin de la prestation, le client est tenu de récupérer tous les documents
                          le concernant et ceux produits durant la mission faute de quoi le cabinet se
                          réserve le droit de détruire les pièces du dossier après 6 mois de conservation
                          dans ses locaux.
                      </p>
                      </div>
                      <div className="pt-3 contract-footer" style={{textAlign:'center',marginTop:'350px'}}>
                          <p>
                              EOR - 36, RUE DE LABORDE 75008 PARIS  - SIRET N° 48488721100023 - APE N° 7022Z
                          </p>
                      </div>
                  </CardBody>
              </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default EditContract
