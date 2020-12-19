import React from "react"
import { Row, Col, Button, Spinner } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ProfileHeader from "./ProfileHeader"
import AboutCard from "./AboutCard"
import SuggestedPages from "./SuggestedPages"
import Posts from "./Posts"
import PostCreator from "./PostCreator"

import "../../../assets/scss/pages/users-profile.scss"

class Index extends React.Component {
  state = {
    isLoading: false
  }

  toggleLoading = () => {
    this.setState({
      isLoading: true
    })

    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 2000)
  }

  render() {
    return (
      <React.Fragment>
        {/*<Breadcrumbs*/}
        {/*  breadCrumbTitle="Home"*/}
        {/*  breadCrumbParent="posts"*/}
        {/*/>*/}
        <div id="user-profile">
          {/*<Row>*/}
          {/*  <Col sm="12">*/}
          {/*    <ProfileHeader />*/}
          {/*  </Col>*/}
          {/*</Row>*/}
          <div id="profile-info">
            <Row>
              <Col lg="3" md="12">
                <AboutCard />
                <SuggestedPages />
              </Col>
              <Col lg="9" md="12">
                <PostCreator />
                <Posts />
              </Col>
              {/*<Col lg="3" md="12">*/}
              {/*  <LatestPhotos />*/}
              {/*  <Suggestions />*/}
              {/*</Col>*/}
            </Row>
            <Row>
              <Col sm="12" className="text-center">
                <Button.Ripple
                  color="primary"
                  onClick={this.toggleLoading}
                  className={`${
                    this.state.isLoading ? "btn-loading" : ""
                  } btn-load`}
                >
                  <Spinner color="primary" />
                  Load More
                </Button.Ripple>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Index
