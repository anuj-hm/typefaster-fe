import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'typefaster-fe';
  showCountdown = false;
  count = 3
  counter$: any;
  showPlayContainer = false;
  resData: any
  errorMessage = ''
  startTime = new Date();
  intervalId: any;
  timeSpent = 0;
  userText = ''
  isTextValid = true
  resultMessage: any;
  showResult = false
  jwtToken = ''

  constructor(private appService: AppService) { }

  play() {
    this.showCountdown = true
    this.appService.start().subscribe((data: any) => {
      if (data.data && data.data.userData) {
        this.counter$ = timer(0, 1000).pipe(
          take(this.count),
          map(() => {
            --this.count
            if (this.count === 0) {
              this.showPlayContainer = true
            }
            return this.count
          })
        );
        this.startTime = new Date()
        this.resData = data.data.userData;
        this.jwtToken = data.data.jwtToken;        
      } else {
        this.errorMessage = data.message;
      }
    },  (err) => {
      this.errorMessage = 'Server down, please check later';

    })
  }

  onClickvalidate(event: any) {
    if (event.target.value === this.resData.text) {
      this.userText = event.target.value
      this.isTextValid = false
    } else {
      this.isTextValid = true
    }
  }

  checkStatus() {
    this.appService.checkStatus(this.jwtToken).subscribe((data: any) => {
      if (data.data && data.data.result) {
        this.resultMessage = data.data.result;
        if(data.data.gameFinished) {
          clearInterval(this.intervalId)
        }
      } else {
        this.errorMessage = data.message;
      }
    }, (err) => {
      clearInterval(this.intervalId)
    })
  }

  finish() {
    this.appService.finish(this.userText, this.jwtToken).subscribe((data: any) => {
      if (data.data && data.data.result) {
        this.showResult = true
        this.resultMessage = data.data.result;
        this.intervalId = setInterval(() => {
          this.checkStatus()
        }, 2000)
      } else {
        this.errorMessage = data.message;
      }
    })
  }
}
