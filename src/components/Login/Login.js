import React, {Component} from 'react';
import LoginForm from './LoginForm';
import logo from '../../assets/images/ensvee-logo.svg';
import shapes from '../../assets/shapes/login-shapes.svg';
import styles from './Login.module.css';
import {connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';


class Login extends Component{
    render(){
        if(this.props.isAuthenticated)
        return <Redirect to="/"/>

        return(
            <div className={styles.LoginGrid}>
                
                <div className={styles.LoginSide}>
                    <img src={logo} className={styles.Logo}/>
                    <h1 className={styles.H1}>Please log in.</h1>
                    <LoginForm></LoginForm>
                    <div className={styles.linksContainer}>
                        <Link style={{ textDecoration: 'none' }} to='/forgorpassword'><p className={styles.linkText}>Forgot Password?</p></Link>
                        <Link style={{ textDecoration: 'none' }} to='/signup'><p style={{marginTop:'10px'}}className={styles.linkText}>New User? Sign up now</p></Link>
                    </div>
                </div>
                <div className={styles.IllustrationSide}>
                    <img src={shapes} className={styles.LoginShapes}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps  = (state)=>({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
})


export default connect(mapStateToProps, null)(Login);