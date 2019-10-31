import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  base64Image: string;

  croppedImagepaths = [];

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(
      private camera: Camera,
      private crop: Crop,
      private file: File
  ) {}

  onTakePictureCamera() {
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true
    };

    this.takePicture(cameraOptions);
  }

  onTakePictureLibrary() {
    const libraryOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true
    };

    this.takePicture(libraryOptions);
  }

  takePicture(options) {
    this.camera.getPicture(options)
        .then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          // this.base64Image = 'data:image/jpeg;base64,' + imageData;
          this.cropImage(imageData);
        }, (err) => {
          // Handle error
          console.log(err);
        })
    ;
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 })
        .then(
            newPath => {
              this.showCroppedImage(newPath.split('?')[0]);
            },
            error => {
              alert('Error cropping image' + error);
            }
        );
  }

  showCroppedImage(ImagePath) {
    // this.isLoading = true;
    const copyPath = ImagePath;
    const splitPath = copyPath.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepaths.push(base64);
      // this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      // this.isLoading = false;
    });
  }
}
