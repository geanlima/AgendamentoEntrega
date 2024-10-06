import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { ShortcutService } from '../../services/shortcut.service';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() searchTerm: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = true;
  @Output() searchChanged = new EventEmitter<string>();
  @ViewChild(MatInput) searchComponent!: MatInput;
  @Output() enterOnSearch = new EventEmitter<string>();

  private subs$: Subscription[] = [];
  private searchModelChanged: Subject<string> = new Subject<string>();
  term = '';
  debounceTime = 500;

  constructor(
    private shortcut: ShortcutService
  ) { }

  ngOnInit(): void {
    const sub = this.searchModelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((term: string) => {
        this.searchChanged.emit(term);
      });

    this.subs$.push(sub);

    const subShortcut = this.shortcut.addShortcut({ keys: 'shift.f' })
      .subscribe(() => {
        this.searchComponent.focus();
      });

    this.subs$.push(subShortcut);
  }

  enterBusca() {
    this.enterOnSearch.emit(this.searchTerm);
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub: Subscription) => {
      if (sub && !sub.closed) {
        sub.unsubscribe()
      }
    });
  }

  onSearch(term: string): void {
    this.searchModelChanged.next(term)
  }
}
