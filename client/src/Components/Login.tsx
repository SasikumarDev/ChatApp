import React from "react";
import './Login.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useFormik } from "formik";
import * as yup from 'yup';

type loginInputs = { username: string, password: string }

interface IloginProps {
    togglePageMethod(): void
}

const Login: React.FC<IloginProps> = (props) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: yup.object({
            username: yup.string().email('Invalid email ID').required('Required'),
            password: yup.string().min(4, 'Min length of 4').max(18).required('Required')
        }),
        onSubmit: (values) => {
            console.log(values)
        }
    });

    const isFormFieldValid = (name: keyof loginInputs) => !!(formik.errors[name]);
    const getFormErrorMessage = (name: keyof loginInputs) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return <form className="loginWrapper">
        <div>
            <h1>Login</h1>
        </div>
        <div className="divInputCtl">
            <div className="field">
                <span className="p-input-icon-left">
                    <i className="pi pi-user" />
                    {/* <InputText id="username" onChange={formik.values.username} className="inputCtrl p-inputtext-lg block" placeholder="Username or Email" /> */}
                    <InputText id="username" name="username" value={formik.values.username}
                        onChange={formik.handleChange} autoFocus placeholder="Username or Email"
                        className="inputCtrl p-inputtext-lg block" type="email" autoComplete="off" />
                </span>
                {getFormErrorMessage('username')}
            </div>
            <div className="field">
                <span className="p-input-icon-left">
                    <i className="pi pi-lock" />
                    <InputText id="password" name="password" value={formik.values.password} onChange={formik.handleChange}
                        className="inputCtrl p-inputtext-lg block" placeholder="Password" type="password" autoComplete="new-password" />
                </span>
                {getFormErrorMessage('password')}
            </div>
        </div>
        <div className="divBtnWrapper">
            <div>
                <small>forgot password</small>
            </div>
            <div>
                <Button label="Login" color="primary" />
            </div>
            <div>
                <small>don't you have an account? <u onClick={() => props.togglePageMethod()}>Sign-up here</u></small>
            </div>
        </div>
    </form>
}

export default Login;