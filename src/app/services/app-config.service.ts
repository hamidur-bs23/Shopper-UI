import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

import { AuthService } from "./auth.service";

@Injectable()
export class AppConfigService {
       
    constructor(
        private authService: AuthService) {
    }

    async loadAppConfig(){

        await this.getUserFromAPI();
    }

    async getUserFromAPI(){
        this.authService.getUserFromAPI()
            .subscribe({
                next: (userData)=>{
                    this.authService.saveUserFromAppConfig(userData);
                    console.log("User Data - ", userData);
                },
                error: (err)=>{
                    console.log(err);
                }
            });
    }
}