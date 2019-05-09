import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/authentication-service/auth.service';
import {ParticipationService} from '../../services/participation-service/participation.service';
import {UserService} from '../../services/user-service/user.service';

@Component({
    selector: 'app-specific-event',
    templateUrl: './specific-event.page.html',
    styleUrls: ['./specific-event.page.scss'],
})
export class SpecificEventPage implements OnInit {

    activity: any;
    user: any;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private participationService: ParticipationService) {
    }

    ngOnInit() {
        if (this.route.snapshot.data['activity']) {
            this.activity = this.route.snapshot.data['activity'];
        }
        this.user = this.userService.currentUser;
    }

    booked(): boolean {
        return this.userService.currentUser.isBooked(this.activity);
    }

    bookActivity() {
        this.user.bookActivity(this.activity);
        this.participationService.submitParticipation(this.user.id, this.activity.id);
        console.log(this.userService.currentUser);
    }

    removeActivity() {
        this.user.removeBookedActivity(this.activity);
    }

}
