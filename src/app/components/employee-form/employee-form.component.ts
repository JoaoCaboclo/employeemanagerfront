// src/app/components/employee-form/employee-form.component.ts
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Output() formSubmit = new EventEmitter<void>();
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.employeeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', Validators.required],
      phone: ['', Validators.required],
      imageUrl: ['', Validators.required],
      employeeCode: ['']
    });
  }

  ngOnInit(): void {
    this.getEmployee();
  }

  ngOnChanges(): void {
    if (this.employee) {
      this.employeeForm.patchValue(this.employee);
    }
  }

  getEmployee(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployeeById(Number(id)).subscribe(employee => {
        this.employee = employee;
        this.employeeForm.patchValue(employee);
      });
    }
  }

  onSubmit(): void {
    console.log("Testará se formulário válido");
    if (this.employeeForm.valid) {
      const employee = this.employeeForm.value;
      if (employee.id) {
        this.employeeService.updateEmployee(employee).subscribe(() => this.location.back());
      } else {
        this.employeeService.addEmployee(employee).subscribe(() => this.location.back());
      }
    } else {
      console.log("Formulário não validado");
    }
  }
}
