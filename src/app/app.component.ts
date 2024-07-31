import { Component, OnInit } from '@angular/core';
import { Employee } from './models/employee';
import { EmployeeService } from './services/employee.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'Employees Management App';
  today: Date = new Date;

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
   this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: Employee[]) => this.employees = data,
      (error: HttpErrorResponse) => this.handleError(error)
    );
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => {
        console.log(`Employee with ID ${employeeId} deleted successfully`);
        this.employees = this.employees.filter(e => e.id !== employeeId);
      },
      (error: HttpErrorResponse) => this.handleError(error)
    );
  }

  private handleError(error: HttpErrorResponse): void {
    console.error('An error occurred:', error);
    // Mostrar mensagem de erro user-facing ou outras ações apropriadas
  }

}
