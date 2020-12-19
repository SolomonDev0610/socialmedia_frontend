import React from "react"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { MoreHorizontal, Facebook, Instagram, Twitter } from "react-feather"
import republican_img from "../../../assets/img/logo/republican_logo.png";
import democratic_img from "../../../assets/img/logo/democratic_logo.png";
class AboutCard extends React.Component {

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <MoreHorizontal size={15} className="cursor-pointer" />
        </CardHeader>
        <CardBody>
          <p>
            {localStorage.getItem('username')}
          </p>
          <div className="mt-1">
            <h6 className="mb-0">Political Party:</h6>
            <p>{localStorage.getItem("political_party") == 1?"Republican":"Democrat"}</p>
          </div>
          <div className="mt-1">
            <h6 className="mb-0">Total Earned Points:</h6>
            <p>5012</p>
          </div>
          <div style={{width:'100%',textAlign:'center'}}>
            <img
                height="100" width="100"
                src={localStorage.getItem("political_party") == 1?republican_img:democratic_img}
                alt="CoverImg"
                className="img-fluid bg-cover rounded-0"
            />
          </div>
        </CardBody>
      </Card>
    )
  }
}
export default AboutCard
