import React, { Component } from "react";
import "./style.css";
import MainBody from "../MainBody";
import ListCard from "../ListCard";
import api from '../../API/api';
import ProfileInfo from "../ProfileInfo";
// import FindFriends from "../FindFriends";
import { Link } from "react-router-dom";
import Axios from "axios";
import ListDisplay from '../ListDisplay'
import Recommended from "../Recommended"


const style = {
    color: 'white'
}
const style2 = {
    width: '100%'
}

class Header extends Component {

    state = {
        page: "",
        loginInfo: {},
        cardComponents: [],
        recievedData: [],
        renderList: false,
        textarea: '',
        cardClickId: '',
        currentComments: []
    }

    componentDidMount = () => {
        this.setState({ page: "cinema", loginInfo: JSON.parse(localStorage.getItem('loginInfo')) });
        //console.log("initial state = " + this.state.page);
        //console.log("in the header component", this.state.loginInfo)

        console.log("component did mount");
        console.log(JSON.parse(localStorage.getItem("loginInfo")));

        this.apiCall();
    }

    handleClick = event => {
        //console.log(event.target.name);
        this.setState({
            page: event.target.name
        });

        this.apiCall();

        console.log("handleClickCheck", this.state);

    }
    handleChange = (event) => {

        // console.log(event.target)
        const { name, value } = event.target;

        // console.log(event.target)

        // Updating the input's state
        this.setState({
            [name]: value
        });
    }

    cardClick = (id, category) => {
        Axios.post(`http://localhost:8080/list/${id}/${category}`).then(data => {
            console.log(data.data)
            this.setState({ recievedData: data.data.array, renderList: true, cardClickId: data.data.id, currentComments: data.data.commentsArray });


        })
    }
    //axios call used to send data to backend of user comment, should send list Id and comment string
    sendComment = (id) => {
        console.log(id)
        Axios.post(`http://localhost:8080/commentSubmit`, { id: this.state.loginInfo, comment: this.state.textarea, listId: this.state.cardClickId }).then(data => {
            console.log(data)
        })
    }

    apiCall = () => {
        //console.log("clicked nav state is now = " + this.state.page);

        console.log("in api call this is state that is passed in", this.state);

        let listSearchObject = {
            category: this.state.page,
            username: this.state.loginInfo.username
        }

        api.getLists(listSearchObject).then(res => {
            // for(var i = 0; i < res.data.lists.length; i++){
            //     console.log(res.data.lists[i]._id)
            // }

            if (res.data === null) {
                this.apiCall();
            } else if (res.data !== null) {
                // console.log(res.data)
                // console.log("entering");
                let userListArray = res.data.lists;
                let filteredArray = userListArray.filter(list => list.category === this.state.page);
                console.log("filtered array", filteredArray);
                let listsToShow = filteredArray.filter(list => list.pinned === true);
                console.log("listsToShow", listsToShow);

                //console.log("inside if", listsToShow);



                let cardArray = [];

                if (listsToShow.length <= 3) {
                    let count = 0;
                    if (this.state.page === "cinema") {
                        count = 0;
                    } else if (this.state.page === "literature") {
                        count = 4;
                    } else if (this.state.page === "music") {
                        count = 8;
                    }
                    let card = listsToShow.map(list => {
                        console.log(list.category);
                        count++;
                        let id = "listCard" + count;
                        return <ListCard id={id} onClick={this.cardClick} category={list.category} listId={list._id} listItem={list} />;

                    });

                    this.setState({ cardComponents: card });
                } else {
                    for (var i = 0; i < 4; i++) {
                        //let randomNum = Math.floor((Math.random() * listsToShow.length));
                        let id = ""
                        if (this.state.page === "cinema") {
                            id = "listCard" + (i + 1);
                        } else if (this.state.page === "literature") {
                            id = "listCard" + (i + 5);
                        } else if (this.state.page === "music") {
                            id = "listCard" + (i + 9);
                        }

                        cardArray.push(<ListCard id={id} onClick={this.cardClick} category={listsToShow[i].category} listId={listsToShow[i]._id} listItem={listsToShow[i]} />);
                    }
                    this.setState({ cardComponents: cardArray });

                }


                //card(listsToShow);

                //console.log(card);

            } else {
                // console.log("null");
                this.setState({ cardComponents: [] });
            }

        });
    }

