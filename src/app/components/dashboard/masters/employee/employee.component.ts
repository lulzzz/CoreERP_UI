import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {


  modelFormData: FormGroup;
  isSubmitted  =  false;
  formData: any;
  companyList: any;


  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
        name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        ext1: [null],
        ext2: [null],
        phone1: [null],
        phone2: [null],
        aadhar: [null],
        accessCard: [null],
        address1: [null],
        address2: [null],
        approvedBy: [null],
        bloodGroup: [null],
        compCode: [null],
        branchCode: [null],
        dob: [null],
        designation: [null],
        email: [null],
        fatherName: [null],
        joinDate: [null],
        pan: [null],
        recommendedBy: [null],
        relDate: [null],
        role: [null],
        shift: [null],
        status: [null],
        bankAccNo: [null],
        bankBranch: [null],
        bankName: [null],
        esinumber: [null],
        ifsccode: [null],
        pfnumber: [null],
        reportingTo: [null],
        uannumber: [null],
        active: ['Y']

      });

      this.formData = {...data};
      if (!isNullOrUndefined(this.formData.item)) {
        this.modelFormData.patchValue(this.formData.item);
       this.modelFormData.controls['code'].disable();
      }

  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData() {
    const getCompanyUrl = String.Join('/', this.apiConfigService.getCompanysList);
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
        const res = response.body;
        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!isNullOrUndefined(res.response)) {
            console.log(res);
            this.companyList = res.response['companiesList'];
          }
        }
          this.spinner.hide();
      });
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

