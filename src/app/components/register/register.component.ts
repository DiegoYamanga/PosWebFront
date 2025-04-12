import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../service/HttpService';
import { ReqRegisterDTO } from '../../../DTOs/reqRegisterDTO';
import { AppModule } from '../../app.component';



@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  submitted = false;
  responseMessage = '';

  constructor(private fb: FormBuilder, private httpService: HttpService) {
    this.registerForm = this.fb.group({
      terminal: ['', Validators.required],
      store_id: [null, Validators.required],
      identification: ['', Validators.required],
      identification_type: ['', Validators.required],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      born_date: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      card_number: ['', Validators.required],
      sex: ['', Validators.required],
      country_id: [null, Validators.required],
      country: ['', Validators.required],
      province_id: [null, Validators.required],
      province: ['', Validators.required],
      city_id: [null, Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      address: ['', Validators.required],
      postal_code: ['', Validators.required]
    });
  }


  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    let body: ReqRegisterDTO = this.registerForm.value;
    console.log("---> Lo que se esta enviando : ",body)

    this.httpService.register(body).subscribe((response) => {
      if(response.code == 200){
        console.log("Usuario creado correctamente ", response)
      }else{
        console.log("No se creo el usuario ", response )
      }
    });
    
  }





}