    friendsTest = [
        "friend1",
        "friend2",
        "friend3",
        "friend4"
    ];

    render() {
        /// Group of ListDisplays based on which type of list was clicked, each passes in same props
        if (this.state.renderList === true) {
            let array = this.state.recievedData
            let commentAray = this.state.currentComments

            // Return of list items if cinema is clicked on
            if (this.state.page === 'cinema') {
                return (
                    <div className="container">
                        {array.map(item => (
                            <ListDisplay comments={commentAray} clickId={this.state.cardClickId} synopsis={item.synopsis} id={item._id} name={item.title} image={item.artUri} author={item.director} />
                        ))}
                        {commentAray.map(comment => (
                            <h1>{comment}</h1>
                        ))}
                        <div className='container-fluid'>
                            <textarea onChange={this.handleChange} name="textarea" value={this.state.textarea} style={style2}></textarea>
                            <button onClick={() => this.sendComment(this.state.cardClickId)} style={style2} className="btn btn-success">Submit Comment</button>
                        </div>
                    </div>

                )
            }
            // Return of list items if cinema literature is clicked
            else if (this.state.page === 'literature') {
                return (
                    <div className='container'>
                        {array.map(item => (
                            <ListDisplay clickId={this.state.cardClickId} synopsis={item.synopsis} id={item._id} name={item.title} image={item.artUri} author={item.author} />
                        ))}
                        {commentAray.map(comment => (
                            <h1>{comment}</h1>
                        ))}
                        <div className='container-fluid'>
                            <textarea name="textarea" onChange={this.handleChange} value={this.state.textarea} style={style2}></textarea>
                            <button onClick={()=>this.sendComment(this.state.cardClickId)} className="btn btn-success form-block">Submit Comment</button>
                        </div>
                    </div>
                )
            }
            // Return of list items if not cinema or literature (aka has to be music, either songs or albums)
            else {
                console.log(array);
                return (
                    <div className='container'>
                        {array.map(item => (
                            <ListDisplay clickId={this.state.cardClickId} id={item._id} image={item.artUri} artist={item.artist} name={item.albumTitle} />
                        ))}
                        {commentAray.map(comment => (
                            <h1>{comment}</h1>
                        ))}
                        <div className='container-fluid'>
                            <textarea onChange={this.handleChange} name="textarea" value={this.state.textarea} style={style2}></textarea>
                            <button onClick={()=>this.sendComment(this.state.cardClickId)} className="btn btn-success form-block">Submit Comment</button>
                        </div>

                    </div>
                )
            }
        }
        return (

            <div>
                <div id="userInformation" className="row">
                    <div className="userAvatar">

                    </div>
                    <div className="col userName">
                        <h3>Hello, </h3>
                        <h1>{this.state.loginInfo.firstName}</h1>
                    </div>
                    <Link to="/findFriends">
                        <button className="btn btn-md" style={{ backgroundColor: "#B33434" }}>Find Friends</button>
                    </Link>
                    <Link to="/friends">
                        <button className="btn btn-md" style={{ backgroundColor: "#B33434" }}>View Friends</button>
                    </Link>
                </div>

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" onClick={this.handleClick}>
                        <a className="nav-link active" id="cinema-tab" data-toggle="tab" name="cinema" role="tab">Cinema</a>
                    </li>
                    <li className="nav-item" onClick={this.handleClick}>
                        <a className="nav-link" id="profile-tab" data-toggle="tab" name="literature" role="tab">Literature</a>
                    </li>
                    <li className="nav-item" onClick={this.handleClick}>
                        <a className="nav-link" id="contact-tab" data-toggle="tab" name="music" role="tab">Music</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">

                    <MainBody page={this.state.page} loginInfo={this.state.loginInfo} cards={this.state.cardComponents} />
                    <Recommended />
                    {/* {this.setComponentTimeout} */}
                </div>
            </div>
        );
    }
}

export default Header;