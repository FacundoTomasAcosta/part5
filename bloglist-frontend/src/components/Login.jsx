import PropTypes from 'prop-types';

const Login = ({
  handleLogin,
  username,
  password,
  setUsername,
  setPassword,
  message,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      {message == 'Wrong credentials' && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          username{' '}
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  message: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
};

export default Login;
