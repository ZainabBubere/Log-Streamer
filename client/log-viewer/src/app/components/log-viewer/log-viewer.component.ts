import { Component } from '@angular/core';
import { LogStreamerService } from '../../services/log-streamer.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-viewer.component.html',
  styleUrl: './log-viewer.component.css'
})
export class LogViewerComponent {
  lines: string[] = []
  errorMsg!: string
  subscription!: Subscription

  constructor (private logStreamerService: LogStreamerService) {}

  ngOnInit(): void {
    this.subscription = this.logStreamerService.messages$.subscribe({
      next:(msg) => {
        switch (msg.type) {
          case "initial":
            this.lines = msg.data || []
            break
          case "update":
            this.lines.push(...msg.data!)
            break
          case "error":
            this.errorMsg = msg.errorMsg!
            break
          default:
            console.warn("unknown message type", msg.type)
        }
      }, 
      error:(err) => {
        console.error("error occured in msg subscription", err)
      },
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
