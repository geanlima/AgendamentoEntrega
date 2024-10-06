import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Venda } from 'src/app/shared/models/venda';
import { VendaService } from 'src/app/shared/services/venda.service';

@Component({
  selector: 'app-process-popup',
  templateUrl: './process-popup.component.html',
  styleUrls: ['./process-popup.component.scss']
})
export class ProcessPopupComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource!: MatTableDataSource<Venda>;
  public displayedColumns: string[] = ['rca_order_id', 'status', 'log_resultado'];
  public processing = false;
  public progress = 0;
  public pageSize: number = 10;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { selectedPedidos: Venda[] },
    private _vendaService: VendaService,
    private dialogRef: MatDialogRef<ProcessPopupComponent>,
  ) {
    const pedidos = data.selectedPedidos.map(pedido => ({
      ...pedido,
      status: 'Pendente',
      log_resultado: ''  // Campo para armazenar a mensagem da API
    }));
    this.dataSource = new MatTableDataSource(pedidos);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  processarTodos(): void {
    this.processing = true;

    const pedidosParaProcessar = this.dataSource.filteredData; // Todos os pedidos, ignorando paginação

    this.processarPedidos(pedidosParaProcessar, 0);
  }

  processarPedidos(pedidos: Venda[], index: number): void {
    if (index >= pedidos.length) {
      this.processing = false;
      return;
    }

    const pedido = pedidos[index];
    pedido.status = 'Processando...';

    
    this._vendaService.integraVenda(pedido.rca_order_id).subscribe(
      (response) => {
        // Sucesso: Captura a mensagem de sucesso da API
        pedido.status = 'Concluído';
        pedido.log_resultado = response.resultado || 'Processado com sucesso';
        this.progress = ((index + 1) / pedidos.length) * 100;

        this.processarPedidos(pedidos, index + 1);
      },
      (error) => {
        // Captura e exibe a mensagem de erro da API
        pedido.status = 'Erro';
        console.log("error", error);
        if (error.error) {
          // Captura a mensagem de erro retornada pela API
          pedido.log_resultado = error.error.mensagem || 'Erro ao processar';
        } else {
          pedido.log_resultado = 'Erro desconhecido ao processar';
        }
        console.error('Erro ao processar o pedido:', error);  // Para debug
        this.progress = ((index + 1) / pedidos.length) * 100;

        this.processarPedidos(pedidos, index + 1);
      }
    );
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
