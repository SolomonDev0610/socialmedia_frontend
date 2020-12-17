import React from "react"
import {
    Card,
    CardBody,
    UncontrolledTooltip,
    Input,
    Label,
    Button
} from "reactstrap"
import {Heart, ThumbsDown, ThumbsUp, CornerDownRight} from "react-feather"
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
import {dateConvert2} from "../../../helpers/dateConvert"
import defaultImage from "../../../../src/assets/img/profile/default_profile.jpg"
import {toast} from "react-toastify";
import {history} from "../../../history";

class Posts extends React.Component {
    state = {
        posts: [],
        comment : "",
    }

    onCreateComment = e => {
        e.preventDefault();
        this.submitComment(this.state);
    }
    submitComment (info){
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.post(global.config.server_url + "/comments", {
            title: info.title,
            contents: info.contents,
            user_id: localStorage.getItem("user_id"),
            political_party_id: localStorage.getItem("political_party"),
        }, Config)
            .then(function(result) {
                toast.info("New Comment Created Successfully!");
                history.push("/pages/home");
            })
            .catch(function(error) {
                console.log(error);
                toast.error("Server process Fail");
            })
    }

    async componentDidMount() {
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }

        await axios.get(global.config.server_url + "/posts", Config).then(response => {
            console.log(response.data);
            this.setState({ posts: response.data })
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.posts.map((post) => (
                    <Card style={{background: '#ffcccc'}}>
                        <CardBody>
                            <div className="d-flex justify-content-start align-items-center mb-1">
                                <div className="avatar mr-1">
                                    <img
                                        src={post.user.image? post.user.image: defaultImage}
                                        alt="avtar img holder"
                                        height="45"
                                        width="45"
                                    />
                                </div>
                                <div className="user-page-info">
                                    <p className="mb-0">{post.user.username}</p>
                                    <span className="font-small-2">{dateConvert2(post.created_at)}</span>
                                </div>
                                <div className="ml-auto user-like">
                                    <Heart fill="#EA5455" stroke="#EA5455"/>
                                </div>
                            </div>
                            <h3>
                                {post.title}
                            </h3>
                            <div style={{textAlign: 'center', marginBottom: '20px', marginTop: '15px'}}>
                                <div style={{
                                    display: 'inline-block',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    paddingTop: '10px',
                                    height: '40px',
                                    width: '45%',
                                    background: 'red'
                                }}>45%
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    paddingTop: '10px',
                                    height: '40px',
                                    width: '55%',
                                    background: 'blue'
                                }}>55%
                                </div>
                            </div>
                            <h5>
                                {post.contents}
                            </h5>
                            <fieldset className="form-label-group mb-50 mt-2">
                                <Input
                                    type="textarea"
                                    rows="3"
                                    placeholder="Add Comment"
                                    id="add-comment"
                                    style={{background: '#fde0e0', borderColor: '#f5c2c2'}}
                                />
                                <Label for="add-comment">Add Comment</Label>
                            </fieldset>
                            <Button.Ripple size="sm" color="primary" className="mb-2" onClick={this.onCreateComment}>
                                Post Comment
                            </Button.Ripple>
                            <div className="d-flex justify-content-start align-items-center mb-1">
                                <div className="d-flex align-items-center">
                                    <Heart size={16} className="mr-50"/>
                                    {post.total_point}
                                </div>
                                <div className="ml-2">
                                    <ul className="list-unstyled users-list m-0 d-flex">
                                        {post.comments.map((comment) => (
                                            <li className="avatar pull-up">
                                                <img
                                                    src={comment.user.image?comment.user.image:defaultImage}
                                                    alt="avatar"
                                                    height="30"
                                                    width="30"
                                                    id="avatar13"
                                                />
                                                <UncontrolledTooltip placement="bottom" target="avatar13">
                                                    comment.user.username
                                                </UncontrolledTooltip>
                                            </li>
                                            ))}
                                    </ul>
                                </div>
                                <p className="ml-auto">
                                    <ThumbsUp size={22} className="mr-50"/>
                                    77
                                </p>
                            </div>
                            {post.comments.map((comment) => (
                            <div className="d-flex justify-content-start align-items-center mb-1">
                                <div className="avatar mr-50">
                                    <img src={comment.user.image?comment.user.image:defaultImage} alt="Avatar" height="30" width="30"/>
                                </div>
                                <div className="user-page-info">
                                    <h6 className="mb-0">{comment.user.username}</h6>
                                    <span className="font-small-2">
                                      {comment.comment}
                                    </span>
                                    <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                    {comment.point}
                                    <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                                </div>
                            </div>
                            ))}
                        </CardBody>
                    </Card>
                ))}
                <Card style={{background: '#c1c1ff'}}>
                    <CardBody>
                        <div className="d-flex justify-content-start align-items-center mb-1">
                            <div className="avatar mr-1">
                                <img
                                    src={profileImg}
                                    alt="avtar img holder"
                                    height="45"
                                    width="45"
                                />
                            </div>
                            <div className="user-page-info">
                                <p className="mb-0">Leeanna Alvord</p>
                                <span className="font-small-2">12 Dec 2018 at 1:16 AM</span>
                            </div>
                            <div className="ml-auto user-like">
                                <Heart fill="#EA5455" stroke="#EA5455"/>
                            </div>
                        </div>
                        <h3>
                            The wall on the southern border was unnecessary
                        </h3>
                        <div style={{textAlign: 'center', marginBottom: '20px', marginTop: '15px'}}>
                            <div style={{
                                display: 'inline-block',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                paddingTop: '10px',
                                height: '40px',
                                width: '45%',
                                background: 'red'
                            }}>45%
                            </div>
                            <div style={{
                                display: 'inline-block',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                paddingTop: '10px',
                                height: '40px',
                                width: '55%',
                                background: 'blue'
                            }}>55%
                            </div>
                        </div>
                        <h5>
                            Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration
                            has declined since 2007.
                        </h5>
                        <fieldset className="form-label-group mb-50 mt-2">
                            <Input
                                type="textarea"
                                rows="3"
                                placeholder="Add Comment"
                                id="add-comment"
                                style={{background: '#e0e0f8', borderColor: '#c1c1ff'}}
                            />
                            <Label for="add-comment">Add Comment</Label>
                        </fieldset>
                        <Button.Ripple size="sm" color="primary" className="mb-2">
                            Post Comment
                        </Button.Ripple>
                        <div className="d-flex justify-content-start align-items-center mb-1">
                            <div className="d-flex align-items-center">
                                <Heart size={16} className="mr-50"/>
                                145
                            </div>
                            <div className="ml-2">
                                <ul className="list-unstyled users-list m-0 d-flex">
                                    <li className="avatar pull-up">
                                        <img
                                            src={person1}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar13"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar13">
                                            Lai Lewandowski
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person2}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar14"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar14">
                                            Elicia Rieske
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person3}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar15"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar15">
                                            Alberto Glotzbach
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person4}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar16"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar16">
                                            George Nordic
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person5}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar17"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar17">
                                            Vinnie Mostowy
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="d-flex align-items-center pl-50">
                                        <span className="align-middle">+140 more</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="ml-auto">
                                <ThumbsUp size={22} className="mr-50"/>
                                77
                            </p>
                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1">
                            <div className="avatar mr-50">
                                <img src={person6} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Kitty Allanson</h6>
                                <span className="font-small-2">
                  orthoplumbate morningtide naphthaline exarteritis
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                15
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '20px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person2} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Sonata Allanson</h6>
                                <span className="font-small-2">
                  orthoplumbate morningtide naphthaline exarteritis
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                25
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '20px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person5} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Gilbert Jordan</h6>
                                <span className="font-small-2">
                  Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration has declined since 2007.
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                46
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '60px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person6} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Sonya Alex</h6>
                                <span className="font-small-2">
                  Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration has declined since 2007.
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                46
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '60px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person3} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Mario Jordan</h6>
                                <span className="font-small-2">
                  Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration has declined since 2007.
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                46
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '20px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person1} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">John Star</h6>
                                <span className="font-small-2">
                  orthoplumbate morningtide naphthaline exarteritis
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                35
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-2">
                            <div className="avatar mr-50">
                                <img src={person7} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Jeanie Bulgrin</h6>
                                <span className="font-small-2">
                  blockiness pandemy metaxylene speckle coppy
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                12
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card style={{background: '#c1c1ff'}}>
                    <CardBody>
                        <div className="d-flex justify-content-start align-items-center mb-1">
                            <div className="avatar mr-1">
                                <img
                                    src={profileImg}
                                    alt="avtar img holder"
                                    height="45"
                                    width="45"
                                />
                            </div>
                            <div className="user-page-info">
                                <p className="mb-0">Leeanna Alvord</p>
                                <span className="font-small-2">12 Dec 2018 at 1:16 AM</span>
                            </div>
                            <div className="ml-auto user-like">
                                <Heart fill="#EA5455" stroke="#EA5455"/>
                            </div>
                        </div>
                        <h3>
                            The wall on the southern border was unnecessary
                        </h3>
                        <div style={{textAlign: 'center', marginBottom: '20px', marginTop: '15px'}}>
                            <div style={{
                                display: 'inline-block',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                paddingTop: '10px',
                                height: '40px',
                                width: '45%',
                                background: 'red'
                            }}>45%
                            </div>
                            <div style={{
                                display: 'inline-block',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                paddingTop: '10px',
                                height: '40px',
                                width: '55%',
                                background: 'blue'
                            }}>55%
                            </div>
                        </div>
                        <h5>
                            Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration
                            has declined since 2007.
                        </h5>
                        <fieldset className="form-label-group mb-50 mt-2">
                            <Input
                                type="textarea"
                                rows="3"
                                placeholder="Add Comment"
                                id="add-comment"
                                style={{background: '#e0e0f8', borderColor: '#c1c1ff'}}
                            />
                            <Label for="add-comment">Add Comment</Label>
                        </fieldset>
                        <Button.Ripple size="sm" color="primary" className="mb-2">
                            Post Comment
                        </Button.Ripple>
                        <div className="d-flex justify-content-start align-items-center mb-1">
                            <div className="d-flex align-items-center">
                                <Heart size={16} className="mr-50"/>
                                145
                            </div>
                            <div className="ml-2">
                                <ul className="list-unstyled users-list m-0 d-flex">
                                    <li className="avatar pull-up">
                                        <img
                                            src={person1}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar13"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar13">
                                            Lai Lewandowski
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person2}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar14"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar14">
                                            Elicia Rieske
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person3}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar15"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar15">
                                            Alberto Glotzbach
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person4}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar16"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar16">
                                            George Nordic
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="avatar pull-up">
                                        <img
                                            src={person5}
                                            alt="avatar"
                                            height="30"
                                            width="30"
                                            id="avatar17"
                                        />
                                        <UncontrolledTooltip placement="bottom" target="avatar17">
                                            Vinnie Mostowy
                                        </UncontrolledTooltip>
                                    </li>
                                    <li className="d-flex align-items-center pl-50">
                                        <span className="align-middle">+140 more</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="ml-auto">
                                <ThumbsUp size={22} className="mr-50"/>
                                77
                            </p>
                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1">
                            <div className="avatar mr-50">
                                <img src={person6} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Kitty Allanson</h6>
                                <span className="font-small-2">
                  orthoplumbate morningtide naphthaline exarteritis
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                15
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '20px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person2} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Sonata Allanson</h6>
                                <span className="font-small-2">
                  orthoplumbate morningtide naphthaline exarteritis
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                25
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '20px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person5} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Gilbert Jordan</h6>
                                <span className="font-small-2">
                  Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration has declined since 2007.
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                46
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '60px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person6} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Sonya Alex</h6>
                                <span className="font-small-2">
                  Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration has declined since 2007.
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                46
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '60px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person3} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Mario Jordan</h6>
                                <span className="font-small-2">
                  Donald Trump spent 3.6 billion dollars on the southern border wall, but illegal immigration has declined since 2007.
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                46
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>

                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-1"
                             style={{marginLeft: '20px'}}>
                            <CornerDownRight className="mr-50" size={25} style={{marginLeft: '15px'}}/>
                            <div className="avatar mr-50">
                                <img src={person1} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">John Star</h6>
                                <span className="font-small-2">
                  orthoplumbate morningtide naphthaline exarteritis
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                35
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-start align-items-center mb-2">
                            <div className="avatar mr-50">
                                <img src={person7} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0">Jeanie Bulgrin</h6>
                                <span className="font-small-2">
                  blockiness pandemy metaxylene speckle coppy
                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                12
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        )
    }
}

export default Posts
