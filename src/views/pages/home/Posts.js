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
import {waiterHide, waiterShow} from "../../../../src/helpers/waiter";
import {now} from "moment";

class Posts extends React.Component {
    state = {
        title : "",
        contents : "",
        posts: [],
        opened_childcomments : [],
        opened_childcomment_ids:[],
        modal: false,
        comment: '',
        reply_comment:'',
        reply_comment_post_id:'',
        reply_comment_id:'',
        reply_comment_depth:'',
        reply_comment_parent_id:''
    }

    onCreatePost = e => {
        e.preventDefault();
        this.submitPost(this.state);
    }
    submitPost (info){
        waiterShow();
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
            created_at: new Date()
        }, Config)
            .then(response => {

                waiterHide();
                var tmp_posts = this.state.posts;
                tmp_posts.unshift(response.data);

                //------ init --------
                this.setState({posts: tmp_posts});
                this.setState({title: ''});
                this.setState({contents: ''});
                document.getElementById("title").value="";
                document.getElementById("content").value="";
            })
            .catch(function(error) {
                console.log(error);
                toast.error("Server process Fail");
            })
    }

    onCreateComment (post_id) {
        this.submitComment(this.state, post_id);
    }
    submitComment (info, post_id){
        waiterShow();

        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.post(global.config.server_url + "/comments", {
            created_at: new Date(),
            post_id: post_id,
            join_post_id: post_id,
            parent_id: 0,
            depth: 1,
            comment: info.comment,
            user_id: localStorage.getItem("user_id"),
            political_party_id: localStorage.getItem("political_party"),
        }, Config)
            .then(response => {
                waiterHide();
                var tmp_posts = this.state.posts;
                var current_post = tmp_posts.find(item=>{
                    return item.id == post_id
                });

                current_post.comments.unshift(response.data);
                current_post.comment_count = current_post.comment_count + 1;

                this.setState({comment: ''});
                document.getElementById("input-comment"+post_id).value="";
                this.setState({posts: tmp_posts});
            })
            .catch(function(error) {
                waiterHide();
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
            console.log("------ this is init data -------");
            console.log(response.data);
            this.setState({ posts: response.data })
        })
    }

    onShowChildComments(comment_id){
        waiterShow();
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
                    response.data.child_ids.forEach(reply_comment_id =>{

                        var child_element_index = this.state.opened_childcomment_ids.indexOf(reply_comment_id);
                        if(child_element_index > -1){
                            local_opened_childcomments_ids.splice(child_element_index, 1);

                            var removeIndex = local_opened_childcomments.map(item => item.comment_id).indexOf(reply_comment_id);
                            ~removeIndex && local_opened_childcomments.splice(removeIndex, 1);
                        }
                    })
                }
                this.setState({opened_childcomments: local_opened_childcomments});
                this.setState({opened_childcomment_ids: local_opened_childcomments_ids});
                waiterHide();
            })
            .catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
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
                    waiterHide();
                }
            }).catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
            });;
        }
    }
    toggleModal = (comment_id, depth, post_id, parent_id) => {
        this.setState(prevState => ({
            modal: !prevState.modal,
            reply_comment_post_id: post_id,
            reply_comment_id: comment_id,
            reply_comment_depth: depth,
            reply_comment_parent_id: parent_id
        }));
    }
    onPostReplyComment = e => {
        e.preventDefault();
        this.submitReplyComment(this.state);
    }
    submitReplyComment(component_state) {
        waiterShow();

        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }

        axios.post(global.config.server_url + "/comments",{
            created_at: new Date(),
            post_id: component_state.reply_comment_post_id,
            parent_id:component_state.reply_comment_id,
            comment: component_state.reply_comment,
            user_id: localStorage.getItem("user_id"),
            political_party_id: localStorage.getItem("political_party"),
            depth: parseInt(component_state.reply_comment_depth) + 1,
        }, Config).then(response => {

            waiterHide();
            var parent_id = component_state.reply_comment_id;
            var local_opened_childcomment_ids = this.state.opened_childcomment_ids;
            var local_opened_childcomments= this.state.opened_childcomments;

            var parent_index = local_opened_childcomment_ids.indexOf(parent_id);

            if(parent_index > -1){
                var parent_comment = local_opened_childcomments.find(child_comment =>{
                    return child_comment.comment_id == parent_id
                });
                parent_comment['data'].unshift(response.data);

            }else{
                this.onShowChildComments(parent_id);
            }

            // ----------- change the reply count of the comment -----------
            if(this.state.reply_comment_depth == 1){
                // change the child_count of comment by finding the comment(depth = 1) in the posts

                var selected_post = this.state.posts.find(item =>{
                    return item.id == this.state.reply_comment_post_id
                });

                var selected_comment = selected_post.comments.find(item=>{
                    return item.id == this.state.reply_comment_id;
                });
                selected_comment.child_count = selected_comment.child_count + 1;

            }else{

                //as parent_comment belongs in opened_childcomments list, find the comment in the opened_childcomments
                var tmp_opened_childcomments = this.state.opened_childcomments;
                var parent_comment = tmp_opened_childcomments.find(item=>{
                    return item.comment_id == this.state.reply_comment_parent_id
                });
                if(parent_comment){
                    var current_comment = parent_comment.data.find(item=>{
                        return item.id == this.state.reply_comment_id;
                    });
                    current_comment.child_count = current_comment.child_count + 1;
                }
            }

            // close the modal after adding new comment
            var modal_status = this.state.modal;
            this.setState({modal: !modal_status});
        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
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
                                <img src={comment.user.image? comment.user.image: defaultImage} alt="Avatar" height="30" width="30"/>
                            </div>
                            <div className="user-page-info">
                                <h6 className="mb-0" style={{color: comment.user.political_party == 1?"red":"blue"}}>
                                    {comment.user.username}
                                </h6>
                                <span className="font-small-2">
                                    {comment.comment}
                                </span>
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px', cursor:'pointer'}} onClick={()=>{this.onUpVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}/>
                                    {comment.point}
                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px', cursor:'pointer'}} onClick={()=>{this.onDownVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}/>
                                <span style={{cursor:'pointer', fontWeight:'bold'}} onClick={()=>{this.toggleModal(comment.id, comment.depth, comment.post_id, comment.parent_id)}}>reply</span>
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

    onUpVote(comment_id, depth, post_id, parent_id, comment_political_party){
        waiterShow();
        var add_point = 0;
        if(comment_political_party != localStorage.getItem("political_party"))
            add_point = 4;
        else
            add_point = 1;

        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }

        axios.post(global.config.server_url + "/upVote",{
            user_id: localStorage.getItem('user_id'),
            post_id: post_id,
            comment_id: comment_id,
            add_point: add_point,
        }, Config).then(response => {
            waiterHide();
            // ----------- change the point of the comment -----------
            if(response.data.data == "success"){
                if(depth == 1){
                    // change the point of comment by finding the comment(depth = 1) in the posts
                    var tmp_posts = this.state.posts;
                    var selected_post = tmp_posts.find(item =>{
                        return item.id == post_id
                    });
                    var selected_comment = selected_post.comments.find(item=>{
                        return item.id == comment_id;
                    });
                    selected_comment.point = selected_comment.point + add_point;

                    this.setState({posts: tmp_posts});
                }else{
                    //as parent_comment belongs in opened_childcomments list, find the comment in the opened_childcomments

                    var tmp_opened_childcomments = this.state.opened_childcomments;
                    var parent_comment = tmp_opened_childcomments.find(item=>{
                        return item.comment_id == parent_id
                    });
                    if(parent_comment){
                        var current_comment = parent_comment.data.find(item=>{
                            return item.id == comment_id;
                        });
                        current_comment.point = current_comment.point + add_point;
                    }
                    this.setState({opened_childcomments: tmp_opened_childcomments});
                }
                this.onRefreshScore(post_id);
            }
        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
        })
    }
    onDownVote(comment_id, depth, post_id, parent_id, comment_political_party){
        if(comment_political_party == localStorage.getItem("political_party")){
            waiterShow();
            var add_point = -1;

            const Config = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }

            axios.post(global.config.server_url + "/upVote",{
                user_id: localStorage.getItem('user_id'),
                post_id: post_id,
                comment_id: comment_id,
                add_point: add_point,
            }, Config).then(response => {
                waiterHide();
                // ----------- change the point of the comment -----------
                if(response.data.data == "success") {
                    if (depth == 1) {
                        // change the point of comment by finding the comment(depth = 1) in the posts
                        var tmp_posts = this.state.posts;
                        var selected_post = tmp_posts.find(item => {
                            return item.id == post_id
                        });
                        var selected_comment = selected_post.comments.find(item => {
                            return item.id == comment_id;
                        });
                        selected_comment.point = selected_comment.point + add_point;

                        this.setState({posts: tmp_posts});
                    } else {
                        //as parent_comment belongs in opened_childcomments list, find the comment in the opened_childcomments

                        var tmp_opened_childcomments = this.state.opened_childcomments;
                        var parent_comment = tmp_opened_childcomments.find(item => {
                            return item.comment_id == parent_id
                        });
                        if (parent_comment) {
                            var current_comment = parent_comment.data.find(item => {
                                return item.id == comment_id;
                            });
                            current_comment.point = current_comment.point + add_point;
                        }
                        this.setState({opened_childcomments: tmp_opened_childcomments});
                    }
                }
            }).catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
            })
            this.onRefreshScore(post_id);
        }
    }
    onRefreshScore(post_id){
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.get(global.config.server_url + "/get_scores_by_party?post_id="+post_id, Config).then(response => {

            var point1 = response.data.republican_total_score;
            var point2= response.data.democratic_total_score;
            point1 = point1? parseInt(point1) : 0;
            point2 = point2? parseInt(point2) : 0;
            var total_point = point1 + point2;

            var tmp_posts = this.state.posts;
            var current_post = tmp_posts.find(item=>{
                return item.id == post_id
            });

            current_post.total_point = total_point;
            current_post.point1 = point1;
            current_post.point2 = point2;

            this.setState({posts: tmp_posts});
        })
    }
    render() {
        return (
        <>
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
                {this.state.posts.map((post) => (
                    <Card style={{background: post.political_party_id == 1?'#ffcccc':'#c1c1ff'}}>
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

                            </div>
                            <div style={{whiteSpace: 'pre-wrap', fontWeight:'bold', fontSize:'16px'}}>
                                {post.title}
                            </div>
                            <div style={{textAlign: 'center', marginBottom: '20px', marginTop: '15px'}}>
                                {(() => {
                                    if(post.total_point == null || post.total_point == 0 ){
                                        return <div style={{
                                                display: 'inline-block',
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                paddingTop: '10px',
                                                height: '40px',
                                                width: '100%',
                                                background: post.political_party_id == 1?'red':'blue'}}>100%</div>;
                                    }else{
                                        var point1 = Math.floor((post.point1/post.total_point) * 100);
                                        var point2 = 100 - point1;
                                        return <>
                                            {point1 > 0 &&
                                                <div style={{
                                                display: 'inline-block',
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                paddingTop: '10px',
                                                height: '40px',
                                                width: point1+'%',
                                                background: 'red'}}>
                                                    {point1}%
                                                </div>
                                            }
                                            {point2 > 0 &&
                                                <div style={{
                                                    display: 'inline-block',
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingTop: '10px',
                                                    height: '40px',
                                                    width: point2 + '%',
                                                    background: 'blue'
                                                }}>
                                                    {point2}%
                                                </div>
                                            }
                                            </>;
                                    }
                                })()}
                            </div>
                            <div style={{whiteSpace: 'pre-wrap'}}>
                                {post.contents}
                            </div>
                            <fieldset className="form-label-group mb-50 mt-2">
                                <Input
                                    type="textarea"
                                    rows="3"
                                    placeholder="Add Comment"
                                    id={"input-comment"+post.id}
                                    style={{background: post.political_party_id == 1?'#fde0e0':'#e0e0f8', borderColor: post.political_party_id == 1?'#f5c2c2':'#c1c1ff'}}
                                    onChange={e=>this.setState({comment: e.target.value})}
                                />
                                <Label for="add-comment">Add Comment</Label>
                            </fieldset>
                            <Button.Ripple size="sm" color="primary" className="mb-2" onClick={()=> this.onCreateComment(post.id)}>
                                Post Comment
                            </Button.Ripple>
                            <div className="d-flex justify-content-start align-items-center mb-1">
                                <div className="d-flex align-items-center">
                                    {post.comment_count? post.comment_count: 0} comments
                                </div>
                                <div className="ml-2">
                                    <ul className="list-unstyled users-list m-0 d-flex">
                                        {(() => {

                                        })()}
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
                                    {post.total_point}
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
                                            <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px', cursor:'pointer'}} onClick={()=>{this.onUpVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}/>
                                            {comment.point}
                                            <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px', cursor:'pointer'}} onClick={()=>{this.onDownVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}/>
                                            <span style={{cursor:'pointer', fontWeight:'bold'}} onClick={()=>{this.toggleModal(comment.id, comment.depth, comment.post_id, comment.parent_id)}}>reply</span>
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
                            <Label for="reply_comment">Comment:</Label>
                            <Input
                                type="textarea"
                                rows="5"
                                placeholder="Add Comment"
                                id="reply_comment"
                                onChange={e=> this.setState({reply_comment:e.target.value})}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick = {this.onPostReplyComment}>
                            Commit
                        </Button>{" "}
                    </ModalFooter>
                </Modal>
        </>
        )
    }
}

export default Posts
