import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { WebRtcComponent } from "./webrtc/webrtc.component"

const routes: Routes = [
    { path: "", redirectTo: "/webrtc", pathMatch: "full" },
    { path: "webrtc", component: WebRtcComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
