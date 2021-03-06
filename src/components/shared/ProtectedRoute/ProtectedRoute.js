import React from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
// import {withAlerts} from '../../Alerts/AlertsContext';
import {Logout as logoutAction} from '../../../store/actions/auth';

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated =this.props.isAuthenticated;
        const profile = this.props.profile;

        if(isAuthenticated==false)
        {
            let next = encodeURIComponent(this.props.computedMatch.url)
            
            return <Redirect to={{ pathname: '/login', state:{ from: this.props.location }}} />
        }

        let renderedComp = null;

        if(this.props.ignoreVerification || profile?.verified )
            renderedComp = Component ? <Component {...this.props} /> : this.props.render(this.props);

        else if(!profile)
            renderedComp = <Redirect to={{pathname: '/createaccount'}}/>

        return renderedComp;
    }
}

const mapStateToProps  = (state)=>({
    user: state.auth.user,
    profile: state.auth.profile,
    isAuthenticated: state.auth.isAuthenticated,
})

const mapDispatchToProps = (dispatch) => ({
    logout : ()=> dispatch(logoutAction()),
})


export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);