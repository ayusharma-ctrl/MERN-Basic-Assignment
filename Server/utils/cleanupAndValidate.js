import validator from 'validator';


// func to clean up and validate the received data from client side, this will return a promise either reject or resolve
export const cleanupAndValidateRegister = ({ name, email, password, confirmPassword }) => {
    return new Promise((resolve, reject) => {
        if (!name || !email || !password || !confirmPassword) {
            reject("Missing Credentials");
        }
        if (typeof name !== "string") reject("Invalid Email");
        if (typeof email !== "string") reject("Invalid Name");

        if (name.length <= 2 || name.length > 50) {
            reject("Name should be 3-50 charachters long");
        }
        if (password.length < 6 || password.length > 25) {
            reject("Password should be 6-25 charachters long");
        }

        if (!hasLowerCase(password)) {
            reject("Password should have at least 1 lower case letter");
        }

        if (!hasUpperCase(password)) {
            reject("Password should have at least 1 upper case letter");
        }

        if (!validator.isEmail(email)) {
            reject("Invalid Email!");
        }
        
        if (password !== confirmPassword) {
            reject("Password and Confirm Password are not same!");
        }

        resolve();
    })
}

const hasUpperCase = (str) => {
    for (var i = 0; i < str.length; i++) {
        if (str[i] >= 'A' && str[i] <= 'Z') {
            return true;
        }
    }
    return false;
}

const hasLowerCase = (str) => {
    for (var i = 0; i < str.length; i++) {
        if (str[i] >= 'a' && str[i] <= 'z') {
            return true;
        }
    }
    return false;
}

export const cleanupTask = ({title, description}) =>{
    return new Promise((resolve, reject)=>{
        if(!title || !description){
            reject("Insufficient data to create a new task")
        }
        if(title.trim().length > 50 || title.trim().length < 3){
            reject("Title length should be 3-50 characters long")
        }
        if(description.trim().length > 256){
            reject("Description is too long. It can not be longer than 256 characters.")
        }
        resolve()
    })
}

