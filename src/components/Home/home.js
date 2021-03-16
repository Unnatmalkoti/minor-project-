import React, { createRef, Fragment} from 'react';
import {connect} from 'react-redux';
import {Logout as logoutAction} from '../../store/actions/auth';
import {FetchAllJobs as FetchJobsAction } from '../../store/actions/jobs';

import './home.css';
import Logo from './images/ensvee-logo.svg';
import Slider from './Slider.js';
import Button from '../../components/shared/ui/Button/Button.js';
import HomeInfo from './HomeInfo.js';
import Modal from '../shared/ui/Modal/Modal';
import Loader from '../shared/ui/Loader/Loader';


class Home extends React.Component{

  componentDidMount(){
    this.props.getJobs();
    console.log('Component did mount');
  }

    render(){
        return(
        <div className="home-container">
            <Modal show={true} style={ {maxWidth: 840, background: "#FFFFFF", boxShadow: "0px 26px 24px -20px rgba(0, 0, 0, 0.25)", borderRadius: "14px",}} closeHandler={console.log("band 1")}>
              <HomeInfo closeHandler={console.log("band 2")} />
            </Modal>
            <div className='home-top-bar'>
              <img className='logo' src= {Logo} />
              <Button className='log-out' clicked={this.props.logout} width="127px" height="51px" style={{position:'absolute', right:'29px', top:'30px'}}>Log Out</Button>
              <p className='job-postings'>Job Postings</p>
            </div>
            { this.props.jobsState.refLoading ? 
            <div className="central-loader"><Loader/></div>
            
            : 
            <Fragment>
              <Slider />
            </Fragment>}
            <div className='bottom-container'>
              <p className='announcement-text'>
                more features comming soon
              </p>
            </div>
        </div>);
    }
}


const mapDispatchToProps = (dispatch) => ({
    logout : ()=> dispatch(logoutAction()),
    getJobs: ()=> dispatch(FetchJobsAction()),
})

const mapStateToProps = (state)=>({
  jobsState: state.jobs
})

export default connect(mapStateToProps, mapDispatchToProps) (Home);
