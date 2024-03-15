import * as Yup from 'yup'

const loginValidationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
        .required("phone number is required")
        .min(10, "phone number should be atleast 10 digits"),
    password: Yup.string()
        .required("Password is required")
        .min(4, "Password should be at least 6 chars")
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
});
export default loginValidationSchema;