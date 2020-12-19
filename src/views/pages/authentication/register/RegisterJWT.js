import React from "react"
import { Form, FormGroup, Input, Label, Button,CustomInput } from "reactstrap"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../../redux/actions/auth/registerActions"
import { history } from "../../../../history"
import Select from "react-select";

class RegisterJWT extends React.Component {
  state = {
    username: "",
    political_party:1,
    password: "",
    first_name: "",
    last_name: "",
    confirmPass: ""
  }

  handleRegister = e => {
    e.preventDefault()
    this.props.signupWithJWT(
      this.state.username,
      this.state.password,
      this.state.political_party,
    )
  }

  render() {
    return (
      <Form action="/pages/home" onSubmit={this.handleRegister}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Username"
            required
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <Label>Username</Label>
        </FormGroup>
          <FormGroup className="form-label-group">
              <CustomInput type="select" name="role" required id="role" onChange={e => this.setState({political_party: e.target.value})}>
                  <option value="1">Republican</option>
                  <option value="2">Democratic</option>
              </CustomInput>
              <Label>Political Party</Label>
          </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Password"
            required
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          <Label>Password</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirm Password"
            required
            value={this.state.confirmPass}
            onChange={e => this.setState({ confirmPass: e.target.value })}
          />
          <Label>Confirm Password</Label>
        </FormGroup>
        <FormGroup>
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label=" I accept the terms & conditions."
            defaultChecked={true}
          />
        </FormGroup>
        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login")
            }}
          >
            Login
          </Button.Ripple>
          <Button.Ripple color="primary" type="submit">
            Register
          </Button.Ripple>
        </div>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.register
  }
}
export default connect(mapStateToProps, { signupWithJWT })(RegisterJWT)
