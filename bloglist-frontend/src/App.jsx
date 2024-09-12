import { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import blogService from './services/blogs';
import loginService from './services/login';
import CreateBlog from './components/CreateBlog';
import Togglable from './components/Togglable';
import Blog from './components/Blog';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const blogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch {
      setMessage('Wrong credentials');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    await blogService.create(blogObject);
    setBlogs(blogs.concat(blogObject));
    setMessage(`${blogObject.title} by ${blogObject.author}`);
    setTimeout(() => {
      setMessage('');
    }, 3000);
    await blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog);
      await blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
        await blogService.remove(id);
        const response = await blogService.getAll();
        setBlogs(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {user ? (
        <div>
          <h2>Profile</h2>
          {user.name} logged in <button onClick={logout}>logout</button>
          <Togglable
            buttonLabel="new blog"
            buttonLabel2="cancel"
            ref={blogFormRef}
          >
            <CreateBlog addBlog={addBlog} user={user} message={message} />
          </Togglable>
          <h2>Blogs</h2>
          <div>
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            ))}
          </div>
        </div>
      ) : (
        <Login
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          message={message}
        />
      )}
    </>
  );
};

export default App;
