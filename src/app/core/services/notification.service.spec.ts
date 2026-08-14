import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarStub: any;

  beforeEach(() => {
    snackBarStub = { open: jasmine.createSpy('open') };

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBarStub }]
    });

    service = TestBed.inject(NotificationService);
  });

  it('success opens snackbar with success class', () => {
    service.success('ok');
    expect(snackBarStub.open).toHaveBeenCalledWith('ok', 'Close', jasmine.objectContaining({ panelClass: ['notification-success'] }));
  });

  it('error opens snackbar with error class', () => {
    service.error('err');
    expect(snackBarStub.open).toHaveBeenCalledWith('err', 'Close', jasmine.objectContaining({ panelClass: ['notification-error'] }));
  });

  it('info opens snackbar with info class', () => {
    service.info('i');
    expect(snackBarStub.open).toHaveBeenCalledWith('i', 'Close', jasmine.objectContaining({ panelClass: ['notification-info'] }));
  });

  it('warning opens snackbar with warning class', () => {
    service.warning('w');
    expect(snackBarStub.open).toHaveBeenCalledWith('w', 'Close', jasmine.objectContaining({ panelClass: ['notification-warning'] }));
  });
});

