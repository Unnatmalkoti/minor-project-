import React, {Component} from 'react';
import LoginForm from './LoginForm';
import logo from '../../assets/images/ensvee-logo.svg';
import shapes from '../../assets/shapes/login-shapes.svg';
import styles from './Login.module.css';
import {connect } from 'react-redux';
import Partners from './Partners';
import { Redirect, Link } from 'react-router-dom';
import {auth} from '../../firebase';


class Login extends Component{
    render(){
        let token = new URLSearchParams(this.props.location.search).get("token");
        if(token){
            auth.signInWithCustomToken(token).catch(e=>console.log(e));
        }

        if(this.props.isAuthenticated)
        {
            const from = this.props.location?.state?.from || { pathname: "/" }
            this.props.history.push(from)
        }

        return(
            <div className={styles.LoginGrid}>
                
                <div className={styles.LoginSide}>
                    <img src={logo} className={styles.Logo}/>
                    <h1 className={styles.H1}>Please log in.</h1>
                    <LoginForm></LoginForm>
                    <div className={styles.linksContainer}>
                        <Link style={{ textDecoration: 'none' }} to='/forgotpassword'><p className={styles.linkText}>Forgot Password?</p></Link>
                        <Link style={{ textDecoration: 'none' }} to='/signup'><p style={{marginTop:'10px'}}className={styles.linkText}>New User? Sign up now</p></Link>
                    </div>
                </div>
                <div className={styles.IllustrationSide}>
                    <Partners/>
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