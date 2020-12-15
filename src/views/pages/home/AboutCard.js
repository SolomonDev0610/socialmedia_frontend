import React from "react"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { MoreHorizontal, Facebook, Instagram, Twitter } from "react-feather"
const political_party = localStorage.getItem("political_party");
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
            <p>{political_party == 1?"Republican":"Democrat"}</p>
          </div>
          <div className="mt-1">
            <h6 className="mb-0">Total Earned Point:</h6>
            <p>5012</p>
          </div>
          <div className="mt-1">
            <Button color="primary" size="sm" className="btn-icon mr-25 p-25">
              <Facebook />
            </Button>
            <Button color="primary" size="sm" className="btn-icon mr-25 p-25">
              <Twitter />
            </Button>
            <Button color="primary" size="sm" className="btn-icon p-25">
              <Instagram />
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }
}
export default AboutCard
