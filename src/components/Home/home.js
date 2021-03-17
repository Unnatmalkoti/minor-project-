import React, { createRef, Fragment} from 'react';
import {connect} from 'react-redux';
import {Logout as logoutAction} from '../../store/actions/auth';
import {FetchAllJobs as FetchJobsAction } from '../../store/actions/jobs';
import {Route, withRouter} from 'react-router-dom';


import './home.css';
import Logo from '../../assets/images/ensvee-logo.svg';
import Slider from './Slider.js';
import Button from '../../components/shared/ui/Button/Button.js';
import HomeInfo from './HomeInfo.js';
import Modal from '../shared/ui/Modal/Modal';
import Loader from '../shared/ui/Loader/Loader';
import BottomNav from './BottomNav';
import {ModalWithHeader} from '../shared/ui/Modal/Modal';
import NewJobForm from '../NewJobForm/NewJobForm';
import {db} from '../../firebase';

class Home extends React.Component{
  state = {
    jobs:[],
    loading:true,
  }

  async componentDidMount(){

    let jobsDocs = await db.collection('jobs').get();
    let jobs = [];
    jobsDocs.forEach(jobDoc=>{
      let job = jobDoc.data();
      job.id = jobDoc.id;
      jobs.push(job);
    })

    this.setState({jobs, loading:false})
    console.log('Component did mount');
    // this.props.getJobs();
  }
  modalCloseHandler = ()=>{
    this.props.history.push("/")
  }
    render(){
        return(
        <div className="home-container">
            <Modal show={false} style={ {maxWidth: 840, background: "#FFFFFF", boxShadow: "0px 26px 24px -20px rgba(0, 0, 0, 0.25)", borderRadius: "14px",}} closeHandler={console.log("band 1")}>
              <HomeInfo closeHandler={console.log("band 2")} />
            </Modal>
            <div className='home-top-bar'>
              <img className='logo' src= {Logo} />
              <Button className='log-out' clicked={this.props.logout} width="127px" height="51px" style={{position:'absolute', right:'29px', top:'30px'}}>Log Out</Button>
              <p className='job-postings'>Job Postings</p>
            </div>
            { this.state.loading ? 
            <div className="central-loader"><Loader/></div>
            
            : 
            <Fragment>
              <Slider jobs={this.state.jobs}/>
            </Fragment>}
            
            <Route exact path={`/new`}  >
              <ModalWithHeader title="Create New Job Posting" show={true} closeHandler={this.modalCloseHandler}>
                  <NewJobForm close={this.modalCloseHandler}/>
              </ModalWithHeader>
            </Route>
            <BottomNav/>
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

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(Home));
