import React, { useState, useRef, useContext, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./Register.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Calendar } from 'primereact/calendar';
import { Messages } from 'primereact/messages';
import { GlobalContext } from "../Context/globalContext";

interface IregisterProps {
    togglePageMethod(): void
}

interface IregisterInputs {
    firstname?: string;
    lastname?: string;
    dob?: Date | string;
    email?: string;
    password?: string;
    confirmpassword?: string;
}

const Register: React.FC<IregisterProps> = (props) => {
    const [registerInputs, setregisterInputs] = useState<IregisterInputs>({
        firstname:'',
        confirmpassword:'',
        dob:'',
        email:'',
        lastname:'',
        password:''
    });

    const globalcontext = useContext(GlobalContext);
    const API_URL = process.env.REACT_APP_BASE_URL;

    const messageBox = useRef<Messages>(null);
    const validationSchema = Yup.object().shape({
        firstname: Yup.string().min(3, 'Min length of 3').max(30).required('First Name is required'),
        lastname: Yup.string().min(3, 'Min length 3').max(30).required('Last Name is required'),
        dob: Yup.date().max(new Date().getFullYear() - 18, 'Only age greater than 18 is allowed').required('Dob is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(8, 'Minimum 8 chars').required('Password is required'),
        confirmpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password not match').required('Confirm Password is required')
    });
    const frmMik = useFormik({
        initialValues: {
            ...registerInputs
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            setregisterInputs({...values});
            globalcontext?.setloading(true);
            registerUser();
            globalcontext?.setloading(false);
        }
    })

    useEffect(() => {
        setregisterInputs({...frmMik.values});
    },[frmMik.values])

    const registerUser = async () => {
        messageBox?.current?.clear();
        let obj = {
            fname: registerInputs?.firstname,
            lname: registerInputs?.lastname,
            email: registerInputs?.email,
            password: registerInputs?.password,
            dob: registerInputs?.dob
        }
        let response = await fetch(`${API_URL}api/registerUser/`, {
            body: JSON.stringify(obj),
            method: 'POST'
        }).then(async (x: any) => {
            let json = await x.json();
            return json
        }).catch((ex) => {
            messageBox?.current?.show({ severity: 'error', detail: 'Something went wrong.Please try later.', sticky: true })
            return null;
        });
        if (response) {
            if (response?.Error) {
                messageBox?.current?.show({ severity: 'error', detail: response?.Message, sticky: true })
            }
        }
    }
    return (
        <form className="registerWrapper" onSubmit={frmMik.handleSubmit}>
            <div>
                <h1>Sign up</h1>
            </div>
            <Messages ref={messageBox} />
            <div className="divInputCtl">
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="firstname" name="firstname" autoFocus value={frmMik.values.firstname}
                            onChange={frmMik.handleChange} onBlur={frmMik.handleBlur}
                            className="inputCtrl p-inputtext-lg block" type="text" autoComplete="off" />
                        <label htmlFor="username">First Name</label>
                    </span>
                    {
                        (frmMik.errors && frmMik.errors.firstname && (frmMik.touched?.firstname || false)) && <small className="p-error">{frmMik.errors.firstname}</small>
                    }
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="lastname" name="lastname" value={frmMik.values.lastname} onChange={frmMik.handleChange} onBlur={frmMik.handleBlur}
                            className="inputCtrl p-inputtext-lg block" type="text" autoComplete="off" />
                        <label htmlFor="username">Last Name</label>
                    </span>
                    {
                        (frmMik.errors && frmMik.errors.lastname && (frmMik.touched?.lastname || false)) && <small className="p-error">{frmMik.errors.lastname}</small>
                    }
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <Calendar id="dob" name="dob" value={frmMik.values.dob} onChange={frmMik.handleChange} onBlur={frmMik.handleBlur}
                            className="inputCtrl p-inputtext-lg block" />
                        <label htmlFor="dob">Date of Birth</label>
                    </span>
                    {
                        (frmMik.errors && frmMik.errors.dob && (frmMik.touched?.dob || false)) && <small className="p-error" >{frmMik.errors.dob}</small>
                    }
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="email" name="email" value={frmMik.values.email} onChange={frmMik.handleChange} onBlur={frmMik.handleBlur}
                            className="inputCtrl p-inputtext-lg block" type="email" autoComplete="off" />
                        <label htmlFor="email">Email ID</label>
                    </span>
                    {
                        (frmMik.errors && frmMik.errors.email && (frmMik.touched?.email || false)) && <small className="p-error" >{frmMik.errors.email}</small>
                    }
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="password" name="password" value={frmMik.values.password} onChange={frmMik.handleChange} onBlur={frmMik.handleBlur}
                            className="inputCtrl p-inputtext-lg block" type="password" autoComplete="new-password" />
                        <label htmlFor="password">Password</label>
                    </span>
                    {
                        (frmMik.errors && frmMik.errors.password && (frmMik.touched?.password || false)) && <small className="p-error" >{frmMik.errors.password}</small>
                    }
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="confirmpassword" name="confirmpassword" value={frmMik.values.confirmpassword} onChange={frmMik.handleChange} onBlur={frmMik.handleBlur}
                            className="inputCtrl p-inputtext-lg block" type="password" autoComplete="new-password" />
                        <label htmlFor="confirmpassword">Confirm Password</label>
                    </span>
                    {
                        (frmMik.errors && frmMik.errors.confirmpassword && (frmMik.touched?.confirmpassword || false)) && <small className="p-error" >{frmMik.errors.confirmpassword}</small>
                    }
                </div>
            </div>
            <div className="divBtnWrapper">
                <div>
                    <Button label="Sign up" type="submit" color="primary" />
                </div>
                <div>
                    <small>Have account <u onClick={() => props.togglePageMethod()} >Login here</u></small>
                </div>
            </div>
        </form>
    )
}

export default Register;