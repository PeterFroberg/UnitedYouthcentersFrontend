import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/authentication-service/auth.service';
import {ParticipationService} from '../../services/participation-service/participation.service';
import {UserService} from '../../services/user-service/user.service';
import {Youthcentre} from '../../Models/youthcentre';
import {ActivityService} from '../../services/activity-service/activity.service';

@Component({
    selector: 'app-specific-event',
    templateUrl: './specific-event.page.html',
})
export class SpecificEventPage implements OnInit {

    activity: any;
    user: any;
    winner: String;
    participants: any = [];

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private activityService: ActivityService) {
    }

    ngOnInit() {
        if (this.route.snapshot.data['activity']) {
            this.activity = this.route.snapshot.data['activity'];
        } else {
            this.activity = {
                'id': 9000,
                'name': 'ACTIVITYNOTDEFINED',
                'startdate': null,
                'description': 'this activity has not been defined'
            };
        }
        this.user = this.userService.currentUser;
        this.participants = [{displayname: 'Test1'}, {displayname: 'Test2'}];
        // this.participants = this.activityService.getAllActivityParticipants(this.activity.id);
    }

    booked(): boolean {
        return this.activityService.isMyActivity(this.activity.id);
    }

    bookActivity() {
        this.user.bookActivity(this.activity); // Should we keep or remove this?
        this.activityService.submitParticipation(this.user.id, this.activity.id);
        console.log(this.activityService.allMyActivities);
    }

    removeActivity() {
        this.user.removeBookedActivity(this.activity);
        this.activityService.removeParticipation(this.user.id, this.activity.id);
    }

    acceptChallenge() {
        // TODO
    }

    isChallenge(): boolean {
        return this.activityService.isChallenge(this.activity.id);
    }


    specifyWinner() {

        this.activityService.modifyActivity(this.activity.id, this.activity.name, this.activity.description, this.activity.responsibleuser, this.activity.alternativelocation, this.activity.issuggestion, this.activity.isactive, this.activity.category, this.activity.resource, this.activity.challenger, this.activity.challenged, this.activity.completed, this.activity.challengeaccepted, this.activity.challengerejected, this.winner);


        console.log(this.winner);
    }

    isActivityOwner(): boolean {
        return this.activity.challenger === this.user.currentyouthcentre || this.activity.challenged === this.user.currentyouthcentre;
    }
}
