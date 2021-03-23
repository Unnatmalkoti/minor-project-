import React from 'react';
import Button from '../shared/ui/Button/Button';
import {Input} from '../shared/ui/Input/Input';
import styles from './NewJobForm.module.css';
import QualInput from './QualInput';

import {db} from '../../firebase';

const inputStyles={
    'fontSize':14
}

export default class NewJobForm extends React.Component{
    state = {
        nextButton:{
            text:"Next",
            icon:"",
        },
        open:false,
        form : {
            step:"1",

            "1":{
                "Job Type":{ 
                    value:"On Campus", 
                    elementConfig:{
                        name:"position", 
                        options:["On Campus", "Off Campus"]
                    },
                    elementType:"radio",
                    skip:true,
                    validation:"required"
                },
                "Job Position":{value:"", elementType:"input" , name:'title', validation:"required"},
                "Job Location": {value:"", elementType:"input", name:'job_loc', validation:"required"},
                "Placement Drive Location":{ value:"", elementType:"input", name:'drive_loc', validation:"required"},
                "Employment Type":{ 
                    value:"", 
                    elementConfig:{
                        name:"employment Type", 
                        options:["Full Time", "Internship", 'Freelance']
                    },
                    elementType:"radio",
                    name:"type",
                    validation:"required"
                },
                "CTC": {value:"", elementType:'input' , prefix:"₹", postfix:"MONTHLY", 
                        elementConfig:{type:'number', min:0}, name:"ctc", validation:"required"},
                "Job Category":{ value:"", elementType:'input', name:'category', validation:"required"},
                "Deadline":{value:'', elementType:'input', name:'deadline' ,validation:"required",
                elementConfig:{
                    type:'date'
                }},
            },
            "2-campus":{
                "Qualifications":{
                    value:[],
                    validation:"required",
                },
                "Xth Percentage":{ 
                    value:0, 
                    name:"xth", 
                    elementConfig:{
                        options:[0,60,70,80,90]
                    },
                    elementType:"select"
                },
                "XIIth Percentage":{ 
                    value:0, 
                    name:"xiith",
                    elementConfig:{
                        
                        options:[0,60,70,80,90]
                    },
                    elementType:"select"
                },
                "Bachelors Percentage":{ 
                    value:0, 
                    elementConfig:{
                        name:"bachelorsPercentage", 
                        options:[0,60,70,80,90]
                    },
                    elementType:"select",
                    name:"bachelors", 
                },
                
            },
            "3-campus":{
                "Schedule":{
                    value:"",
                    elementType:"textarea",
                    elementConfig:{ rows:5},
                    name:'schedule',
                    validation:"required",
                },
                "Job Description":{
                    value:"",
                    elementType:"textarea",
                    elementConfig:{ rows:10},
                    name:'desc',
                    validation:"required",
                }
            },
            "2-open":{
                "Schedule":{
                    value:"",
                    elementType:"textarea",
                    elementConfig:{ rows:5},
                    name:'schedule',
                    validation:"required",
                },
                "Job Description":{
                    value:"",
                    elementType:"textarea",
                    elementConfig:{ rows:10},
                    name:'desc',
                    validation:"required",
                }
            }
        }
    }

    nextButtonHandler=(e)=>{
        let form = {...this.state.form};
        let open = this.state.form["1"]["Job Type"].value =="Off Campus";
        let step = this.state.form.step;
        let stepCtn = Number(step[0]);

        if(this.validateSection(step)) return;

        let nextButton = {...this.state.nextButton};
        const maxSteps = open? 2: 3;

        nextButton.text= stepCtn == maxSteps-1 ? "Create Job Posting" : "Next";
        if(stepCtn == maxSteps)
            this.createJob();
        else
        {
            step = `${stepCtn+1}-${open?"open":"campus"}`;
            form.step = step; 
            this.setState({form, nextButton})
        }
        
    }


    inputChangeHandler=(e,step, label)=>{
        let inputState = {...this.state.form[step][label], value: e.target.value};

        this.setState({form:{...this.state.form, [step]:{...this.state.form[step], [label]:inputState}}})
        console.log(e.target.value, label, step)
    }

    validateSection(step){
        let hasErrors = false;
        let section = {...this.state.form[step]};

        for(let inputKey in section){
            let input = {...section[inputKey]};
            let errors= this.inputValidator(input);
            input['errors'] = errors;
            console.log(errors)
            section[inputKey] = input;
            if(errors.length > 0)
                hasErrors = true
        }

        this.setState({form:{...this.state.form, [step]:section}})
        return hasErrors;

    }

    inputValidator(input){
        if(!input.validation) return [];
        let errors = [], checks = input.validation.split(" ");

        if(checks.find(sub=> sub=='required'))
        {
            if (!input.value)
                errors.push("Required")
            else if (Object.keys(input.value).length == 0)
                errors.push("Required")
        }
        
        return errors;
    }

