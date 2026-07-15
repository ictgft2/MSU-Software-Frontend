import { SignUpParams } from "@src/types";
import axios from 'axios'

export async function UserSignUp(params: SignUpParams) {
    const {firstName, lastName, countryCode, phone, address, email, password} = params;

    const payLoad = {firstName, lastName, countryCode, phone, address, email, password};

    const res = axios.post("https://staging.api.msu.ftapp.ng/api/user/register", payLoad)

    console.log(res);
    
}