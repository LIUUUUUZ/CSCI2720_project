import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = (e) => {
    e.preventDefault();
    // 处理登录逻辑
    // 这里可以调用后端 API 进行验证等操作
    // 示例中暂未包含完整的登录逻辑

    // 在这里设置错误消息，如果登录失败的话
    setErrorMessage('登录失败，请检查您的凭据。');
  };

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={login}>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Link to="/signup">Don't have an account? Sign up</Link>
      <br />
      <br />
      <Link to="/forget-password">Forget password?</Link>
    </div>
  );
}

export default LoginForm;