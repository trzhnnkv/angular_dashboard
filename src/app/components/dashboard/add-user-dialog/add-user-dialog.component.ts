import {Component, Inject} from '@angular/core';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddUser, User} from '../../../shared/app.state';
import {Store} from '@ngxs/store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  file: File | null = null;
  imgPath: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private store: Store,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(DIALOG_DATA) public data: User
  ) {
    this.firstFormGroup = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+\d{11}$/)]]
    });

    // TODO can be removed
    this.secondFormGroup = this.fb.group({});
  }

  // TODO эта функция и функция ниже на 90% одинаковые
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!this.isValidImage(file)) {
        this.showUnsupportedFormatError();
        return;
      }
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgPath = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (!this.isValidImage(file)) {
        this.showUnsupportedFormatError();
        return;
      }
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgPath = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  isValidImage(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  showUnsupportedFormatError() {
    this.snackBar.open('Unsupported file format. Please upload an image.', 'Close', {
      duration: 3000,
    });
  }

  add(): void {
    if (this.firstFormGroup.invalid) {
      this.snackBar.open('Please correct the errors in the form.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.isLoading = true;

    const newUser: User = {
      id: 0, // Temporary ID, will be set by the state
      name: {
        firstname: this.firstFormGroup.value.firstname,
        lastname: this.firstFormGroup.value.lastname,
      },
      username: this.firstFormGroup.value.username,
      email: this.firstFormGroup.value.email,
      phone: this.firstFormGroup.value.phone,
      image: this.imgPath || ''
    };

    this.store.dispatch(new AddUser(newUser)).subscribe(
      (state) => {
        const addedUser = state.user.users[state.user.users.length - 1];
        // TODO isLoading can be refactor to finalize pipe
        this.isLoading = false;
        this.dialogRef.close();
        this.snackBar.open('User added successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/user', addedUser.id]);
      },
      error => {
        this.isLoading = false;
        this.snackBar.open('Failed to add user', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
