import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../service/HttpService';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';

export interface PaisDTO { id: number; name: string; }
export interface ProvinciaDTO { id: number; name: string; }
export interface CiudadDTO { id: number; name: string; }

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  submitted = false;
  responseMessage = '';

  storeID!: string;
  branchID!: string;

  countries: PaisDTO[] = [];
  provinces: ProvinciaDTO[] = [];
  cities: CiudadDTO[] = [];

  loadingCountries = false;
  loadingProvinces = false;
  loadingCities = false;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private store: Store
  ) {
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
      province_id: [null, Validators.required],
      city_id: [null, Validators.required],

      country: [''],
      province: [''],
      city: [''],

      street: ['', Validators.required],
      number: ['', Validators.required],
      address: ['', Validators.required],
      postal_code: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.registerForm.get('terminal')!.setValue('WEB', { emitEvent: false });
    this.registerForm.get('terminal')!.disable({ emitEvent: false });

    const subLogin = this.store.select(AppSelectors.selectResLoginDTO)
      .pipe(take(1)) // tomamos una sola vez
      .subscribe(loginData => {
        if (loginData) {
          this.storeID = String(loginData.store?.id ?? '');
          this.branchID = String(loginData.branch?.id ?? '');

          this.registerForm.patchValue(
            { store_id: loginData.store?.id ?? null },
            { emitEvent: false }
          );
        }
      });
    this.subs.push(subLogin);

    /*País/Provincia/Ciudad */
    this.loadCountries();

    const subCountry = this.registerForm.get('country_id')!.valueChanges.subscribe((countryId: number | null) => {
      this.provinces = [];
      this.cities = [];
      this.registerForm.patchValue({ province_id: null, city_id: null, province: '', city: '' });

      const selected = this.countries.find(c => c.id === countryId);
      this.registerForm.patchValue({ country: selected?.name ?? '' });

      if (countryId != null) this.loadProvinces(String(countryId));
    });
    this.subs.push(subCountry);

    const subProvince = this.registerForm.get('province_id')!.valueChanges.subscribe((provinceId: number | null) => {
      this.cities = [];
      this.registerForm.patchValue({ city_id: null, city: '' });

      const selected = this.provinces.find(p => p.id === provinceId);
      this.registerForm.patchValue({ province: selected?.name ?? '' });

      const countryId = this.registerForm.get('country_id')!.value;
      if (countryId != null && provinceId != null) this.loadCities(String(countryId), String(provinceId));
    });
    this.subs.push(subProvince);

    const subCity = this.registerForm.get('city_id')!.valueChanges.subscribe((cityId: number | null) => {
      const selected = this.cities.find(ci => ci.id === cityId);
      this.registerForm.patchValue({ city: selected?.name ?? '' });
    });
    this.subs.push(subCity);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  /** Cargas */
  private loadCountries(): void {
    this.loadingCountries = true;
    this.httpService.obtenerPaises().subscribe({
      next: (data) => { this.countries = data ?? []; },
      error: () => { this.countries = []; },
      complete: () => { this.loadingCountries = false; }
    });
  }

  private loadProvinces(countryID: string): void {
    this.loadingProvinces = true;
    this.httpService.obtenerProvincias(countryID).subscribe({
      next: (data) => { this.provinces = data ?? []; },
      error: () => { this.provinces = []; },
      complete: () => { this.loadingProvinces = false; }
    });
  }

  private loadCities(countryID: string, provinceID: string): void {
    this.loadingCities = true;
    this.httpService.obtenerCiudades(countryID, provinceID).subscribe({
      next: (data) => { this.cities = data ?? []; },
      error: () => { this.cities = []; },
      complete: () => { this.loadingCities = false; }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.syncLocationNames();

    const body = this.registerForm.getRawValue();



    this.httpService.register(body).subscribe((response) => {
      if (response.code == 200) {
        this.responseMessage = 'Usuario creado correctamente';
        console.log('Usuario creado correctamente ', response);
      } else {
        this.responseMessage = 'No se pudo crear el usuario';
        console.log('No se creo el usuario ', response);
      }
    });
  }

  private syncLocationNames(): void {
    const countryId = this.registerForm.get('country_id')!.value as number | null;
    const provinceId = this.registerForm.get('province_id')!.value as number | null;
    const cityId = this.registerForm.get('city_id')!.value as number | null;

    const country = this.countries.find(c => c.id === countryId)?.name ?? '';
    const province = this.provinces.find(p => p.id === provinceId)?.name ?? '';
    const city = this.cities.find(ci => ci.id === cityId)?.name ?? '';

    this.registerForm.patchValue({ country, province, city }, { emitEvent: false });
  }

  trackById(index: number, item: { id: number }): number {
    return item.id;
  }
}
