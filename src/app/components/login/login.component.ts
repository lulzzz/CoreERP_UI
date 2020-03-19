import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Static } from '../../enums/common/static';
import { SnackBar, StatusCodes } from '../../enums/common/common';
import { String } from 'typescript-string-operations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConfigService } from '../../services/api-config.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNullOrUndefined } from 'util';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  isSubmitted = false;

  constructor(
    public translate: TranslateService,
    private apiConfigService: ApiConfigService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    commonService.showNavbar.next(false);
  }

  // form model
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Language Preference
  setLang(lang) {
    localStorage.setItem(Static.DefaultLang, lang.toLowerCase());
    this.translate.use(lang.toLowerCase());
    this.translate.currentLang = lang;
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginAPICall();
  }

  loginAPICall() {
    // // this.spinner.show();
    const requestObj = { UserName: this.loginForm.get('username').value, Password: this.loginForm.get('password').value };
    const getLoginUrl = String.Join('/', this.apiConfigService.loginUrl);
    this.apiService.apiPostRequest(getLoginUrl, requestObj)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.authService.login(res.response);
              this.alertService.openSnackBar(Static.LoginSussfull, Static.Close, SnackBar.success);
              this.router.navigate(['dashboard']);
            }
          }
          this.spinner.hide();
        });
  }


  get formControls() { return this.loginForm.controls; }

}
