import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState } from './../../app.reducer';
import { IngresoEgreso } from './../../models/ingreso-egreso.model';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;
  totalingresos: number;
  totalegresos: number;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];

  constructor(private store: Store<GlobalState>) { }

  ngOnInit(): void {
    this.store.select('ingresoEgreso').subscribe (({items}) => {
        this.generarEstadistica(items);
    });
  }
  generarEstadistica(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalingresos = 0;
    this.totalegresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalingresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalegresos += item.monto;
        this.egresos ++;
      }
    }
    this.doughnutChartData = [[this.totalingresos, this.totalegresos]];
  }
}
