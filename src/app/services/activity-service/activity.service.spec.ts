import { TestBed } from '@angular/core/testing';

import { ActivityService } from './activity.service';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user-service/user.service';
import {UserServiceMock} from '../../../../test-config/mocks-ionic';
import {ToastController} from '@ionic/angular';

describe('ActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: HttpClient, useValue: null}, {provide: UserService, useValue: new UserServiceMock()}, {provide: ToastController, useValue: null} ]
  }));

  it('should be created', () => {
    const service: ActivityService = TestBed.get(ActivityService);
    expect(service).toBeTruthy();
  });
});
