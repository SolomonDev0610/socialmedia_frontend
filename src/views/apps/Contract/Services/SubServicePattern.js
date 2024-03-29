import React from "react"
import {Button} from "reactstrap"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
  Spinner
} from "reactstrap"
import axios from "axios"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2,
  ChevronDown,
  RotateCw,
  X, UserPlus, PlusSquare, Home, FolderPlus
} from "react-feather"
import classnames from "classnames"
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "react-moment";
import {toast} from "react-toastify";
class SubServicePattern extends React.Component {
  state = {
    defaultAlert : false,
    confirmAlert : false,
    cancelAlert : false,
    IdToDelete: 0,
    rowData: null,
    pageSize: 20,
    isVisible: true,
    reload: false,
    collapse: false,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "Nom de la sous-prestation",
        field: "name",
        filter: true,
        editable: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 400,
        pinned: window.innerWidth > 992 ? "left" : false
      },
      {
        headerName: "€ HT",
        field: "value",
        width: 150,
        filter: true,
        editable: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: "Nombre",
        field: "value1",
        width: 150,
        filter: true,
        editable: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: "Total HT",
        field: "total_ht",
        editable: true,
        filter: true,
        width: 150
      },
      {
        headerName: "Description",
        field: "description",
        filter: true,
        editable: true,
        width: 400,
      },
      {
        headerName: "Total TTC",
        field: "total_ttc",
        editable: true,
        filter: true,
        width: 150
      },
      {
        headerName: "Actions",
        field: "transactions",
        width: 150,
        cellRendererFramework: params => {
          return (
              <div className="actions cursor-pointer">
                <Trash2
                    size={15}
                    onClick={() => {
                      this.handleAlert("defaultAlert", true, params.data.id)
                    }}
                />
              </div>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    const Config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }

    await axios.get(global.config.server_url + "/services/template", Config).then(response => {
      let bufferRowData = response.data
      let rowData = []
      let id = this.props.match.params.id

      bufferRowData.forEach(function(item){
        if (item.parent_id == id)
          rowData.push(item);
      });

      this.setState({ rowData })
    })
    //axios.get("/api/aggrid/data").then(response => {
    //  let rowData = response.data.data
     // JSON.stringify(rowData)
     // this.setState({ rowData })
    //})
  }

  deleteUser(id){
    const Config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    axios.delete(global.config.server_url + "/services/" + id, Config).then(response => {})
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  onCellEditingStopped = params => {
    const Config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    console.log(params)
    axios.put(global.config.server_url + "/services/" + params.data.id,  {
      name: params.data.name,
      description: params.data.description,
      variable: params.data.variable,
      value: params.data.value,
      variable1: params.data.variable1,
      value1: params.data.value1,
      total_ht: params.data.total_ht,
      total_ttc: params.data.total_ttc,
      parent_id: params.data.parent_id,
      tva: params.data.tva,
      document_id: 0,
      status: "template"
    }, Config)
        .then(function(result) {
          console.log(result)
        })
        .catch(function(error) {
          toast.error("API injoignable")
        })
  }

  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column)
    var modelObj = null
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val
      }
    }
    filter.setModel(modelObj)
    this.gridApi.onFilterChanged()
  }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val))
      this.setState({
        pageSize: val
      })
    }
  }
  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val)
    this.setState({
      searchVal: val
    })
  }

  refreshCard = () => {
    this.setState({ reload: true })
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All"
      })
    }, 500)
  }

  toggleCollapse = () => {
    this.setState(state => ({ collapse: !state.collapse }))
  }
  onEntered = () => {
    this.setState({ status: "Opened" })
  }
  onEntering = () => {
    this.setState({ status: "Opening..." })
  }

  onEntered = () => {
    this.setState({ status: "Opened" })
  }
  onExiting = () => {
    this.setState({ status: "Closing..." })
  }
  onExited = () => {
    this.setState({ status: "Closed" })
  }
  removeCard = () => {
    this.setState({ isVisible: false })
  }

  handleAlert = (state, value, id) => {
    this.setState({ [state] : value })
    if (id != 0)
      this.setState({ IdToDelete : id })
    if (state === "confirmAlert" && value === true) {
      this.deleteUser(this.state.IdToDelete)
      var SelectedData = this.gridApi.getSelectedRows();
      this.gridApi.updateRowData({remove: SelectedData})
    }
  }

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state
    return (
    <div>
      <SweetAlert title="Êtes vous sûrs?"
                  warning
                  show={this.state.defaultAlert}
                  showCancel
                  reverseButtons
                  cancelBtnBsStyle="danger"
                  confirmBtnText="Oui, supprimer"
                  cancelBtnText="Annuler"
                  onConfirm={() => {
                    this.handleAlert("basicAlert", false, 0)
                    this.handleAlert("confirmAlert", true, 0)
                  }}
                  onCancel={() => {
                    this.handleAlert("basicAlert", false, 0)
                    this.handleAlert("cancelAlert", true, 0)
                  }}
      >
        Vous ne pourrez pas revenir en arrière
      </SweetAlert>

      <SweetAlert success title="Supprimé!"
                  confirmBtnBsStyle="success"
                  show={this.state.confirmAlert}
                  onConfirm={() => {
                    this.handleAlert("defaultAlert", false, 0)
                    this.handleAlert("confirmAlert", false, 0)
                  }}
      >
        <p className="sweet-alert-text">Your file has been deleted.</p>
      </SweetAlert>

      <SweetAlert error title="Annulé!"
                  confirmBtnBsStyle="success"
                  show={this.state.cancelAlert}
                  onConfirm={() =>{
                    this.handleAlert("defaultAlert", false, 0)
                    this.handleAlert("cancelAlert", false, 0)
                  }}
      >
        <p className="sweet-alert-text">
          L'action est annulé
        </p>
      </SweetAlert>
      <Row className="app-user-list">
        <Col sm="12">
          <Card
            className={classnames("card-action card-reload", {
              "d-none": this.state.isVisible === false,
              "card-collapsed": this.state.status === "Closed",
              closing: this.state.status === "Closing...",
              opening: this.state.status === "Opening...",
              refreshing: this.state.reload
            })}
          >
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <div className="actions">
                <ChevronDown
                  className="collapse-icon mr-50"
                  size={15}
                  onClick={this.toggleCollapse}
                />
                <RotateCw
                  className="mr-50"
                  size={15}
                  onClick={() => {
                    this.refreshCard()
                    this.gridApi.setFilterModel(null)
                  }}
                />
                <X size={15} onClick={this.removeCard} />
              </div>
            </CardHeader>
            <Collapse
              isOpen={this.state.collapse}
              onExited={this.onExited}
              onEntered={this.onEntered}
              onExiting={this.onExiting}
              onEntering={this.onEntering}
            >
              <CardBody>
                {this.state.reload ? (
                  <Spinner color="primary" className="reload-spinner" />
                ) : (
                  ""
                )}
                <Row>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-0">
                      <Label for="role">Role</Label>
                      <Input
                        type="select"
                        name="role"
                        id="role"
                        value={this.state.role}
                        onChange={e => {
                          this.setState(
                            {
                              role: e.target.value
                            },
                            () =>
                              this.filterData(
                                "role",
                                this.state.role.toLowerCase()
                              )
                          )
                        }}
                      >
                        <option value="All">All</option>
                        <option value="User">User</option>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-0">
                      <Label for="status">Status</Label>
                      <Input
                        type="select"
                        name="status"
                        id="status"
                        value={this.state.selectStatus}
                        onChange={e => {
                          this.setState(
                            {
                              selectStatus: e.target.value
                            },
                            () =>
                              this.filterData(
                                "status",
                                this.state.selectStatus.toLowerCase()
                              )
                          )
                        }}
                      >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Blocked">Blocked</option>
                        <option value="Deactivated">Deactivated</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-0">
                      <Label for="verified">Verified</Label>
                      <Input
                        type="select"
                        name="verified"
                        id="verified"
                        value={this.state.verified}
                        onChange={e => {
                          this.setState(
                            {
                              verified: e.target.value
                            },
                            () =>
                              this.filterData(
                                "is_verified",
                                this.state.verified.toLowerCase()
                              )
                          )
                        }}
                      >
                        <option value="All">All</option>
                        <option value="True">True</option>
                        <option value="False">False</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="3" md="6" sm="12">
                    <FormGroup className="mb-0">
                      <Label for="department">Department</Label>
                      <Input
                        type="select"
                        name="department"
                        id="department"
                        value={this.state.department}
                        onChange={e => {
                          this.setState(
                            {
                              department: e.target.value
                            },
                            () =>
                              this.filterData(
                                "department",
                                this.state.department.toLowerCase()
                              )
                          )
                        }}
                      >
                        <option value="All">All</option>
                        <option value="Sales">Sales</option>
                        <option value="Development">Development</option>
                        <option value="Management">Management</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Collapse>
          </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="ag-theme-material ag-grid-table">
                <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                  <div className="sort-dropdown">
                    <UncontrolledDropdown className="ag-dropdown p-1">
                      <DropdownToggle tag="div">
                        1 - {pageSize} of 150
                        <ChevronDown className="ml-50" size={15} />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(20)}
                        >
                          20
                        </DropdownItem>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(50)}
                        >
                          50
                        </DropdownItem>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(100)}
                        >
                          100
                        </DropdownItem>
                        <DropdownItem
                          tag="div"
                          onClick={() => this.filterSize(150)}
                        >
                          150
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  <div className="filter-actions d-flex">
                    <Input
                      className="w-50 mr-1 mb-1 mb-sm-0"
                      type="text"
                      placeholder="search..."
                      onChange={e => this.updateSearchQuery(e.target.value)}
                      value={this.state.searchVal}
                    />
                    <div>
                      <Button.Ripple className="mr-1 mb-1" outline color="primary" onClick={() => history.push("/app/user/createSubService/" + this.props.match.params.id)}>
                        <PlusSquare size={15} />
                      </Button.Ripple>
                    </div>
                    <div className="dropdown mr-1 mb-1 d-inline-block">
                      <UncontrolledButtonDropdown>
                        <DropdownToggle color="primary" caret>
                          Actions
                          <ChevronDown size={15} />
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem tag="a">
                            <Home size={15} />
                            <span className="align-middle ml-50">Exemple d'action</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </div>
                </div>
                {this.state.rowData !== null ? (
                  <ContextLayout.Consumer>
                    {context => (
                      <AgGridReact
                        gridOptions={{}}
                        rowSelection="multiple"
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={this.onGridReady}
                        colResizeDefault={"shift"}
                        animateRows={true}
                        floatingFilter={true}
                        pagination={true}
                        pivotPanelShow="always"
                        paginationPageSize={pageSize}
                        resizable={true}
                        onCellEditingStopped={this.onCellEditingStopped}
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
    )
  }
}

export default SubServicePattern
