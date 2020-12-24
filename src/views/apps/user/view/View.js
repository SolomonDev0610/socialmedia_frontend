import React, {useState, useEffect} from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Media,
    Row,
    Col,
    Button,
    Table, FormGroup, Label, Input, CustomInput
} from "reactstrap"
import axios from "axios";
import {Edit, Trash, Lock, Check} from "react-feather"
import {Link} from "react-router-dom"
import {toast} from "react-toastify";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import userImg from "../../../../assets/img/profile/default_profile.jpg"
import "../../../../assets/scss/pages/users.scss"
import {useDropzone} from "react-dropzone";
import defaultImage from "../../../../../src/assets/img/profile/default_profile.jpg"
import republican_img from "../../../../assets/img/logo/republican_logo.png";
import democratic_img from "../../../../assets/img/logo/democratic_logo.png";

function UserView({match}) {
    const [profileImage, setProfileImage] = useState(userImg);
    const [username, setUsername] = useState(null);
    const [politicalParty, setPoliticalParty] = useState(null);
    const [totalPoint, setTotalPoint] = useState(null);

    const {getInputProps, open} = useDropzone({
        accept: "image/*",
        noClick: true,
        noKeyboard: true,
        onDrop: acceptedFiles => {
            var formData = new FormData();
            acceptedFiles.map(file =>
                formData.append("photoUpload", file)
            )

            const Config = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'Content-Type': "multipart/form-data"
                }
            }
            axios.post(global.config.server_url + "/changeProfilePhoto", formData, Config)
                .then(response => {
                    console.log(response.data);
                    if (response.data.success == true) {
                        setProfileImage(response.data.file_path);
                    } else
                        console.log("uploadFail!");
                });
        }
    })
    const onSave = () => {
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        axios.post(global.config.server_url + "/saveUserInfo", {
            user_id: localStorage.getItem("user_id"),
            username: username,
        }, Config)
            .then(response => {
                toast.info("Save Success!");
            })
            .catch(error => {
                console.log(error);
                toast.error("Server error!")
            })
    };
    useEffect(() => {
        let mounted = true;
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        var user_id = match.params.id;
        if(user_id == "main")
            user_id = localStorage.getItem('user_id');

        axios.get(global.config.server_url + "/getUserInfo?user_id=" + user_id, Config).then(response => {
            console.log(response.data);
            setProfileImage(response.data.image);
            setUsername(response.data.username);
            setPoliticalParty(response.data.political_party);
            setTotalPoint(response.data.earned_score);
        })
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col sm="12">
                    <Card>
                        <CardHeader>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="4" sm="12" style={{textAlign: 'center'}}>
                                    <Media
                                        className="rounded mr-2"
                                        object
                                        src={profileImage?profileImage:defaultImage}
                                        alt="Generic placeholder image"
                                        height="112"
                                        width="112"
                                    />
                                    {match.params.id == "main" &&
                                        <div>
                                            <input {...getInputProps()} />
                                            <Button.Ripple color="primary" outline className="my-1" onClick={open}>
                                                change profile picture.
                                            </Button.Ripple>
                                        </div>
                                    }
                                </Col>
                                <Col md="4" sm="12">
                                    <Row>
                                        <FormGroup>
                                            <Label for="name">username</Label>
                                            <Input
                                                type="text"
                                                defaultValue={username}
                                                onChange={e => setUsername(e.target.value)}
                                                id="name"
                                                placeholder="Name"
                                            />
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup>
                                            <Label for="name">Political Party</Label>
                                            { politicalParty == 1 &&
                                                <CustomInput type="select" name="political_party"
                                                             defaultValue={politicalParty}>
                                                    <option value="1">Republican</option>
                                                </CustomInput>
                                            }
                                            { politicalParty == 2 &&
                                            <CustomInput type="select" name="political_party"
                                                         defaultValue={politicalParty}>
                                                <option value="2">Democrat</option>
                                            </CustomInput>
                                            }
                                        </FormGroup>
                                    </Row>
                                    <Row>
                                        <FormGroup>
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                fontSize: '25px',
                                                fontWeight: 'bold',
                                                color: '#626161'
                                            }}>
                                                {totalPoint? totalPoint: 0} points earned
                                            </div>
                                        </FormGroup>
                                    </Row>
                                    {match.params.id == "main" &&
                                        <Button.Ripple className="mr-1" color="primary" onClick={onSave}>
                                            Save Profile
                                        </Button.Ripple>
                                    }
                                </Col>
                                <Col md="4" sm="12" style={{paddingTop:'30px'}}>
                                    {politicalParty == 1 &&
                                        <img
                                            height="150" width="150"
                                            src={ republican_img }
                                            alt="CoverImg"
                                            className="img-fluid bg-cover rounded-0"
                                        />
                                    }
                                    {politicalParty == 2 &&
                                        <img
                                            height="150" width="150"
                                            src={ democratic_img }
                                            alt="CoverImg"
                                            className="img-fluid bg-cover rounded-0"
                                        />
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default UserView
