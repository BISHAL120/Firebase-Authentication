import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import './App.css';
import app from './firebase.init';
import { useState } from 'react';

const auth = getAuth(app);


function App() {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registered, setRegistered] = useState(false);


  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleNameBlur = event => {
    setName(event.target.value);
  }

  const handleregisteredchanged = event => {
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = event => {
    event.preventDefault();

    if(registered) {
      // console.log(email, password);
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setEmail('');
        setPassword('');
        varifyEmailAdress();
        setusername();
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
      })
    }
  }
  
  const handleforgetpassword = () => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log('email sent')
  })
  .catch(error => {
    console.error(error);
  });
  }

  const varifyEmailAdress = () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log('Email verification send');
    })
  }

  const setusername = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() => {
      console.log('name is updated', name)
    })
    .catch(error => {
      console.error(error);
      setError(error.message);
    })
  }

  return (
    <div>
      <div className='registration w-50 mx-auto mt-5'>
        <h2 className='text-primary'>Please {registered ? 'Login' : 'Register'}!!</h2>
        <Form onSubmit={handleFormSubmit}>
          {!registered && 
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Name" required />
            <Form.Text className="text-muted">
              Please enter your name here.
            </Form.Text>
          </Form.Group>
          }
          
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleregisteredchanged} type="checkbox" label="Already registered" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handleforgetpassword} variant="Link">Forget password</Button>
          <br />
          <Button variant="primary" type="submit">
          {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;