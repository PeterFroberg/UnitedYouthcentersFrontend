import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user-service/user.service';
import {ActivityService} from '../../services/activity-service/activity.service';
import {CheckinService} from '../../services/checkin-service/checkin.service';
import {ToastController} from '@ionic/angular';
import {DataService} from '../../services/data.service';
import {Youthcentre} from '../../Models/youthcentre';
import {YouthcenterService} from '../../services/youthcenter.service';

@Component({
    selector: 'app-specific-event',
    templateUrl: './specific-event.page.html',
})
export class SpecificEventPage implements OnInit {

    activity: any;
    user: any;
    winner: String;
    competitors: any = [];
    challenger;


    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private activityService: ActivityService, private checkInService: CheckinService, private toastController: ToastController, private dataService: DataService, private youthcentreservice: YouthcenterService) {
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
        this.activityService.getAllActivityParticipants(this.activity.id);
        this.competitors = [{id: this.activity.challenger, isWinner: false}, {id: this.activity.challenged, isWinner: false}];
        this.getYouthCentreName();

    }

    getYouthCentreName() {
        this.youthcentreservice.getAllLocations();

        setTimeout(() => {
            this.challenger = this.youthcentreservice.getTheRightId(this.activity.challenger);

        }, 400);

    }


    booked(): boolean {
        return this.activityService.isMyActivity(this.activity.id);
    }

    bookActivity() {
        this.user.bookActivity(this.activity); // Should we keep or remove this?
        this.activityService.submitParticipation(this.user.id, this.activity.id);
    }


    removeActivity() {
        this.user.removeBookedActivity(this.activity);
        this.activityService.removeParticipation(this.user.id, this.activity.id);
    }


    isChallenge(): boolean {
        return this.activityService.isChallenge(this.activity.id);
    }


    specifyWinner() {
        this.activityService.modifyActivity(this.activity.id, this.activity.name, this.activity.description, this.activity.responsibleuser, this.activity.alternativelocation, this.activity.issuggestion, this.activity.isactive, this.activity.category, this.activity.resource, this.activity.challenger, this.activity.challenged, this.activity.completed, this.activity.challengeaccepted, this.activity.challengerejected, this.winner, this.activity.startdate, this.activity.enddate);
    }

    isActivityOwner(): boolean {
        return ((this.activity.challenger === this.user.currentyouthcentre || this.activity.challenged === this.user.currentyouthcentre) && (!this.activityService.activityIsPending(this.activity) && !this.activityService.activityIsSuggestion(this.activity))) && (this.userService.currentUser.role === 'admin');
    }

    checkInActivity() {

        if (this.activity.isactive === 0) {
            this.presentToast('Inte aktivt längre');
            return;
        }
        if (!this.userIsCloseEnough()) {
            this.presentToast('För långt ifrån');
            return;
        }


        this.checkInService.activityCheckin(this.userService.currentUser.id, this.activity.id);

    }

    userCanCheckIn() {
        // return this.userIsCloseEnough() && this.booked() && this.isOnGoing() && !this.isSuggestion();
        console.log(this.userIsCloseEnough() + ' ' + ' ' + this.booked() + this.activityService.isOnGoing(this.activity) + ' ' + ' ' + !this.userIsNotCheckedIn());
        return this.userIsCloseEnough() && this.booked() && this.activityService.isOnGoing(this.activity) && this.userIsNotCheckedIn();
    }

    userIsCloseEnough(): boolean {

        if (localStorage.getItem('isCloseEnough') === 'true') {
            return true;
        } else if (localStorage.getItem('isCloseEnough') === 'false') {
            return false;
        }
        return false;

    }

    async presentToast(toastMessage: string) {
        const toast = await this.toastController.create({
            message: toastMessage,
            duration: 2000,
            position: 'middle'
        });
        toast.present();
    }

    radioChangeHandler(event) {
        this.winner = event.target.value;
    }

    isSuggestion(): boolean {
        return this.activityService.activityIsSuggestion(this.activity) && this.activityService.isChallenger(this.activity);
    }

    // HANDLE CHALLENGE
    acceptChallenge() {
        this.activityService.modifyActivity(this.activity.id, this.activity.name, this.activity.description, this.activity.responsibleuser, this.activity.alternativelocation, this.activity.issuggestion, this.activity.isactive, this.activity.category, this.activity.resource, this.activity.challenger, this.activity.challenged, this.activity.completed, 1, this.activity.challengerejected, this.activity.winner, this.activity.startdate, this.activity.enddate);
        this.router.navigate(['tabs/event']);
    }

    declineChallenge() {
        this.activityService.modifyActivity(this.activity.id, this.activity.name, this.activity.description, this.activity.responsibleuser, this.activity.alternativelocation, this.activity.issuggestion, this.activity.isactive, this.activity.category, this.activity.resource, this.activity.challenger, this.activity.challenged, this.activity.completed, this.activity.challengeaccepted, 1, this.activity.winner, this.activity.startdate, this.activity.enddate);
        this.router.navigate(['tabs/event']);
    }

    // HANDLE SUGGESTION
    acceptSuggestion() {
        this.activityService.modifyActivity(this.activity.id, this.activity.name, this.activity.description, this.userService.currentUser.id, this.activity.alternativelocation, 0, this.activity.isactive, this.activity.category, this.activity.resource, this.activity.challenger, this.activity.challenged, this.activity.completed, this.activity.challengeaccepted, this.activity.challengerejected, this.activity.winner, this.activity.startdate, this.activity.enddate);
        this.router.navigate(['tabs/event']);
    }

    declineSuggestion() {
        // console.log(this.activity.id  + ' ' + this.activity.name + ' ' + this.activity.description + ' ' + this.userService.currentUser.id + ' ' + this.activity.alternativelocation + ' ' + 1 + ' ' + 0 + ' ' + this.activity.category + ' ' + this.activity.resource + ' ' + this.activity.challenger + ' ' + this.activity.challenged + ' ' + this.activity.completed + ' ' +  this.activity.challengeaccepted + ' ' + this.activity.challengerejected + ' ' + this.activity.winner + ' ' + this.activity.startdate + ' ' + this.activity.enddate);
        this.activityService.modifyActivity(this.activity.id, this.activity.name, this.activity.description, this.userService.currentUser.id, this.activity.alternativelocation, 1, 0, this.activity.category, this.activity.resource, this.activity.challenger, this.activity.challenged, this.activity.completed, this.activity.challengeaccepted, this.activity.challengerejected, this.activity.winner, this.activity.startdate, this.activity.enddate);
        this.router.navigate(['tabs/event']);
    }

    modifySuggestion() {
        localStorage.setItem('activityToModify', JSON.stringify(this.activity));
        this.router.navigate(['modify-activity']);
    }

    getWinner() {
        if (this.activity.winner === 0) {
            return 'TBD';
        } else {
            return this.youthcentreservice.getTheRightId(this.activity.winner);
        }

    }


    private userIsNotCheckedIn() {
            if (this.activity.checkedin === 0) {
                return true;
            }
            return false;
    }


}
