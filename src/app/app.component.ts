import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
export interface Trip {
  startPoint: string;
  endPoint: string;
  previousTrip?: Trip;
  nextTrip?: Trip;
  level?: number;
}
@Component({
  selector: 'app-root',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  tripForm!: FormGroup;
  trips: Trip[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    // Initialize the tripForm here
    this.tripForm = this.formBuilder.group({
      startPoint: ['', [Validators.required, Validators.minLength(3)]],
      endPoint: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  addTrip() {
    // Logic to add a trip
    // If startPoint and endPoint are empty, show an alert
    if (!this.tripForm?.value.startPoint && !this.tripForm?.value.endPoint) {
      alert('Please enter both start and end points.');
      return
    }

    // If minLength is not met, show an alert
    if (this.tripForm?.value.startPoint.length < 3 || this.tripForm?.value.endPoint.length < 3) {
      alert('Start and end points must be at least 3 characters long.');
      return
    }
    // If startPoint and endPoint are the same, show an alert
    if (this.tripForm?.value.startPoint === this.tripForm?.value.endPoint) {
      alert('Start and end points cannot be the same.');
      return
    }
    // If all validations pass, create the trip
    this.createTrip();
  }

  createTrip() {
    // Create a new trip object
    const newTrip: Trip = {
      // take only first 3 characters of startPoint and endPoint and convert to uppercase
      startPoint: this.tripForm?.value.startPoint.substring(0, 3).toUpperCase(),
      endPoint: this.tripForm?.value.endPoint.substring(0, 3).toUpperCase(),
      previousTrip: this.trips[this.trips.length - 1] || undefined,
      nextTrip: undefined,
      level: this.trips.length + 1
    };
    // If there are existing trips, set the nextTrip of the last trip to the new trip
    if (this.trips.length > 0) {
      this.trips[this.trips.length - 1].nextTrip = newTrip;
      // Check if the new trip is a continued trip
      if (this.trips[this.trips.length - 1].endPoint === newTrip.startPoint) {
        newTrip.level = 1; // Set level to 1 for continued trips
      }
      // Check if the new trip is not a continued trip
      
      else if (this.trips[this.trips.length - 1].startPoint === newTrip.endPoint) {
        newTrip.level = 1; // Set level to 1 for not continued trips
      }
      // Check if the new trip has the same pickup and drop location as the previous trip
      else if (this.trips[this.trips.length - 1].startPoint === newTrip.startPoint && this.trips[this.trips.length - 1].endPoint === newTrip.endPoint) {
        newTrip.level = 2; // Set level to 2 for same pickup and drop location
        this.trips[this.trips.length - 1].level = 2; // Set the level of the previous trip to 2 as well

      } else {
        newTrip.level = 1; // Default level for other trips
      }
      

    }
    // Add the new trip to the trips array
    this.trips.push(newTrip);
    // Reset the form after adding the trip
    this.tripForm.reset();
    console.log('Trips:', this.trips);
  }

}