    inviteHandler=(invited)=>{
    
        let step = this.state.form.step;
        let qualifications = {...this.state.form[step].Qualifications};
        let oldInvited = [...this.state.form[step].Qualifications.value];

        if(oldInvited.find((val)=>{
            return val.degree == invited.degree &&
            val.course == invited.course &&
            val.year == invited.year &&
            val.college == invited.college &&
            val.branch == invited.branch

        })) return;

        qualifications.value = [...oldInvited, invited];

        this.setState({form:{...this.state.form, [step]:{...this.state.form[step], Qualifications:qualifications}}});
    }


    deleteInviteHandler=(i)=>{
        let step = this.state.form.step;
        let invited = [...this.state.form[step].Qualifications.value];
        let qualifications = {...this.state.form[step].Qualifications};

        invited.pop(i);
        qualifications.value = invited;
        this.setState({form:{...this.state.form, [step]:{...this.state.form[step], Qualifications:qualifications}}});
    }
    
    
    async createJob(){
        let job ={};
        let form = {...this.state.form};
        let open = this.state.form["1"]["Job Type"].value =="Off Campus";
        job['campus'] = !open;
        const openSteps = ["1","2-open"], campusSteps= ["1", "2-campus", "3-campus"];
        let steps = open? openSteps : campusSteps;
        
        steps.forEach(sectionKey=>{
            console.log(sectionKey);
            let section = form[sectionKey];
            if(sectionKey == "2-campus") return;

            for(let inputKey in section){
                let input = section[inputKey];
                if(input.skip) continue;
                job[input.name] = input.value;
            }
        });

        let edu =[], percentages={'diploma': createPercentage(0), 'bachelors':createPercentage(0), 'masters':createPercentage(0),'xth':createPercentage(0), 'xiith':createPercentage(0)};
        let qualSection = form['2-campus'];
        
        if(!open){
        for(let inputKey in qualSection)
        {
            if(inputKey=='Qualifications')
                qualSection[inputKey].value.forEach(invited=>{
                    edu.push(`${invited.college}#${invited.degree}#${invited.course}#${invited.branch}#${invited.year}`)
                })
            else {
                let input = qualSection[inputKey];
                percentages[input.name] = createPercentage(input.value); 
            }   
        }

        
        job['edu'] = edu;
        job['marks'] = percentages;
        }

        job['status'] = true
        job['easy_apply'] = false;
        job['creatorid'] = "company@ensvee.com";
        job['created'] = new Date();
        job['deadline'] = new Date(job['deadline']);
        job['placed'] = false

        await db.collection('jobs').doc().set(job);
        alert("Job Created")
    }


    render(){
        let Slide;
        switch(this.state.form.step){
            case "1":
                Slide = <TwoColSlide step={this.state.form.step} inputs={this.state.form[this.state.form.step]} inputHandler={this.inputChangeHandler}/>;
                break;    
            case "2-campus":
                Slide = <QualSlide inviteHandler={this.inviteHandler} deleteInviteHandler={this.deleteInviteHandler}  step={this.state.form.step} inputs={this.state.form[this.state.form.step]} inputHandler={this.inputChangeHandler}/>;
                break;
            case "3-campus":
            case "2-open":
                Slide = <OneColSlide step={this.state.form.step} inputs={this.state.form[this.state.form.step]} inputHandler={this.inputChangeHandler}/>;
                break;
        }

        return(
            <div className={styles.ModalContent}>
                {Slide}
                <Button clicked={this.nextButtonHandler} style={{width:"unset", display:'block', margin:'auto'}} primary>{this.state.nextButton.text}</Button>
            </div>)
    }
}

const OneColSlide = (props)=>{
    return (
    <div className={styles.Slide}>
        {Object.keys(props.inputs).map((key, i) =><Input inputHandler={(e)=>props.inputHandler(e,props.step, key)} key={key} label={`${i+1}. ${key}`} {...props.inputs[key]} style={inputStyles}/>)}
    </div>)
}

const TwoColSlide = (props)=>{
    return  (<div className={[styles.Slide,styles.TwoCol].join(" ")}>
        {Object.keys(props.inputs).map((key, i) =><Input inputHandler={(e)=>props.inputHandler(e,props.step, key)} key={key} label={`${i+1}. ${key}`} {...props.inputs[key]} style={inputStyles}/>)}
    </div>)
}

const QualSlide = (props)=>{
    return  (<div className={styles.Slide}>
        <QualInput inviteHandler={props.inviteHandler} deleteHandler={props.deleteInviteHandler} label={`${9}. Qualifications`} {...props.inputs['Qualifications']}/>
        <div className={styles.Row}>
            {Object.keys(props.inputs).map((key, i) => {
                if(key !="Qualifications")
                return <Input inputHandler={(e)=>props.inputHandler(e,props.step, key)} key={key} label={`${key}`} style={inputStyles} {...props.inputs[key]}/>
            })}
        </div> 
    </div>)
}

const createPercentage =(val)=>({
    0 : 0  >= Number(val),
    60: 60 >= Number(val),
    70: 70 >= Number(val),
    80: 80 >= Number(val),
    90: 90 >= Number(val),
})