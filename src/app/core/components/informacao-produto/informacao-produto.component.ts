import { Component, Input, OnInit } from '@angular/core';
import { DadoComerciais, DadosHistoricos, ProdutoDetalhe } from '@shared/models';
import { ChartOptions } from 'src/app/shared/models/chartOptions';

@Component({
  selector: 'app-info-produto',
  templateUrl: './informacao-produto.component.html',
  styleUrls: ['./informacao-produto.component.scss']
})
export class InformacaoProdutoComponent implements OnInit {
  public chartOptions: Partial<ChartOptions> | any;
  @Input() produto: any | null = {} as ProdutoDetalhe[];
  dadoComercial: DadoComerciais = {} as DadoComerciais;
  dadoHistorico: DadosHistoricos | undefined;

  constructor() {
    this.chartOptions = this.getChartOptions(this.preencherVendasVazia());
  }

  ngOnInit(): void {
    if (this.produto) {
      if (this.produto.dados_comerciais) {
        this.dadoComercial = this.produto.dados_comerciais;
      }
      if (this.produto.dados_historicos) {
        this.dadoHistorico = this.produto.dados_historicos;
      }

      if (this.produto.produtoGrafico) {
        this.chartOptions = this.getChartOptions(this.produto.produtoGrafico);
      }
    }
  }

  private preencherVendasVazia(): any {
    return {
      vlvendA01: 0,
      vlvendA02: 0,
      vlvendA03: 0,
      vlvendA04: 0,
      vlvendA05: 0,
      vlvendA06: 0,
      vlvendA07: 0,
      vlvendA08: 0,
      vlvendA09: 0,
      vlvendA10: 0,
      vlvendA11: 0,
      vlvendA12: 0,
      vlvendAtotal: 0
    };
  }

  private getChartOptions(input: Record<string, number>): Partial<ChartOptions> | any {
    const valorVendas: number[] = [];

    for (let i = 1; i <= 12; i++) {
      const valorKey = `vlvendA${i.toString().padStart(2, '0')}`;
      const valor = input[valorKey];
      valorVendas.push(valor);
    }

    const months = this.getLastSixMonths();

    const values = this.getValueLastSixMonths(valorVendas);

    const data: Partial<ChartOptions> | any = {
      series: [
        {
          name: "Valor",
          data: values,
        },
      ],
      chart: {
        height: 180,
        type: "bar",
      },
      title: {
        text: "Compras nos últimos 6 meses",
      },
      yaxis: {
        labels: {
          show: false,
        },
        decimalsInFloat: 2,
      },
      xaxis: {
        categories: months,
      },
    };

    return data;
  }

  private getLastSixMonths(): string[] {

    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const today = new Date();
    const currentMonth = today.getMonth();
    const lastSixMonths = [];

    for (let i = currentMonth - 5; i <= currentMonth; i++) {
      const monthIndex = (i < 0 ? 12 + i : i);
      const month = months[monthIndex];
      lastSixMonths.push(month);
    }

    return lastSixMonths;
  }

  private getValueLastSixMonths(valorVendas: number[]): number[] {

    const today = new Date();
    const currentMonth = today.getMonth();

    const valorVendasReturn: number[] = [];

    for (let i = currentMonth - 5; i <= currentMonth; i++) {
      const monthIndex = (i < 0 ? 12 + i : i);
      const valor = valorVendas[monthIndex];
      const valorDecimal = +valor.toFixed(2);
      valorVendasReturn.push(valorDecimal);
    }

    return valorVendasReturn;
  }
}
