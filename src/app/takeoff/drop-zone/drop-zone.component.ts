import { Component, OnInit, Input } from '@angular/core';
import { DisplayedQuantityProperty, IPropertiesList } from '../selected-properties.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { SelectedPropertiesService } from '../selected-properties.service';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit {

  propertiesList$: BehaviorSubject<DisplayedQuantityProperty[]>;
  @Input() propertiesList: IPropertiesList;
  @Input() zoneId: string;

  constructor( ) {
   }

  ngOnInit() {
    this.propertiesList$ = this.propertiesList.propertiesListChange;
  }

  public drop(event: CdkDragDrop<DisplayedQuantityProperty[]>) {
    if (event.isPointerOverContainer) {
      if (event.container.id === event.previousContainer.id) {
        // move inside same list
        this.propertiesList.ChangePropertyRank(event.previousIndex, event.currentIndex);
      } else {
        // move between lists
        this.propertiesList.InsertItem(event.item.data);
      }
    } else {
      // Remove from the list
      this.propertiesList.RemoveItemAtIndex(event.previousIndex);
    }
    console.log(event);
  }

  public RemoveProperty(displayedQuantityProperty: DisplayedQuantityProperty)
  {
    this.propertiesList.RemoveItem(displayedQuantityProperty);
  }

}
