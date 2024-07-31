import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
// import 'jspdf-autotable'; // Se você estiver usando a extensão autotable

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {


  isBlue = true;
  public isLargeFont: boolean = true; // This condition will determine the font size
  largeFontSize: string = '30px';
  smallFontSize: string = '14px';
  largeFontColor: string = 'blue';
  smallFontColor: string = 'red';

  employees: Employee[] = [];
  selectedEmployee?: Employee;


  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });
  }

  onSelect(employee: Employee): void {
    this.selectedEmployee = employee;
  }

  onDelete(employeeId: number): void {
      this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.getEmployees();
    });
  }

  onAdd(): void {
    this.router.navigate(['/add']);
  }

  onEdit(employeeId: number): void {
    this.router.navigate(['/edit', employeeId]);
  }

  generateReport(): void {
    this.getEmployees();
    const doc = new jsPDF();
    doc.text('Employee Report', 10, 10);
    let y = 20;
    this.employees.forEach(employee => {
      doc.text(`Name: ${employee.name}`, 10, y);
      doc.text(`Email: ${employee.email}`, 10, y + 10);
      doc.text(`Job Title: ${employee.jobTitle}`, 10, y + 20);
      doc.text(`Phone: ${employee.phone}`, 10, y + 30);
      y += 40;
    });
    doc.save('employee-report.pdf');
  }
}
