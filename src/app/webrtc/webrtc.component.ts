import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";
// import { WebRTC, WebRTCView, Quality, WebRTCOptions, TNSRTCMediaStream } from 'nativescript-webrtc-plugin';
import { WebRTC, WebRTCView, Quality, WebRTCOptions } from 'nativescript-webrtc-plugin';

@Component({
  templateUrl: './webrtc.component.html',
  styleUrls: [
    './webrtc.component.css',
  ]
})
export class WebRtcComponent implements OnInit, AfterViewInit {
  @ViewChild('remoteVideoView', {static: true}) remoteVideo:ElementRef<WebRTCView>;
  @ViewChild('localVideoView', {static: true}) localVideo:ElementRef<WebRTCView>;

  private webrtc: WebRTC;

  constructor() {}

  public ngOnInit(): void {

    let webRtcOptions: WebRTCOptions = {
      enableAudio: true, // default true
      enableVideo: true, // default true
    }

    this.webrtc = new WebRTC(webRtcOptions);

    this.webrtc.on('webRTCClientDidReceiveRemoteVideoTrackStream', args => {
      const object = args.object;
      const remoteVideoTrack = object.get('remoteVideoTrack');
      const remoteStream = object.get('stream');
      this.remoteVideo.nativeElement.videoTrack = remoteVideoTrack;
    });

    this.webrtc.on('webRTCClientStartCallWithSdp', args => {
      const sdp = args.object.get('sdp');
      const type = args.object.get('type');
      if (type === 'answer') {
        this.webrtc.handleAnswerReceived({
          sdp: sdp,
          type: type
        });
      } else {
        // send data to signaling server
      }
    });

    this.webrtc.on('webRTCClientDidGenerateIceCandidate', args => {
      const iceCandidate = args.object.get('iceCandidate');
      // send data to signaling server
    });
  }

  public ngAfterViewInit() {
    this.requestPerms().then(() => {
      // this.webrtc.getUserMedia(Quality.HIGHEST).then((localStream: TNSRTCMediaStream) => {
      this.webrtc.getUserMedia(Quality.HIGHEST).then((localStream) => {
        try {
          console.dir(localStream);
          this.webrtc.connect();
          this.webrtc.addLocalStream(localStream);
          this.localVideo.nativeElement.mirror = true;
          this.localVideo.nativeElement.stream = localStream;
          console.log('JONI')

          // this.webrtc.makeOffer();
        } catch (e) {
          console.error(`WebRTC error: ${e}`);
        }
      });
    });
  }

  private requestPerms(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (WebRTC.hasPermissions()) { console.log('WebRTC.hasPermissions: true'); resolve(); }
      else  {
        try {
          WebRTC.requestPermissions().then(() => {
            console.log('WebRTC.requestPermissions success!');
            resolve()
          });
        } catch (e) {
          console.error(`WebRTC.requestPermissions: ${e}`);
          reject(e);
        }
      }
    });
  }
}




