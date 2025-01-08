import { Component, Input, AfterViewInit } from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';  // Import the zoom plugin

Chart.register(...registerables, zoomPlugin);  // Register the plugin with Chart.js

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @Input() chartData: any;  // Data passed from the parent component
  @Input() chartType: ChartType = 'bar';  // Chart type (e.g., 'bar', 'line', 'pie') - Default to 'bar'
  @Input() chartOptions: any;  // Options for customization
  @Input() chartId: string = '';    // Dynamic ID for the canvas element - Default empty string
  
  chart: any;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.chartData) {
      this.createChart();
    }
  }

  createChart(): void {
    const ctx = document.getElementById(this.chartId) as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: this.chartData,
        options: {
          ...this.chartOptions, // Keep any passed options
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,  // Enable zoom on wheel scroll
                },
                pinch: {
                  enabled: true,  // Enable zoom on pinch gesture (for touch devices)
                },
                mode: 'x',  // Zoom both axes (x and y)
              },
              pan: {
                enabled: false,  // Enable panning
                mode: 'xy',  // Pan both axes (x and y)
                speed: 10,  // Panning speed
              }
            }
          },
          // Add other customization options here if needed
        }
      });
    } else {
      console.error('Failed to acquire context for chart');
    }
  }
}
