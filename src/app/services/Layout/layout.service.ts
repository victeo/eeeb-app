import {Injectable, effect, signal} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

// Models
import {AppConfig} from "../../models/app-config";
import {LayoutState} from "../../models/layout-state";


@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private classState = new BehaviorSubject<boolean>(true);
  classState$ = this.classState.asObservable();

  constructor() {

  }

  toggleClassState() {
    this.classState.next(!this.classState.value);
  }
}
