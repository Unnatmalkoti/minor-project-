import * as actionTypes from './actionTypes';
import firebase from '../../firebase';

const db = firebase.firestore();


//-----------------Fetch All Job---------------------

export const FetchAllJobs = ()=>{
    return async (dispatch, getState) => {
        const {auth} = getState();

        dispatch(FetchAllJobsStart())
        // let companyDocSnap = await db.collection('company').where('email','==', auth.user.email).get();
        // if(companyDocSnap.empty);

        // //getting refDocs
        // let companyDocRef = companyDocSnap.docs[0].ref;
        let jobsRefsDocList = await db.collection('jobs').where("creatorid", "==", auth.user.email).orderBy('time', 'desc').get();
        
        let jobs = [];
        jobsRefsDocList.forEach(doc=>{
            let jobRef = doc.data().jobRef;
            jobs.push({ref:jobRef, id: jobRef.id});
        }) 
        dispatch(FetchAllJobRefsSuccess(jobs))

        jobs.forEach(job=>{
            dispatch(FetchJob(job.ref))
        })
    }
}

export const FetchAllJobsStart = ()=>({
    type: actionTypes.FETCH_ALL_JOBS,
});


export const FetchAllJobRefsSuccess = (jobs)=>({
        type: actionTypes.FETCH_ALL_JOB_REFS_SUCCESS,
        payload: jobs,
    })


//-----------------Fetch Single Job---------------------

export const FetchJob = (ref)=>{
    return async (dispatch)=>{
        dispatch(FetchJobStart())
        try{
            let jobDoc = await ref.collection('jobInformation').doc('allDetails').get();
            dispatch(FetchJobSuccess(jobDoc, ref.id))
        }
        catch(e){
            dispatch(FetchJobFailed(e))
            console.log(e);
        }
    }
}

export const FetchJobStart = ()=>({
    type: actionTypes.FETCH_JOB,
});

export const FetchJobSuccess = (jobDoc, id)=>({
    type: actionTypes.FETCH_JOB_SUCCESS,
    payload: {jobDoc, id},
});

export const FetchJobFailed = (error)=>({
    type: actionTypes.FETCH_JOB_FAILED,
    payload: error
});





export const FetchAppliedStudents = (jobId)=>{
    return (dispatch, getState)=>{
        
    }
}

//-----------------Fetch Job Details---------------------

export const FetchJobDetails = (jobId) =>{
    return async (dispatch, getState) => {
        const {auth}=getState();
        dispatch(FetchJobDetailsStart());
        // let companyDocSnap = await db.collection('companies').where('email','==', auth.user.email).get();
        // if(companyDocSnap.empty);
        // let companyDocRef = companyDocSnap.docs[0].ref;

        // let jobRefDoc = (await db.collection('jobs').get().jobid).data()['jobRef'];
        let jobInfo = await db.collection('jobs').where('jobid', '==', jobId).get();
        console.log('Dispatch')
        dispatch(FetchJobDetailsSuccess(jobInfo))
        // let {jobs} = getState();
        // jobs.appliedStudents.forEach(student=>{
        //     dispatch(FetchStudent(student.email))
        // })
    }
}

export const FetchJobDetailsStart = ()=>({
    type:actionTypes.FETCH_JOB_DETAILS
})

export const FetchJobDetailsSuccess = (jobInfo)=>({
    type: actionTypes.FETCH_JOB_DETAILS_SUCCESS,
    payload: jobInfo
})


//-----------------Fetch Student---------------------

export const FetchStudent = (email)=>{
    return async (dispatch)=>{
        // console.log('Student Fetch Start');
        dispatch(FetchStudentStart(email))
        try{
            let studentDoc = await db.collection('student').doc(email).get();
            // console.log('Student Fetch end');
            dispatch(FetchStudentSuccess(studentDoc));
            // console.log('Student Fetch end end');
        }
        catch(e)
        {
            console.log(e);
            dispatch(FetchStudentFailed(e, email))
        }

    }
}

export const FetchStudentStart= (email)=>({
    type:actionTypes.FETCH_STUDENT_START,
    payload:{email}
})

export const FetchStudentSuccess = (student)=>({
    type: actionTypes.FETCH_STUDENT_SUCCESS,
    payload:student
})

export const FetchStudentFailed = (error, id)=>({
    type: actionTypes.FETCH_STUDENT_FAILED,
    payload: {studentId:id,  error}
})

// ---------------- Filters -------------------

export const ApplyFilters = (filters)=>{
    return (dispatch)=>{
        dispatch(ApplyFilterStart(filters));

    }
}

export const ApplyFilterStart = (filters)=>({
    type: actionTypes.APPLY_FILTERS,
    payload: filters
})


export const Search = (query)=>({
    type:actionTypes.SEARCH,
    payload:query
})