import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Menu, Usuario } from '@shared/models';
import { Observable, Subscription, map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, ShortcutService, StorageService } from '@shared/services';
import { DialogConfirmationService } from '../../services/dialog-confirmation.service';
import { environment } from '@env';

@Component({
  selector: 'sgm-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() iniciarVenda: EventEmitter<void> = new EventEmitter<void>();

  activeLinkIndex = -1;
  menus$!: Observable<Menu[]>;
  showBottomHeader: boolean = false;

  usuario!: Usuario;

  private _subs: Subscription[] = [];

  constructor(
    private _router: Router,
    private http: HttpClient,
    private shortcut: ShortcutService,
    private _authService: AuthService,
    private storageService: StorageService,
    private _dialogConfirmationService: DialogConfirmationService
  ) {

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.menus$ = this.http.get<Menu[]>('./../assets/data/menu.json');
    this.usuario = this.storageService.getUsuario();
    const subShortcut = this.shortcut.addShortcut({ keys: 'shift.d' })
      .subscribe(() => {
        this._router.navigate(['/home/dashboard']);
      });

    this._subs.push(subShortcut);
  }

  logout(): void {
    const respostaLogout = this._dialogConfirmationService.openDialog({
      header: 'Logout',
      message: 'Deseja realmente sair do sistema?',
      txtAct: 'Ok',
      txtCancel: 'Cancelar'
    });

    respostaLogout.subscribe((resposta: boolean) => {
      if (!resposta) return;

      this._authService.signOut();

      this._router.navigate(['/auth']);
    });
  }

  getImageLogo(): string {
    return 'assets/img/logo_inside_' + environment.cliente.toLowerCase() + '.png';
  }

  onIniciarVenda(): void {
    this.iniciarVenda.emit();
  }

  onActiveChange(): void {
    this.showBottomHeader = this._router.url === '/home/dashboard' ? true : false;
  }

}
