import React from "react"
import {
    Card,
    CardBody,
    UncontrolledTooltip,
    Input,
    Label,
    Button, ModalHeader, ModalBody, FormGroup, ModalFooter, Modal
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
        opened_childcomments : [],
        opened_childcomment_ids:[],
        modal: false,
        comment: '',
        child_comment:'',
        child_comment_id:'',
        child_comment_depth:'',
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
            this.setState({ posts: response.data })
        })
    }

    onShowChildComments(comment_id){
        var element_index = this.state.opened_childcomment_ids.indexOf(comment_id);
        if(element_index > -1){ // if childcomments are opened, remove the childcomments from the array

            // get all level child ids from the parent_id
            var local_opened_childcomments_ids = this.state.opened_childcomment_ids;
            var local_opened_childcomments = this.state.opened_childcomments;

            local_opened_childcomments_ids.splice(element_index, 1);
            var removeIndex = local_opened_childcomments.map(item => item.comment_id).indexOf(comment_id);
            ~removeIndex && local_opened_childcomments.splice(removeIndex, 1);

            const Config = {
                headers:{
                    Authorization:"Bearer " + localStorage.getItem("token")
                }
            }

            axios.get(global.config.server_url + "/getAllLevelChildIds?parent_id="+comment_id, Config).then(response =>{
                if(response.data.child_ids != null && response.data.child_ids.length > 0){
                    response.data.child_ids.forEach(child_comment_id =>{

                        var child_element_index = this.state.opened_childcomment_ids.indexOf(child_comment_id);
                        if(child_element_index > -1){
                            local_opened_childcomments_ids.splice(child_element_index, 1);

                            var removeIndex = local_opened_childcomments.map(item => item.comment_id).indexOf(child_comment_id);
                            ~removeIndex && local_opened_childcomments.splice(removeIndex, 1);
                        }
                    })
                }
                this.setState({opened_childcomments: local_opened_childcomments});
                this.setState({opened_childcomment_ids: local_opened_childcomments_ids});
            });
        }else{
            const Config = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            axios.get(global.config.server_url + "/getChildComments?parent_id="+comment_id, Config).then(response =>{
                if(response.data && response.data.length > 0){
                    this.setState({comments: response.data});
                    var parent_element = document.getElementById("comment_"+comment_id);

                    var local_opened_childcomment_ids = this.state.opened_childcomment_ids;
                    var local_opened_childcomments = this.state.opened_childcomments;

                    local_opened_childcomment_ids.push(comment_id);
                    local_opened_childcomments.push({comment_id: comment_id, data: response.data});

                    this.setState({opened_childcomment_ids: local_opened_childcomment_ids});
                    this.setState({opened_childcomments: local_opened_childcomments});
                }
            });
        }
    }
    toggleModal = (comment_id, depth) => {
        this.setState(prevState => ({
            modal: !prevState.modal,
            child_comment_id: comment_id,
            child_comment_depth: depth
        }));
    }
    onPostComment = e => {
        e.preventDefault();
        this.submitChildComment(this.state);
    }
    submitChildComment(component_state) {
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }

        axios.post(global.config.server_url + "/comments",{

            parent_id:component_state.child_comment_id,
            comment: component_state.child_comment,
            user_id: localStorage.getItem("user_id"),
            political_party_id: localStorage.getItem("political_party"),
            depth: parseInt(component_state.child_comment_depth) + 1

        }, Config).then(response => {
console.log("created comment result : +++ ");
            console.log(response.data);
            // this.setState({ posts: response.data })
        })
    }
    createChildComments(element_id){
        var child_comments = this.state.opened_childcomments.find(item => item.comment_id == element_id);
        return(
            <>
                {child_comments != null && child_comments.data.map((comment) => (
                    <>
                        <div className="d-flex justify-content-start align-items-center mt-1"
                             style={{marginLeft: (comment.depth - 1) * 40 + 'px'}}>
                            <div className="avatar mr-50">
                                <img src={comment.user.image} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0" style={{color: comment.user.political_party == 1?"red":"blue"}}>
                                    {comment.user.username}
                                </h6>
                                <span className="font-small-2">
                                    {comment.comment}
                                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                    {comment.point}
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                                <span style={{cursor:'pointer', fontWeight:'bold'}} onClick={()=>{this.toggleModal(comment.id, comment.depth)}}>reply</span>
                            </div>
                        </div>
                        {comment.child_count != null && comment.child_count > 0 &&
                            <div style={{marginLeft: comment.depth * 30 + 'px',cursor:'pointer'}} onClick={()=>{this.onShowChildComments(comment.id)}} id={"comment_" + comment.id}>
                            <CornerDownRight className="mr-50" size={15} style={{marginLeft: '15px'}}/>
                            <span style={{fontWeight:'bold'}}>{comment.child_count} Replies</span>
                            </div>
                        }
                        {
                            this.state.opened_childcomment_ids.includes(comment.id) &&
                            this.createChildComments(comment.id)
                        }
                    </>
                ))}
            </>
        );
    }
    render() {
        return (
        <>
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
                                    <p className="mb-0" style={{color: post.user.political_party == 1?"red":"blue"}}>{post.user.username}</p>
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
                                    onChange={e=>this.setState({comment: e.target.value})}
                                />
                                <Label for="add-comment">Add Comment</Label>
                            </fieldset>
                            <Button.Ripple size="sm" color="primary" className="mb-2" onClick={()=> this.onCreateComment}>
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
                                                    {comment.user.username}
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
                                <>
                                    <div className="d-flex justify-content-start align-items-center mt-1">
                                        <div className="avatar mr-50">
                                            <img src={comment.user.image?comment.user.image:defaultImage} alt="Avatar" height="30" width="30"/>
                                        </div>
                                        <div className="user-page-info">
                                            <h6 className="mb-0" style={{color: comment.user.political_party == 1?"red":"blue"}}>{comment.user.username}</h6>
                                            <span className="font-small-2">
                                              {comment.comment}
                                            </span>
                                            <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px'}}/>
                                            {comment.point}
                                            <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px'}}/>
                                            <span style={{cursor:'pointer', fontWeight:'bold'}} onClick={()=>{this.toggleModal(comment.id, comment.depth)}}>reply</span>
                                        </div>
                                    </div>
                                    {comment.child_count != null && comment.child_count > 0 &&
                                        <div style={{marginLeft:'30px',cursor:'pointer'}} onClick={()=>{this.onShowChildComments(comment.id)}} id={"comment_" + comment.id}>
                                            <CornerDownRight className="mr-50" size={15} style={{marginLeft: '15px'}}/>
                                            <span style={{fontWeight:'bold'}}>{comment.child_count} Replies</span>
                                        </div>
                                    }
                                    {
                                        this.state.opened_childcomment_ids.includes(comment.id) &&
                                        this.createChildComments(comment.id)
                                    }
                            </>
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
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggleModal}
                    className="modal-dialog-centered"
                >
                <ModalHeader toggle={this.toggleModal}>
                        Add Comment
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="child_comment">Comment:</Label>
                            <Input
                                type="textarea"
                                rows="5"
                                placeholder="Add Comment"
                                id="child_comment"
                                onChange={e=> this.setState({child_comment:e.target.value})}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onPostComment}>
                            Commit
                        </Button>{" "}
                    </ModalFooter>
                </Modal>
        </>
        )
    }
}

export default Posts
