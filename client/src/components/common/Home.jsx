import React from "react";
import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import { adminContextObj } from "../../contexts/AdminContext.jsx";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { currentAdmin, setCurrentAdmin } = useContext(adminContextObj);

  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // console.log("isSignedIn :", isSignedIn);
  console.log("user :", user);
  // console.log("isLoaded :", isLoaded);

  async function onSelectRole(e) {
    //clear error property
    setError("");
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    currentAdmin.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === "author") {
        res = await axios.post(
          "http://localhost:3000/author-api/author",
          currentUser
        );
        let { message, payload } = res.data;
        if (message === "author") {
          setCurrentUser({
            ...currentUser,
            ...payload,
          });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === "user") {
        res = await axios.post(
          "http://localhost:3000/user-api/user",
          currentUser
        );
        let { message, payload } = res.data;
        if (message === "user") {
          setCurrentUser({
            ...currentUser,
            ...payload,
          });
          //save user to localstorage
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === "admin") {
        res = await axios.post(
          "http://localhost:3000/admin-api/admin",
          currentAdmin
        );
        let { message, payload } = res.data;
        console.log(message);
        if (message === "admin") {
          setCurrentAdmin({
            ...currentAdmin,
            ...payload,
          });
          //save user to local storage
          localStorage.setItem("currentadmin", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  console.log("current user : ", currentUser);
  console.log("current admin: ", currentAdmin);
  
  useEffect(() => {
    setCurrentUser({
      ...currentUser,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });
    setCurrentAdmin({
      ...currentAdmin,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });
  }, [isLoaded]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`author-profile/${currentUser.email}`);
    }
    if (currentAdmin?.role === "admin" && error.length === 0) {
      navigate(`admin-profile/${currentAdmin.email}`);
    }
  }, [currentUser, currentAdmin]);

  return (
    <div className="container">
      {isSignedIn === false && (
        <div>
          <p className="lead">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            adipisci ratione aut id autem aliquid eligendi, odit aperiam quasi,
            quisquam nisi veniam a! Commodi sit suscipit voluptates, excepturi,
            quia quos praesentium distinctio fugit illum pariatur fuga maxime
            nihil ducimus sapiente quas consectetur explicabo unde, voluptatibus
            non fugiat sint? Facilis beatae, ab culpa obcaecati ullam
            aspernatur. Numquam aliquam reiciendis cupiditate magni, expedita
            itaque delectus accusamus sint unde aliquid soluta omnis quo. Quam
            iste, cupiditate ipsa molestiae odio ducimus eius vero provident
            fugiat in explicabo. Laboriosam praesentium aspernatur fuga soluta
            vel placeat magnam sint consequuntur recusandae quae, et at, vero ut
            necessitatibus!
          </p>
          <p className="lead">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            adipisci ratione aut id autem aliquid eligendi, odit aperiam quasi,
            quisquam nisi veniam a! Commodi sit suscipit voluptates, excepturi,
            quia quos praesentium distinctio fugit illum pariatur fuga maxime
            nihil ducimus sapiente quas consectetur explicabo unde, voluptatibus
            non fugiat sint? Facilis beatae, ab culpa obcaecati ullam
            aspernatur. Numquam aliquam reiciendis cupiditate magni, expedita
            itaque delectus accusamus sint unde aliquid soluta omnis quo. Quam
            iste, cupiditate ipsa molestiae odio ducimus eius vero provident
            fugiat in explicabo. Laboriosam praesentium aspernatur fuga soluta
            vel placeat magnam sint consequuntur recusandae quae, et at, vero ut
            necessitatibus!
          </p>
          <p className="lead">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            adipisci ratione aut id autem aliquid eligendi, odit aperiam quasi,
            quisquam nisi veniam a! Commodi sit suscipit voluptates, excepturi,
            quia quos praesentium distinctio fugit illum pariatur fuga maxime
            nihil ducimus sapiente quas consectetur explicabo unde, voluptatibus
            non fugiat sint? Facilis beatae, ab culpa obcaecati ullam
            aspernatur. Numquam aliquam reiciendis cupiditate magni, expedita
            itaque delectus accusamus sint unde aliquid soluta omnis quo. Quam
            iste, cupiditate ipsa molestiae odio ducimus eius vero provident
            fugiat in explicabo. Laboriosam praesentium aspernatur fuga soluta
            vel placeat magnam sint consequuntur recusandae quae, et at, vero ut
            necessitatibus!
          </p>
        </div>
      )}
      {isSignedIn === true && (
        <div>
          <div className="d-flex justify-content-evenly bg-info p-3">
            <img
              src={user.imageUrl}
              width="100px"
              height="100px"
              className="rounded-circle"
            />
            <p className="display-6">
              {user.firstName} <br /> {user.emailAddresses[0].emailAddress}
            </p>
          </div>
          <p className="lead">Select role</p>
          {error.length !== 0 && (
            <p
              className="text-danger fs-5 font-monospace"
              style={{ fontFamily: "sans-serif" }}
            >
              {error}
            </p>
          )}
          <div className="d-flex role-radio py-3 justify-content-center">
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="author"
                id="author"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="author" className="form-check-label">
                Author
              </label>
            </div>
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="user"
                id="user"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="user" className="form-check-label">
                User
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                value="admin"
                id="admin"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="admin" className="form-check-label">
                Admin
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
