import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public sessions$: Observable<Session[]> = EMPTY;

  constructor(
    private sessionService: SessionService,
    private sessionApiService: SessionApiService
  ) { }
  ngOnInit() {
    this.sessions$ = this.sessionApiService.all();
  }
  get user(): SessionInformation | undefined {
    return this.sessionService.sessionInformation;
  }
}
