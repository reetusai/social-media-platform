import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("current")) || null
  );

  if (page === "signup") {
    return <Signup go={setPage} />;
  }

  if (page === "admin") {
    return <Admin go={setPage} />;
  }

  if (!user) {
    return <Login setUser={setUser} go={setPage} />;
  }

  return <User user={user} setUser={setUser} go={setPage} />;
}


/* LOGIN */

function Login({ setUser, go }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function login() {
    if (email === "admin@gmail.com" && pass === "admin123") {
      go("admin");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === email && u.pass === pass
    );

    if (!found) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("current", JSON.stringify(found));
    setUser(found);
  }

  return (
    <div className="box">
      <h1>SocialHub</h1>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <p>
        New user?
        <span onClick={() => go("signup")}> Signup</span>
      </p>

      <button onClick={() => go("admin")}>
        Admin Login
      </button>
    </div>
  );
}


/* SIGNUP */

function Signup({ go }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function signup() {
    if (!name || !email || !pass) {
      alert("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }

    users.push({
      name: name,
      email: email,
      pass: pass
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");
    go("login");
  }

  return (
    <div className="box">
      <h1>SocialHub</h1>
      <h2>Create Account</h2>

      <input
        placeholder="Full Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button onClick={signup}>
        Create Account
      </button>

      <p>
        Already have an account?
        <span onClick={() => go("login")}> Login</span>
      </p>
    </div>
  );
}


/* USER MODULE */

function User({ user, setUser, go }) {
  const [text, setText] = useState("");
  const [profile, setProfile] = useState(false);

  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || []
  );

  function addPost() {
    if (!text.trim()) {
      alert("Write something first");
      return;
    }

    const newPost = {
      name: user.name,
      email: user.email,
      text: text,
      likes: 0
    };

    const updated = [newPost, ...posts];

    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
    setText("");
  }

  function likePost(index) {
    const updated = [...posts];

    updated[index].likes++;

    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  }

  function deletePost(index) {
    const updated = posts.filter((_, i) => i !== index);

    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  }

  function logout() {
    localStorage.removeItem("current");
    setUser(null);
    go("login");
  }

  return (
    <>
      <nav>
        <h2>SocialHub</h2>

        <button onClick={logout}>
          Logout
        </button>
      </nav>

      <div className="layout">

        <aside>
          <h3>Menu</h3>

          <button onClick={() => setProfile(false)}>
            Home
          </button>

          <button onClick={() => setProfile(true)}>
            Profile
          </button>
        </aside>

        <main>

          {!profile ? (
            <>
              <h2>Welcome, {user.name} 👋</h2>

              <div className="postbox">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                />

                <button onClick={addPost}>
                  Create Post
                </button>
              </div>

              <h2>Recent Posts</h2>

              {posts.length === 0 ? (
                <div className="card">
                  <p>No posts yet. Create your first post!</p>
                </div>
              ) : (
                posts.map((post, index) => (
                  <div className="post" key={index}>

                    <h3>{post.name}</h3>

                    <p>{post.text}</p>

                    <button
                      onClick={() => likePost(index)}
                    >
                      ❤️ Like {post.likes}
                    </button>

                    {post.email === user.email && (
                      <button
                        onClick={() => deletePost(index)}
                      >
                        Delete
                      </button>
                    )}

                  </div>
                ))
              )}
            </>
          ) : (
            <div className="card">
              <h2>My Profile</h2>

              <h3>{user.name}</h3>

              <p>
                <b>Email:</b> {user.email}
              </p>

              <p>
                <b>Account:</b> User
              </p>
            </div>
          )}

        </main>
      </div>
    </>
  );
}


/* ADMIN MODULE */

function Admin({ go }) {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || []
  );

  function deleteUser(index) {
    const updated = users.filter((_, i) => i !== index);

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  }

  function deletePost(index) {
    const updated = posts.filter((_, i) => i !== index);

    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  }

  function logout() {
    go("login");
  }

  return (
    <>
      <nav>
        <h2>SocialHub Admin</h2>

        <button onClick={logout}>
          Logout
        </button>
      </nav>

      <div className="admin">

        <h2>Admin Dashboard</h2>

        <div className="card">
          <h3>Total Users</h3>
          <h1>{users.length}</h1>
        </div>

        <h2>Manage Users</h2>

        {users.length === 0 ? (
          <div className="card">
            <p>No registered users.</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div className="row" key={index}>

              <div>
                <b>{user.name}</b>
                <br />
                <small>{user.email}</small>
              </div>

              <button
                onClick={() => deleteUser(index)}
              >
                Delete
              </button>

            </div>
          ))
        )}

        <h2>Manage Posts</h2>

        {posts.length === 0 ? (
          <div className="card">
            <p>No posts available.</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div className="post" key={index}>

              <h3>{post.name}</h3>

              <p>{post.text}</p>

              <p>
                ❤️ {post.likes} Likes
              </p>

              <button
                onClick={() => deletePost(index)}
              >
                Delete Post
              </button>

            </div>
          ))
        )}

      </div>
    </>
  );
}

export default App;