import React from "react"
import {
    Card,
    CardBody,
    UncontrolledTooltip,
    Input,
    Label,
    Button
} from "reactstrap"
import {Heart, MessageSquare} from "react-feather"
import profileImg from "../../../assets/img/profile/user-uploads/user-01.jpg"
import postImg1 from "../../../assets/img/profile/post-media/2.jpg"
import postImg2 from "../../../assets/img/profile/post-media/25.jpg"
import person1 from "../../../assets/img/portrait/small/avatar-s-1.jpg"
import person2 from "../../../assets/img/portrait/small/avatar-s-2.jpg"
import person3 from "../../../assets/img/portrait/small/avatar-s-3.jpg"
import person4 from "../../../assets/img/portrait/small/avatar-s-4.jpg"
import person5 from "../../../assets/img/portrait/small/avatar-s-5.jpg"
import person6 from "../../../assets/img/portrait/small/avatar-s-6.jpg"
import person7 from "../../../assets/img/portrait/small/avatar-s-7.jpg"
import axios from "axios";
import {toast} from "react-toastify";
import {history} from "../../../history";

class Posts extends React.Component {
    state = {
        title : "",
        contents : "",
    }

    onCreatePost = e => {
        e.preventDefault();
        this.submitPost(this.state);
    }
    submitPost (info){
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.post(global.config.server_url + "/posts", {
            title: info.title,
            contents: info.contents,
            user_id: localStorage.getItem("user_id"),
            political_party_id: localStorage.getItem("political_party"),
        }, Config)
        .then(function(result) {
                toast.info("New Post Created!");
                history.push("/pages/home");
       })
       .catch(function(error) {
                console.log(error);
                toast.error("Server process Fail");
       })
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <fieldset className="form-label-group mb-50" style={{marginTop: '10px'}}>
                            <Input
                                type="textarea"
                                rows="2"
                                placeholder="State your political opinion here!"
                                id="title"
                                onChange={e => this.setState({title: e.target.value })}
                            />
                            <Label for="add-comment">Title</Label>
                        </fieldset>
                        <fieldset className="form-label-group mb-50" style={{marginTop: '30px'}}>
                            <Input
                                type="textarea"
                                rows="5"
                                placeholder="Brief justification for your opinion (optional)"
                                id="content"
                                onChange={e => this.setState({contents: e.target.value })}
                            />
                            <Label for="add-comment">Content</Label>
                        </fieldset>
                        <Button.Ripple size="sm" color="primary" onClick={this.onCreatePost}>
                            Post
                        </Button.Ripple>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}

export default Posts
