import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { DatabaseService } from '../../services/database.service';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-search',
  imports: [FormsModule, NgFor],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  search: any; 
  alldata: any; 
  filtered: any; 

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private router: Router, 
  ) {
    let verificar = auth.verifyIsLogued();
    console.log(verificar);
    this.loadData();
  }

  loadData() {
    
    this.db.fetchFirestoreCollection('events')
      .subscribe(
        (res: any) => {
          console.log('events', res);
          this.alldata = res;
        },
        (error: any) => { console.log('Error: ', error) },
      );
  }

  searchDocument() {
    console.log('buscando', this.search);
    this.filtered = [];
   
    this.alldata.forEach((i: any) => {
      if (i.title.indexOf(this.search) >= 0) {
        this.filtered.push(i);
      }
    });
  }

  searchOnChange() {
    console.log('on change', this.search);
    this.filtered = [];
   
    this.alldata.forEach((i: any) => {
      if (i.title.indexOf(this.search) >= 0) {
        this.filtered.push(i);
      }
    });
  }

  
  viewEventDetail(eventId: string) {
  
    this.router.navigate([`/view-events/${eventId}`]);
  }
}
