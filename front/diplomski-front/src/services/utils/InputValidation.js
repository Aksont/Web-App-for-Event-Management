export const onlyLetters = "This field can only contain letters!";
export const onlyNumbers = "This field can only contain numbers!";
export const deletionReason = "Please input reason for your deletion request";
export const passwordText = "";
export const phoneNum = "";

// disabled dangerous SQL dangers, can't input anything dangerous
// const onlyLettersRegex = new RegExp('^([a-zA-Z]+\\s)*[a-zA-Z]+$');
const onlyLettersRegex = new RegExp('[a-zA-Z]+');
const onlyNumbersRegex = new RegExp('^[0-9]+$');
const yyyyMMddRegex = new RegExp('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$');

// Samo sam kopirala od negde, proveriti da li ok
const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
 );
const validPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!@#$%^&*()_+={}|:<>,.?/])(?=.*?[0-9]).{8,}$'); // at least: one capital letter, one lowercase letter, a digit, a special character and min 8 length
const validPositiveNumber = new RegExp('[1-9][0-9]*');

// allowed space between words and after
export function checkLettersInput(input){
    input = removeSpaces(input)
    return onlyLettersRegex.test(input);
}

export function checkEmailInput(input){
    return validEmail.test(input);
}

export function checkPasswordInput(input){
    return validPassword.test(input)
}

export function checkSecondPasswordInput(input, password){
    return input === password
}

export function checkNumInput(input){
    return onlyNumbersRegex.test(input);     
}

export function checkDateInput(input){
    input = removeSpaces(input)
    return yyyyMMddRegex.test(input);     
}

export function isEmpty(input){
    if(input ===null || input === undefined || input ==='' ){
        return false;
    }

    return true;
}

function removeSpaces(input){
    return input.trim().split(/ +/).join(' ');
}

export function isPercentageNumber(input) {
    return isPositiveNumber(input) && (input>0 && input<100)
}

export function isPositiveNumber(input) {
    return validPositiveNumber.test(input); 
}

export function isHhMm(input) { // hh:mm
    let valid = input.length === 5;
    let splits = input.split(":");
    valid = valid && splits.length === 2;
    valid = valid && checkNumInput(splits[0]) && checkNumInput(splits[1]);

    return valid;
}

export function isYyMmDd(input) { // yyyy-mm-dd
    let valid = input.length === 10;
    let splits = input.split("-");
    valid = valid && splits.length === 3;
    valid = isPositiveNumber(splits[0]) && isPositiveNumber(splits[1]) && isPositiveNumber(splits[2]);

    return valid;
}

/*function capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toString().toLowerCase();
}

function uniformString(string) {
    return string.charAt(0) + string.slice(1).toString().toLowerCase();
}

function capitalizeWords(string) {
    const words = string.split(/ +/);
    for (let index = 0; index < words.length; index++) {
        words[index] = capitalizeString(words[index]);
    }
    return words.join(' ')
}*/
