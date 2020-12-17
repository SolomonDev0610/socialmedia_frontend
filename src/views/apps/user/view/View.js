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

function UserView() {
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
            political_party: politicalParty,
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
        axios.get(global.config.server_url + "/getUserInfo?user_id=" + localStorage.getItem("user_id"), Config).then(response => {
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
                                    <div>
                                        <input {...getInputProps()} />
                                        <Button.Ripple color="primary" outline className="my-1" onClick={open}>
                                            Change Profile
                                        </Button.Ripple>
                                    </div>
                                </Col>
                                <Col md="8" sm="12">
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
                                            {politicalParty &&
                                            <CustomInput type="select" name="political_party"
                                                         defaultValue={politicalParty}
                                                         onChange={e => setPoliticalParty(e.target.value)}>
                                                <option value="1">Republican</option>
                                                <option value="2">Democrat</option>
                                            </CustomInput>
                                            }
                                            {politicalParty == null &&
                                            <CustomInput type="select" name="political_party"
                                                         onChange={e => setPoliticalParty(e.target.value)}>
                                                <option value="1">Republican</option>
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
                                                {totalPoint} Points Earned
                                            </div>
                                        </FormGroup>
                                    </Row>
                                    <Button.Ripple className="mr-1" color="primary" onClick={onSave}>
                                        Save Profile
                                    </Button.Ripple>
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
