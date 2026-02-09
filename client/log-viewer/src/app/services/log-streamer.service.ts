import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface EventData {
  type: string;
  data?: string[];
  errorMsg?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogStreamerService {
  websocket!: WebSocket
  msgSubscription = new Subject<EventData>()
  wsUrl = "ws://localhost:8000"

  maxInterval = 30000
  maxRetries = 10
  interval = 2
  retryCount = 0

  constructor() { 
    this.connectToWebsocket()
  }

  private connectToWebsocket() {
    this.websocket = new WebSocket(this.wsUrl)

    this.websocket.onopen = () => {
      console.log("Websocket connected opened successfully!")
      this.interval = 2
      this.retryCount = 0
    }

    this.websocket.onmessage = (event) => {
      try {
        const eventData: EventData = JSON.parse(event.data)
        this.msgSubscription.next(eventData)
      } catch (e) {
        console.error("Error occured while parsing server message", e)
      }
    }

    this.websocket.onerror = (err) => {
      console.error("An error occured in websocket connection", err)
    }

    this.websocket.onclose = () => {
      console.log("Websocket connection closed. Trying to reconnect!")

      if (this.retryCount < this.maxRetries) {
        console.log(`Trying to connect to server in ${this.interval / 1000} seconds...`)
        
        this.retryCount += 1
        setTimeout(() => this.connectToWebsocket(), this.interval)
        this.interval = Math.min(this.maxInterval, this.interval * 2)
      } else {
        console.log(`Could not connect to server after ${this.maxRetries}. Please refresh to try again!`)
      }
    }
  }

  public get messages$(): Observable<EventData> {
    return this.msgSubscription.asObservable()
  }
}
