import React from "react"
import {
    Card,
    CardBody,
    UncontrolledTooltip,
    Input,
    Label,
    Button, ModalHeader, ModalBody, FormGroup, ModalFooter, Modal,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, UncontrolledButtonDropdown, Col, Spinner, Row
} from "reactstrap"
import {Heart, ThumbsDown, ThumbsUp, CornerDownRight, MessageCircle, ChevronLeft} from "react-feather"
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
import SweetAlert from "react-bootstrap-sweetalert";
import { connect } from "react-redux"
import {
    getPosts,
} from "../../../redux/actions/post/index"
import postModel from '../../../firebase/postModel'
var unsubscribe;
class Posts extends React.Component {

    static getDerivedStateFromProps(props, state) {

        if (props.filter == "search") {
            return {
                pageKind:'search',
                posts: props.app.post.posts
            }
        }else if(state.pageKind == "search" && props.filter == "main"){
            window.location.reload();
            // window.location.reload();
        }
        // Return null if the state hasn't changed
        return null
    }
    state = {
        postPoints:null,
        pageKind:'',
        confirmAlert:false,
        title : "",
        contents : "",

        post_modal:false,
        post_modal_title: "",
        post_modal_contents: '',
        post_id:"",

        posts: [],
        opened_childcomments : [],
        opened_childcomment_ids:[],

        modal_kind: 'Add',
        comment_modal: false,
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

                //------- add post into firebase
                let data = {
                    post_id: response.data.id,
                    total_point: 0,
                };
                postModel.create(data)
                    .then(() => { })
                    .catch((e) => { console.log(e); });

            })
            .catch(function(error) {
                console.log(error);
                toast.error("Server process Fail");
            })
    }
    onCreateComment (post_id, political_party_id) {
        if(political_party_id != localStorage.getItem("political_party"))
            this.submitComment(this.state, post_id);
        else
            this.setState({confirmAlert:true});
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
    onGetAllPost(items) {
        let array = [];
        items.forEach((item) => {
            let id = item.id;
            let data = item.data();
            array.push({
                post_id: data.post_id,
                point1: data.point1,
                point2: data.point2,
                total_point: data.total_point,
            });
        });
        this.setState({postPoints: array});
    }
    async componentDidMount() {
        this.onGetAllPost = this.onGetAllPost.bind(this);
        // this.removeComment = this.removeComment.bind(this);

        unsubscribe = postModel.getAll().onSnapshot(this.onGetAllPost); //Planed Reports count
        if(this.props.filter == "main")
            await this.props.getPosts();
        let tmp_posts = this.props.app.post.posts;
        tmp_posts.forEach(post => {
            post.comments = post.comments.sort((a, b) => (a.point < b.point) ? 1 : -1);
        });
        this.setState({
            posts: tmp_posts,
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
    onShowChildComments(comment_id, depth, parent_id){
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
                    local_opened_childcomments.push({comment_id: comment_id, depth: depth, parent_id: parent_id, data: response.data});

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

    //-------- edit/delete comment
    toggleCommentModal = (comment_id, depth, post_id, parent_id, political_party_id, kind) => {
        if(kind == "Add"){
            this.setState(prevState => ({
                comment_modal: !prevState.comment_modal,
                modal_kind:'Add',
                reply_comment_post_id: post_id,
                reply_comment_id: comment_id,
                reply_comment_depth: depth,
                reply_comment_parent_id: parent_id
            }));
        }else {
            this.setState(prevState => ({
                comment_modal: !prevState.comment_modal,
                modal_kind:'Edit',
                reply_comment_post_id: post_id,
                reply_comment_id: comment_id,
                reply_comment_depth: depth,
                reply_comment_parent_id: parent_id
            }));
        }

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
        if(component_state.modal_kind == "Add"){
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
                //---------- add comment -------------
                component_state.reply_comment = "";
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
                    //get parent_id, depth of current comment(parent of new comment)
                    if(this.state.reply_comment_depth == 1){
                        this.onShowChildComments(parent_id, this.state.reply_comment_depth, this.state.reply_comment_post_id);
                    }else if(this.state.reply_comment_depth == 2){
                        this.onShowChildComments(parent_id, this.state.reply_comment_depth, this.state.reply_comment_parent_id);
                    }else{
                        var parent_comment = local_opened_childcomments.find(child_comment =>{
                            return child_comment.comment_id == component_state.reply_comment_parent_id;
                        });
                        var comment = parent_comment['data'].find(child_comment =>{
                            return child_comment.comment_id == component_state.reply_comment_id;
                        });
                        this.onShowChildComments(parent_id, comment.depth, comment.parent_id);
                    }
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
                var modal_status = this.state.comment_modal;
                this.setState({comment_modal: !modal_status});
            }).catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
            })
        }else{
            axios.put(global.config.server_url + "/comments/"+component_state.reply_comment_id,{
                created_at: new Date(),
                comment_id:component_state.reply_comment_id,
                comment: component_state.reply_comment,
            }, Config).then(response => {
                waiterHide();
                component_state.reply_comment = "";
                // ----------- change the reply comment -----------
                if(this.state.reply_comment_depth == 1){
                    // change the child_count of comment by finding the comment(depth = 1) in the posts

                    var selected_post = this.state.posts.find(item =>{
                        return item.id == this.state.reply_comment_post_id
                    });

                    var selected_comment = selected_post.comments.find(item=>{
                        return item.id == this.state.reply_comment_id;
                    });
                    selected_comment.comment = component_state.reply_comment;

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
                        current_comment.comment = component_state.reply_comment;
                    }
                }

                // close the modal after adding new comment
                var modal_status = this.state.comment_modal;
                this.setState({comment_modal: !modal_status});
            }).catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
            })
        }
    }
    removeComment(comment_depth, post_id, comment_parent_id, comment_id){
        waiterShow();
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.delete(global.config.server_url + "/comments/"+comment_id, Config).then(response => {
            waiterHide();
            var tmp_posts = this.state.posts;
            var tmp_opened_childcomments = this.state.opened_childcomments;
            //----------- remove the comment -----------
            if(comment_depth == 1){
                // change the child_count of comment by finding the comment(depth = 1) in the posts
                var selected_post = tmp_posts.find(item =>{
                    return item.id == post_id
                });
                var tmp_comments = selected_post.comments;
                tmp_comments.splice(tmp_comments.findIndex(item => item.id == comment_id), 1);
            }else{
                //as parent_comment belongs in opened_child_comments list, find the comment in the opened_childcomments
                var parent_comment = tmp_opened_childcomments.find(item=>{
                    return item.comment_id == comment_parent_id
                });
                if(parent_comment){
                    var tmp_comments = parent_comment.data;
                    tmp_comments.splice(tmp_comments.findIndex(item => item.id == comment_id), 1)
                }
            }

            // ----------- change the reply count of the comment -----------
            if(comment_depth == 1){
                // change the child_count of comment by finding the comment(depth = 1) in the posts
                var selected_post = this.state.posts.find(item =>{
                    return item.id == post_id
                });
                selected_post.comment_count = selected_post.comment_count - 1;
            }else{
                //as parent_comment belongs in opened_childcomments list, find the comment in the opened_childcomments
                if(comment_depth == 2){
                    var parent_comment = tmp_opened_childcomments.find(item=>{
                        return item.comment_id == comment_parent_id
                    });
                    var parent_post = tmp_posts.find(item=>{
                        return item.id == parent_comment.parent_id
                    });
                    var parent_comment = parent_post.comments.find(item=>{
                        return item.id == comment_parent_id
                    })

                    parent_comment.child_count = parent_comment.child_count - 1;
                }else{
                    var parent_comment = tmp_opened_childcomments.find(item=>{
                        return item.comment_id == comment_parent_id
                    });
                    var parent_parent_comment = tmp_opened_childcomments.find(item=>{
                        return item.comment_id == parent_comment.parent_id
                    });
                    var parent_comment = parent_parent_comment.data.find(item=>{
                        return item.id == comment_parent_id
                    })

                    parent_comment.child_count = parent_comment.child_count - 1;
                }

            }

            this.setState({posts: tmp_posts});
            this.setState({opened_childcomments: tmp_opened_childcomments});
        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
        })
    }

    //--------- edit/delete post -------
    togglePostModal = (post_id, post_title, post_contents) =>{
        this.setState(prevState => ({
            post_modal: !prevState.post_modal,
            post_id: post_id,
            post_modal_title: post_title,
            post_modal_contents: post_contents,
        }));
    }
    removePost(post_id){
        waiterShow();
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.delete(global.config.server_url + "/posts/"+post_id, Config).then(response => {
            waiterHide();
            var tmp_posts = this.state.posts;

            tmp_posts.splice(tmp_posts.findIndex(item => item.id == post_id), 1);
            this.setState({posts: tmp_posts});
        }).catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
            })
    }
    onEditPost = e => {
        e.preventDefault();
        this.editPost(this.state);
    }
    editPost(component_state){
        waiterShow();
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.put(global.config.server_url + "/posts/"+component_state.post_id,{
            created_at: new Date(),
            title: component_state.post_modal_title,
            contents:component_state.post_modal_contents
        }, Config).then(response => {
            waiterHide();

            var selected_post = this.state.posts.find(item =>{
                return item.id == component_state.post_id
            });
            selected_post.title = component_state.post_modal_title;
            selected_post.contents = component_state.post_modal_contents;

            this.setState({post_modal: !this.state.post_modal});
        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
        });
    };

    createChildComments(element_id, post_id){
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
                                <a onClick={() =>{history.push("/app/user/view/" + comment.user_id);}}>
                                    <h6 className="mb-0" style={{color: comment.user.political_party == 1?"red":"blue"}}>
                                        {comment.user.username}
                                    </h6>
                                </a>
                                <span className="font-small-2">
                                    {comment.comment}
                                </span>
                                {
                                    localStorage.getItem("user_id") == comment.user_id &&
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle color="flat-dark" caret style={{
                                            width: '30px',
                                            height: '22px',
                                            background: 'none',
                                            padding: '5px'
                                        }}>
                                            <h3 style={{color: '#747373', marginTop: '-13px'}}>...</h3>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem tag="a"
                                                          onClick={()=>{
                                                              this.setState({reply_comment:comment.comment});
                                                              this.toggleCommentModal(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id, "Edit");
                                                          }}>
                                                Edit
                                            </DropdownItem>
                                            {(comment.child_count == null || comment.child_count  == 0) &&
                                                <DropdownItem tag="a"
                                                              onClick={() => {this.removeComment(comment.depth, comment.post_id, comment.parent_id, comment.id)}}>
                                                    Remove
                                                </DropdownItem>
                                            }
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                }
                                <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px', cursor:'pointer'}} onClick={()=>{this.onUpVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}/>
                                    {comment.point != null? comment.point: 0}
                                {
                                    localStorage.getItem("political_party") == comment.political_party_id &&
                                    <ThumbsDown className="mr-50" size={18}
                                                style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => {
                                        this.onDownVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)
                                    }}/>
                                }
                                {

                                }

                            </div>
                        </div>
                        <div style={{marginLeft: comment.depth * 30 + 'px',cursor:'pointer'}}
                            id={"comment_" + comment.id}
                        >
                            <CornerDownRight className="mr-50" size={15} style={{marginLeft: '15px'}}/>
                            <span style={{fontWeight:'bold'}}
                                  onClick={()=>{
                                        comment.child_count != null && comment.child_count > 0 && this.onShowChildComments(comment.id, comment.depth, comment.depth == 1?comment.post_id:comment.parent_id)}
                            }>{comment.child_count != null && comment.child_count > 0 ? comment.child_count: 0} Replies</span>
                            {localStorage.getItem("political_party") != comment.political_party_id &&
                                <MessageCircle className="mr-50" size={18}
                                               style={{marginLeft: '10px', cursor: 'pointer'}}
                                               onClick={() => {
                                                   this.toggleCommentModal(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id, "Add")
                                               }}
                                />
                            }
                        </div>
                        {
                            this.state.opened_childcomment_ids.includes(comment.id) &&
                            this.createChildComments(comment.id, comment.post_id)
                        }
                    </>
                ))}
                {child_comments != null && child_comments.data.length >= 5 &&
                    <Row>
                        <Col sm="12" className="text-center">
                            <Button.Ripple color="flat-primary" onClick={() => { this.loadingMoreChildComments(element_id, child_comments.data.length) }} style={{marginTop:'10px'}}>
                                Load More...
                            </Button.Ripple>
                        </Col>
                    </Row>
                }
            </>
        );
    }

    //--------- Up/Down Vote -------
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
                if(response.data.data != "success"){
                    add_point = response.data.data;
                }
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
                if(response.data.data != "success"){
                    add_point = response.data.data;
                }
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
                this.onRefreshScore(post_id);
            }).catch(error => {
                waiterHide();
                console.log(error);
                toast.error("API Not Reply.")
            })

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

            postModel.getOne("post_id", post_id)
                .then(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => doc.id);
                    if(data.length > 0){
                        let param = {
                            total_point: total_point,
                            point1: point1,
                            point2: point2,
                        };
                        postModel.update(data[0], param)
                            .then(() => {})
                            .catch((e) => { console.log(e); });
                    }
                }, function(error){
                    console.error(error);
                });
            // var tmp_posts = this.state.posts;
            // var current_post = tmp_posts.find(item=>{
            //     return item.id == post_id
            // });
            //
            // current_post.total_point = total_point;
            // current_post.point1 = point1;
            // current_post.point2 = point2;
            //
            // this.setState({posts: tmp_posts});
        })
    }

    //--------- load more comments -------
    loadingMoreComments(post_id, comment_count){
        waiterShow();
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.get(global.config.server_url + "/loadMoreComments?post_id="+post_id + "&comment_count="+comment_count,
            Config).then(response => {
            waiterHide();
            var tmp_posts = this.state.posts;
            var selected_post = tmp_posts.find(item =>{
                return item.id == post_id
            });

            selected_post.comments = [...selected_post.comments, ...response.data]
            this.setState({posts: tmp_posts});
        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
        })
    }
    loadingMoreChildComments(comment_id, comment_count){
        waiterShow();
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.get(global.config.server_url + "/loadMoreChildComments?comment_id="+comment_id + "&comment_count="+comment_count,
            Config).then(response => {
            waiterHide();

            var tmp_opened_childcomments = this.state.opened_childcomments;
            var selected_comment = tmp_opened_childcomments.find(item=>{
                return item.comment_id == comment_id
            });

            if(selected_comment){
                selected_comment.data = [...selected_comment.data, ...response.data]
            }
            this.setState({opened_childcomments: tmp_opened_childcomments});

        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
        })
    }
    //--------- load more posts -------
    loadingMorePosts(){
        waiterShow();
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.get(global.config.server_url + "/loadMorePosts?post_count="+this.state.posts.length,
            Config).then(response => {
            waiterHide();
            var tmp_posts = this.state.posts;
            tmp_posts = [...tmp_posts, ...response.data]
            this.setState({posts: tmp_posts});
        }).catch(error => {
            waiterHide();
            console.log(error);
            toast.error("API Not Reply.")
        })
    }
    render() {
        return (
        <>
            <React.Fragment>
                <SweetAlert warning title="Warning"
                            confirmBtnBsStyle="warning"
                            show={this.state.confirmAlert}
                            onConfirm={() => {
                                this.setState({confirmAlert:false});
                            }}
                >
                    <p className="sweet-alert-text">You aren't allow to reply to the comment of the same party</p>
                </SweetAlert>
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
                                    <a onClick={() =>{history.push("/app/user/view/" + post.user_id);}}>
                                        <p className="mb-0" style={{color: post.user.political_party == 1?"red":"blue"}}>{post.user.username}</p>
                                    </a>
                                    <span className="font-small-2">{dateConvert2(post.created_at)}</span>
                                </div>
                                {
                                    localStorage.getItem("user_id") == post.user_id &&
                                        <div className="ml-auto user-like">
                                            <UncontrolledButtonDropdown direction="left">
                                                <DropdownToggle color="flat-dark" caret style={{
                                                    width: '30px',
                                                    height: '22px',
                                                    background: 'none',
                                                    padding: '5px'
                                                }}>
                                                    <h3 style={{color: '#747373', marginTop: '-13px'}}>...</h3>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem tag="a"
                                                                  onClick={()=>{
                                                                      this.setState({post_modal_contents:post.contents});
                                                                      this.setState({post_modal_title: post.title});
                                                                      this.togglePostModal(post.id, post.title, post.contents);
                                                                  }}>
                                                        Edit
                                                    </DropdownItem>
                                                    {(post.comment_count == null || post.comment_count  == 0) &&
                                                    <DropdownItem tag="a"
                                                                  onClick={() => this.removePost(post.id)}>
                                                        Remove
                                                    </DropdownItem>
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                        </div>
                                }
                            </div>
                            <div style={{whiteSpace: 'pre-wrap', fontWeight:'bold', fontSize:'16px'}}>
                                {post.title}
                            </div>
                            <div style={{textAlign: 'center', marginBottom: '20px', marginTop: '15px'}}>
                                {(() => {
                                    var post_point = null;
                                    if(this.state.postPoints) {
                                        post_point = this.state.postPoints.find(post_item => {
                                            return post_item.post_id == post.id
                                        });
                                    }
                                    if(post_point == null || post_point.total_point == 0){
                                        return <>
                                            <div style={{
                                                display: 'inline-block',
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                paddingTop: '10px',
                                                height: '40px',
                                                width: '50%',
                                                background: 'red'}}>
                                                50%
                                            </div>
                                            <div style={{
                                                display: 'inline-block',
                                                color: '#ffffff',
                                                fontWeight: 'bold',
                                                paddingTop: '10px',
                                                height: '40px',
                                                width: '50%',
                                                background: 'blue'
                                            }}>
                                                50%
                                            </div>
                                        </>
                                    }else{
                                        var point1 = Math.floor((post_point.point1/post_point.total_point) * 100);
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
                            {
                                localStorage.getItem('political_party') != post.political_party_id &&
                                    <>
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

                                        <Button.Ripple size="sm" color="primary" className="mb-2" onClick={()=> this.onCreateComment(post.id, post.political_party_id)}>
                                            Post Comment
                                        </Button.Ripple>
                                    </>
                            }
                            <div className="d-flex justify-content-start align-items-center mb-1 mt-1">
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
                                {/*<p className="ml-auto">*/}
                                {/*    <ThumbsUp size={22} className="mr-50"/>*/}
                                {/*    {post.total_point}*/}
                                {/*</p>*/}
                            </div>
                            {post.comments.map((comment) => (
                                <>
                                    <div className="d-flex justify-content-start align-items-center mt-1">
                                        <div className="avatar mr-50">
                                            <img src={comment.user.image?comment.user.image:defaultImage} alt="Avatar" height="30" width="30"/>
                                        </div>
                                        <div className="user-page-info">
                                            <a onClick={() =>{history.push("/app/user/view/" + comment.user_id);}}>
                                                <h6 className="mb-0" style={{color: comment.user.political_party == 1?"red":"blue"}}>{comment.user.username}</h6>
                                            </a>
                                            <span className="font-small-2">
                                              {comment.comment}
                                            </span>
                                            {
                                                localStorage.getItem("user_id") == comment.user_id &&
                                                    <UncontrolledButtonDropdown>
                                                        <DropdownToggle color="flat-dark" caret style={{
                                                            width: '30px',
                                                            height: '22px',
                                                            background: 'none',
                                                            padding: '5px'
                                                        }}>
                                                            <h3 style={{color: '#747373', marginTop: '-13px'}}>...</h3>
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem tag="a"
                                                                          onClick={()=>{
                                                                              this.setState({reply_comment:comment.comment});
                                                                              this.toggleCommentModal(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id, "Edit");
                                                                          }}>
                                                                Edit
                                                            </DropdownItem>
                                                            {(comment.child_count == null || comment.child_count  == 0) &&
                                                                <DropdownItem tag="a"
                                                                              onClick={() => this.removeComment(comment.depth, comment.post_id, comment.parent_id, comment.id)}>
                                                                    Remove
                                                                </DropdownItem>
                                                            }
                                                        </DropdownMenu>
                                                    </UncontrolledButtonDropdown>
                                            }

                                            <ThumbsUp className="mr-50" size={18} style={{marginLeft: '15px', cursor:'pointer'}} onClick={()=>{this.onUpVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}/>
                                            {comment.point != null ? comment.point: 0}
                                            {localStorage.getItem("political_party") == comment.political_party_id &&
                                                <ThumbsDown className="mr-50" size={18} style={{marginLeft: '5px', cursor: 'pointer'}} onClick={() => {
                                                    this.onDownVote(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id)}}
                                                />
                                            }

                                        </div>
                                    </div>

                                    <div style={{marginLeft:'30px',cursor:'pointer'}}>
                                        <CornerDownRight className="mr-50" size={15} style={{marginLeft: '15px'}}/>
                                        <span style={{fontWeight:'bold'}}  onClick={()=>{
                                            comment.child_count != null && comment.child_count > 0 && this.onShowChildComments(comment.id, comment.depth, comment.depth == 1?comment.post_id:comment.parent_id)}} id={"comment_" + comment.id
                                        }>
                                            {comment.child_count != null && comment.child_count > 0? comment.child_count: 0} Replies
                                        </span>
                                        {localStorage.getItem("political_party") != comment.political_party_id &&
                                            <MessageCircle className="mr-50" size={18}
                                                           style={{marginLeft: '10px', cursor: 'pointer'}}
                                                           onClick={() => {
                                                               this.toggleCommentModal(comment.id, comment.depth, comment.post_id, comment.parent_id, comment.political_party_id, "Add")
                                                           }}
                                            />
                                        }
                                    </div>
                                    {
                                        this.state.opened_childcomment_ids.includes(comment.id) &&
                                        this.createChildComments(comment.id, comment.post_id)
                                    }
                                </>
                            ))}

                            {post.comment_count > post.comments.length &&
                                <Row>
                                    <Col sm="12" className="text-center">
                                        <Button.Ripple color="flat-primary" onClick={() => { this.loadingMoreComments(post.id, post.comments.length) }} style={{marginTop:'10px'}}>
                                            Load More...
                                        </Button.Ripple>
                                    </Col>
                                </Row>
                            }
                        </CardBody>
                    </Card>
                ))}
                {/*<Row>*/}
                {/*    <Col sm="12" className="text-center">*/}
                {/*        <Button.Ripple color="flat-primary" onClick={() => { this.loadingMorePosts() }} style={{marginTop:'10px'}}>*/}
                {/*            Load More...*/}
                {/*        </Button.Ripple>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </React.Fragment>
            <Modal
                isOpen={this.state.comment_modal}
                toggle={this.toggleCommentModal}
                className="modal-dialog-centered"
            >
                <ModalHeader toggle={this.toggleCommentModal}>
                    {this.state.modal_kind} Comment
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="reply_comment">Comment:</Label>
                        <Input
                            type="textarea"
                            rows="5"
                            placeholder="Add Comment"
                            id="reply_comment"
                            defaultValue={this.state.reply_comment}
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
            <Modal
                isOpen={this.state.post_modal}
                toggle={this.togglePostModal}
                className="modal-dialog-centered"
            >
                <ModalHeader toggle={this.togglePostModal}>
                    Post
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="reply_comment">Title:</Label>
                        <Input
                            type="textarea"
                            rows="2"
                            placeholder="Add Title"
                            id="modal_title"
                            defaultValue={this.state.post_modal_title}
                            onChange={e=> this.setState({post_modal_title:e.target.value})}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="reply_comment">Contents:</Label>
                        <Input
                            type="textarea"
                            rows="5"
                            placeholder="Add Contents"
                            id="modal_contents"
                            defaultValue={this.state.post_modal_contents}
                            onChange={e=> this.setState({post_modal_contents:e.target.value})}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick = {this.onEditPost}>
                        Commit
                    </Button>{" "}
                </ModalFooter>
            </Modal>
        </>
        )
    }
}
const mapStateToProps = state => {
    return {
        app: state.postApp
    }
}
export default connect(mapStateToProps, {
    getPosts,
})(Posts)

