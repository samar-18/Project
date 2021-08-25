 /* eslint-disable */
import React, { useEffect, useState } from "react";
import Footer from "../../Footer";
import axios from "axios";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useSelector, useDispatch } from "react-redux";

import "./index.css";
import io from "socket.io-client";
import { SetData } from "../../actions";
import NewPost from "../NewPost/NewPost";
import { useHistory } from "react-router-dom";
const socket = io("http://localhost:5000");

 const Home = () => {

 

  const history = useHistory();
  const dispatch = useDispatch();

  const [Array, setArray] = useState([]);
  const [DisableLIKE, setDisableLIKE] = useState(false);
  const UserData = useSelector((state) => state.UserData);
  const [Modal, setModal] = useState(false);

  var Posts = [];
  Posts = useSelector((state) => state.Posts);

  useEffect(() => {
  
    GetPosts();
  }, []);

 

  useEffect(() => {
    socket.on("LIKE", (data) => {
      dispatch(SetData(data));
    });
  }, [Array]);

  const LIKE = async (PostId) => {
    document.getElementById(PostId).disabled = true;
    let data = {
      PostId,
      UserId: UserData._id,
    };

    const index = Posts.findIndex((el) => el._id === PostId);
    var arr = Posts;
    if (arr[index].likes.includes(UserData._id)) {
      var i = arr[index].likes.indexOf(UserData._id);
      if (index !== -1) arr[index].likes.splice(i, 1);
    } else {
      arr[index].likes.push(UserData._id);
    }
    dispatch(SetData([]));
    dispatch(SetData(arr));

    socket.emit("LIKE", data);
  };

  const show_modal = () => {
    setModal(true);
  };

  const GetPosts = () => {
    axios
      .get("http://localhost:5000/get_posts")
      .then(function (res) {
        // handle success
        dispatch(SetData(res.data));
        setArray(res.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const SinglePost = (PostID) =>{
    history.push(`/post/${PostID}`)
  }

  return (
    <div>
      <div onClick={() => show_modal()} className="ADD">
      <i class="bi bi-camera" ></i> 
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
</svg> 
      </div>
      {Modal && <NewPost HideModal={() => setModal(false)} />}
      <div>
        <h1>Let's Go Camping </h1>
        <h4> Welcom <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
</svg> </h4>

        <ResponsiveMasonry
          className="masonry"
          columnsCo
          untBreakPoints={{ 450: 1, 550: 2, 900: 3 }}
        >
          <Masonry>
            {Posts.map((post) => (
              <div key={post._id} className="">
                <div className="single-post">
                <div  onClick={()=> SinglePost(post._id) } className="owner">
                <i className="far fa-user-circle"></i>
                     {post.owner} </div>
                  <img onClick={()=> SinglePost(post._id) } className="img-places" src={post.img} alt="" />
                  <div className="desc"> 
                  {
                      post.description.length > 0 ? post.description : 
                      <p className="no-desc">No description</p>
                  }
                   </div>
                  <div className="like-section">
                    <span className="like-count"> {post.likes.length} </span>

                    <button
                      className="button-like"
                      id={post._id}
                      onClick={() => LIKE(post._id)}
                    >
                      {post.likes.includes(UserData._id) ? (
                        <i
                          style={{ color: " #f44336" }}
                          className="fas fa-heart"
                        ></i>
                      ) : (
                        <i className="far fa-heart"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        <Footer />
      </div>
    </div>
  );
};


export default Home