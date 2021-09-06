import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AppService {

    private REST_API_SERVER = "http://localhost:4000";
    private START = "/api/game/start"
    private FINISH = "/api/game/finish"
    private CHECK_STATUS = "/api/game/checkstatus"

    constructor(private httpClient: HttpClient) { }

    public start() {
        return this.httpClient.get(this.REST_API_SERVER + this.START);
    }

    public finish(userText: string, token: string) {
        const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Authorization', token);
        return this.httpClient.get(this.REST_API_SERVER + this.FINISH + `?userText=${userText}`, {
            headers: headers,
        });
    }

    public checkStatus(token: string) {
        const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Authorization', token);
        return this.httpClient.get(this.REST_API_SERVER + this.CHECK_STATUS, {
            headers: headers,
        })
    }
}