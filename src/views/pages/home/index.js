import React from "react"
import { Row, Col, Button, Spinner } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ProfileHeader from "./ProfileHeader"
import AboutCard from "./AboutCard"
import SuggestedPages from "./SuggestedPages"
import Posts from "./Posts"
import PostCreator from "./PostCreator"

import "../../../assets/scss/pages/users-profile.scss"
import postModel from "../../../firebase/postModel";
import axios from "axios";

class Index extends React.Component {
  state = {
    isLoading: false,
    earned_score:''
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

  async componentDidMount() {

    const Config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
    var user_id = localStorage.getItem('user_id');
    axios.get(global.config.server_url + "/getUserInfo?user_id=" + user_id, Config).then(response => {
      this.setState({earned_score: response.data.earned_score});
    })
    // const Config = {
    //     headers: {
    //         Authorization: "Bearer " + localStorage.getItem("token")
    //     }
    // }
    // await axios.get(global.config.server_url + "/posts", Config).then(response => {
    //     console.log("------ this is init data -------");
    //     console.log(response.data);
    //     this.setState({ posts: response.data })
    // })
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
                <AboutCard earned_score={this.state.earned_score}/>
                {/*<SuggestedPages />*/}
              </Col>
              <Col lg="9" md="12">
                <PostCreator />
                <Posts filter={this.props.match.params.filter}/>
              </Col>
              {/*<Col lg="3" md="12">*/}
              {/*  <LatestPhotos />*/}
              {/*  <Suggestions />*/}
              {/*</Col>*/}
            </Row>
            {/*<Row>*/}
            {/*  <Col sm="12" className="text-center">*/}
            {/*    <Button.Ripple*/}
            {/*      color="primary"*/}
            {/*      onClick={this.toggleLoading}*/}
            {/*      className={`${*/}
            {/*        this.state.isLoading ? "btn-loading" : ""*/}
            {/*      } btn-load`}*/}
            {/*    >*/}
            {/*      <Spinner color="primary" />*/}
            {/*      Load More*/}
            {/*    </Button.Ripple>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Index
