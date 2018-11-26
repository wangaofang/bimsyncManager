import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as $ from "jquery";

declare var bimsync: any;

@Component({
  selector: 'app-viewer3d',
  templateUrl: './viewer3d.component.html',
  styleUrls: ['./viewer3d.component.scss']
})
export class Viewer3dComponent implements OnInit {

  viewer3dUrl: string;
  isLoaded: boolean;
  aModelAsAlreadyBeenloaded: boolean;
  spacesVisibility: boolean = false;

  @Input() viewerToken: string;
  @Input() spaceIds: number[];
  @Input() projectId: string;

  constructor() { }

  ngOnInit() {
    this.isLoaded = false;
    this.aModelAsAlreadyBeenloaded = false;
    this.spacesVisibility = true;
    this.ViewModel();
  }

  ViewModel() {
    let baseUrl = 'https://api.bimsync.com/v2/projects/' + this.projectId + '/viewer3d/data?token=';

    // this.viewerToken = 'e8a5ea616cec4a99972f5ab3321ecfc5';
    this.viewer3dUrl = baseUrl + this.viewerToken;

    this.EnableViewer();
  }

  EnableViewer(): any {
    let context = this;

    let $viewer = $("#viewer-3d") as any;
    let url3D: string = this.viewer3dUrl;

    bimsync.load(["viewer-ui"]);

    bimsync.setOnLoadCallback(function () {

      if (!context.aModelAsAlreadyBeenloaded) {
        $viewer.viewer({
          translucentOpacity: 0.2,
          enableTouch: true,
          enableClippingPlaneWidget: true
        });

        $viewer.viewerUI({
          enableJoystick: true,
          enableTouch: true,
          enableKeyboard: true,
          joystickHidden: true,
          joystickColor: "green",
          joystickPosition: "bottom-center",
          joystickBorderOffset: "0px",
          enableContextMenu: true,
          viewer2dId: "viewer-2d",
          enableViewer2dIntegration: true,
          showViewer2dStoreySelect: true,
          showViewer2dLockedNavigationToggle: true,
          set2dLockedNavigationMode: false
        });

        $viewer.viewer("loadUrl", url3D);

        context.aModelAsAlreadyBeenloaded = true;
      }
    });

    $viewer.bind("viewer.load", function (event) {

      $("#viewer-container").focus();

      $viewer.viewer("clippingPlaneWidgetViewport", {
        x: 0,
        y: 320,
        width: 150,
        height: 150
      });

      $viewer.viewerUI("setSpaces", context.spaceIds);

      context.isLoaded = true;

      $viewer.viewer('modelInfo', function (modelInfos) {
        // This will print model info for all loaded models
        console.log(modelInfos);
      });
    });
  }

  FocusModel() {
    let $viewer = $("#viewer-3d") as any;
    $viewer.viewer('viewpoint', 'home');

    $viewer.viewer('viewpoint', null, function (viewpoint) {
      console.log(viewpoint);
    });
  }

  ToogleSpaceVisibility() {
    let $viewer = $("#viewer-3d") as any;
    $viewer.viewerUI("setSpacesVisible", this.spacesVisibility);
    this.spacesVisibility = !this.spacesVisibility;
  }
}
