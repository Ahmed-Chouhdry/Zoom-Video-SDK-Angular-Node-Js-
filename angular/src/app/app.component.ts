import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import uitoolkit from "@zoom/videosdk-ui-toolkit";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('preview', { static: true }) previewContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('sessionContainer', { static: true }) sessionContainer!: ElementRef<HTMLDivElement>;

  payload = {
    role: 1, // or 0, based on your role
    sessionName: 'Cool Cars',
    expirationSeconds: 172800,
    userIdentity: 'user123',
    sessionKey: 'session123',
    geoRegions: ['SG'],
    cloudRecordingOption: 1,
    cloudRecordingElection: 1,
    audioCompatibleMode: 1
  };

  authEndpoint = 'http://localhost:4000';
  inSession: boolean = false;

  config = {
    videoSDKJWT: '',
    sessionName: 'Cool Cars',
    userName: 'user123',
    sessionPasscode: 'session123',
    features: ['preview', 'video', 'audio', 'settings', 'users', 'chat', 'share'],
    options: { init: {}, audio: {}, video: {}, share: {} },
    virtualBackground: {
      allowVirtualBackground: true,
      allowVirtualBackgroundUpload: true,
      virtualBackgrounds: ['https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop']
    }
  };

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit() {
    // this.openPreview();
  }

  getVideoSDKJWT() {
    this.inSession = true;

    this.httpClient.post(this.authEndpoint, this.payload).subscribe((data: any) => {
      if (data.signature) {
        console.log(data.signature);
        this.config.videoSDKJWT = data.signature;
        this.joinSession();
      } else {
        console.log(data);
      }
    });
  }

  joinSession() {
    uitoolkit.joinSession(this.sessionContainer.nativeElement, this.config);
    uitoolkit.onSessionClosed(this.sessionClosed);
  }

  sessionClosed = () => {
    console.log('session closed');
    uitoolkit.closeSession(this.sessionContainer.nativeElement);
    this.closePreview();
    this.inSession = false;
  }

  private openPreview() {
    uitoolkit.openPreview(this.previewContainer.nativeElement);
  }

  private closePreview() {
    try {
      uitoolkit.closePreview(this.previewContainer.nativeElement);
    } catch (e) {
      console.log('Error closing uitoolkit preview', e);
    }
  }
}
