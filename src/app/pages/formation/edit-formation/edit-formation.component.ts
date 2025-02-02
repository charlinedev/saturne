import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Formation } from 'src//models/Formation';
import { Theme } from 'src/models/Theme';
import { FormationService } from 'src/app/services/formation.service';

@Component({
  selector: 'app-edit-formation',
  templateUrl: './edit-formation.component.html',
  styleUrls: ['./edit-formation.component.scss'],
})
export class EditFormationComponent implements OnInit {
  themeChoices: Theme[] = [
    { idTheme: 1, nomTheme: 'Développement' },
    { idTheme: 2, nomTheme: 'Big Data, Data Science et IA' },
    { idTheme: 3, nomTheme: 'Informatique décicionnelle' },
    { idTheme: 4, nomTheme: 'Bases de données' },
    { idTheme: 5, nomTheme: 'Réseaux et Télécoms' },
    { idTheme: 6, nomTheme: 'Cybersécurité' },
    { idTheme: 7, nomTheme: 'Cloud computing' },
    { idTheme: 8, nomTheme: 'Virtualisation' },
    { idTheme: 9, nomTheme: 'Windows et System Center' },
    { idTheme: 10, nomTheme: 'Linux, Unix, Mac' },
    { idTheme: 11, nomTheme: 'Solutions collaboratives Microsoft' },
    { idTheme: 12, nomTheme: 'IBM' },
    { idTheme: 13, nomTheme: 'SAP' },
    { idTheme: 14, nomTheme: 'Tests' },
    { idTheme: 15, nomTheme: 'Développement web et mobilité' },
    {
      idTheme: 16,
      nomTheme: 'IoT, Systèmes embarquées, Robotic Process Automation',
    },
    {
      idTheme: 17,
      nomTheme: 'DevOps, industrialisation et gestion de production',
    },
    { idTheme: 18, nomTheme: 'PAO, CAO, DAO, BIM' },
  ];

  updatedF!: Formation | {};
  sub?: Subscription;
  fToUpdate!: Subscription;
  identifiant!: number;

  private routeSub: Subscription;
  constructor(
    private formationService: FormationService,
    private route: ActivatedRoute
  ) {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log(params); //log the entire params object
      console.log(params['id']); //log the value of id
      this.identifiant = Number(params['id']);
    });

    console.log('Got the [id] from the url: ' + this.identifiant);
  }

  editForm = new FormGroup({
    //idFormation: new FormControl(null, Validators.nullValidator), //
    ref: new FormControl(null, Validators.required), //this.updatedF.reference
    title: new FormControl(null, Validators.required), //this.updatedF.titref
    location: new FormControl(null, Validators.required), //this.updatedF.lieu
    interIntra: new FormControl(null, Validators.required), //this.updatedF.interFormation
    duration: new FormControl(null, [Validators.required, Validators.min(1)]), //this.updatedF.duree
    prerequis: new FormControl(null, Validators.required), //this.updatedF.prerequis
    goal: new FormControl(null, Validators.required), //this.updatedF.objectif
    targetPublic: new FormControl(null, Validators.required), //this.updatedF.publicVise
    details: new FormControl(null, Validators.required), //this.updatedF.programmeDetaille
    theme: new FormControl(null, Validators.required), //this.updatedF.themes
  });

  ngOnInit(): void {
    this.getFormation();
  }

  public getFormation() {
    this.formationService.getFormationById(this.identifiant).subscribe({
      next: (formation: Formation) => {
        this.updatedF = {};
        Object.assign(this.updatedF, formation);
        this.ref.setValue(formation.reference.toString());
        this.title.setValue(formation.titref.toString());
        this.location.setValue(formation.lieu.toString());
        this.interIntra.setValue(formation.interFormation.toString());
        this.duration.setValue(formation.duree.toString());
        this.prerequis.setValue(formation.prerequis.toString());
        this.goal.setValue(formation.objectif.toString());
        this.targetPublic.setValue(formation.publicVise.toString());
        this.details.setValue(formation.programmeDetaille.toString());
        // this.theme.setValue(formation.themes)
      },
      error: (error: HttpErrorResponse) => {
        alert('GetTrainingById failed due to: ' + error.message);
        console.error("didn't find the training w/ the id " + this.identifiant);
      },
      complete: () => {
        console.error('BLABLABLA in COMPLETE of parentSubscribe');
        console.log('DONE!');
        //this.editForm.reset();
      },
    });
    // return this.updatedF;
  }

  // get id(): any { //=> id : is AUTO-INCREMENTED
  //   return this.editForm.get('idFormation');
  // }
  get ref(): any {
    return this.editForm.get('ref');
  }
  get title(): any {
    return this.editForm.get('title');
  }
  get location(): any {
    return this.editForm.get('location');
  }
  get interIntra(): any {
    return this.editForm.get('interIntra');
  }
  get duration(): any {
    return this.editForm.get('duration');
  }
  get prerequis(): any {
    return this.editForm.get('prerequis');
  }
  get goal(): any {
    return this.editForm.get('goal');
  }
  get targetPublic(): any {
    return this.editForm.get('targetPublic');
  }
  get details(): any {
    return this.editForm.get('details');
  }
  get theme(): any {
    return this.editForm.get('theme');
  }

  editTraining(): void {
    if (this.editForm.invalid) {
      // return
      console.log('Invalid form');
    }

    let themeData: Theme[] = [];
    this.theme.value.forEach((tx: string) => {
      let res: Theme | undefined = this.themeChoices.find(
        (tc: Theme) => tc.idTheme.toString() === tx
      );
      if (res) {
        themeData.push(res);
      }
    });

    const dataU: Formation = {
      reference: String(this.ref.value),
      titref: String(this.title.value),
      lieu: String(this.location.value),
      interFormation: Boolean(this.interIntra.value),
      duree: Number(this.duration.value),
      prerequis: String(this.prerequis.value),
      objectif: String(this.goal.value),
      publicVise: String(this.targetPublic.value),
      programmeDetaille: String(this.details.value),
      themes: themeData,
    };

    this.formationService.updateFormation(dataU, this.identifiant).subscribe({
      next(_updatedTraining: Formation) {
        // this.updatedF = Object.assign({}, updatedTraining)
        confirm('La formation a été mise à jour');
      },
      error(err: HttpErrorResponse) {
        alert('failed to update training due to: ' + err);
      },
    });
  }

  public showMessage(message: string) {
    alert(message);
  }

  // ngOnDestroy(): void {
  //   this.updatedF?.unsubscribe();
  // }
}
