import {Component, Inject} from '@angular/core';
import {DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {finalize} from "rxjs";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {User} from "../../../core/interfaces/user.model";
import {AddUser} from "../../../core/stores/users/users.actions";

@Component({
  selector: 'app-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {
  firstFormGroup: FormGroup;
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
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleFile(file: File) {
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
      id: 0,
      name: {
        firstname: this.firstFormGroup.value.firstname,
        lastname: this.firstFormGroup.value.lastname,
      },
      username: this.firstFormGroup.value.username,
      email: this.firstFormGroup.value.email,
      phone: this.firstFormGroup.value.phone,
      image: this.imgPath || ''
    };

    this.store.dispatch(new AddUser(newUser))
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (state) => {
          const addedUser = state.user.users[state.user.users.length - 1];
          this.dialogRef.close();
          this.snackBar.open('User added successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['dashboard/user', addedUser.id]);
        },
        error: () => {
          this.snackBar.open('Failed to add user', 'Close', {
            duration: 3000,
          });
        }
      });
  }
}
