declare module 'react-chartjs' {
    import * as React from 'react';
    import { FontStyleProperty, Color } from "csstype";

    export interface Dataset {
        label: string;
        fillColor?: string;
		strokeColor?: string;
		pointColor?: string;
		pointStrokeColor?: string;
		pointHighlightFill?: string;
		pointHighlightStroke?: string;
		data: number[];
    }

    export interface ChartOptions {
        scaleShowGridLines: boolean;
        scaleGridLineColor: string;
        scaleGridLineWidth: number;
        scaleShowHorizontalLines: boolean;
        scaleShowVerticalLines: boolean;
        bezierCurve: boolean;
        bezierCurveTension: number;
        pointDot: boolean;
        pointDotRadius: number;
        pointDotStrokeWidth: number;
        pointHitDetectionRadius: number;
	    datasetStroke: boolean;
        datasetStrokeWidth: boolean;
        datasetFill: boolean;
	    legendTemplate: string;
        offsetGridLines: boolean;
    }

    export interface BarOptions {
        scaleBeginAtZero: boolean;
        barShowStroke: boolean;
        barStrokeWidth: boolean;
        barValueSpacing: number;
        barDatasetSpacing: number;
    }

    export interface RadarOptions {
        scaleShowLine: boolean;
        angleShowLineOut: boolean;
        scaleShowLabels: boolean;
        scaleBeginAtZero: boolean;
        angleLineColor: string;
        angleLineWidth: number;
        angleLineInterval: number;
        pointLabelFontFamily: string;
        pointLabelFontStyle: string;
        pointLabelFontSize: number;
        pointLabelFontColor: string;
        pointDot: boolean;
        pointDotRadius: number;
        pointDotStrokeWidth: number;
        pointHitDetectionRadius: number;
    }

    export interface ChartData {
        labels: string[];
        datasets: Dataset[];
    }

    interface ChartProps<Options> {
        data: ChartData;
        options?: Partial<Options>;
        redraw?: boolean;
    }

    export interface LineChartProps extends ChartProps<ChartOptions> {

    }

    export interface BarChartProps extends ChartProps<ChartOptions & BarOptions> {
        
    }

    export interface RadarChartProps extends ChartProps<ChartOptions & RadarOptions> {

    }

    interface ChartObject {
        //TODO: Move this to a declaration file for chart.js and define it...
        update(): void;
        addData(values: number[], label: string): void;
        removeData(): void;
    }

    interface LineChartObject extends ChartObject {
        getPointsAtEvent(event: MouseEvent): number[]; //Correct?
    }

    interface BarChartObject extends ChartObject {
        getBarsAtEvent(event: MouseEvent): number[]; //Correct?
    }

    abstract class Chart<Props, ChartObj = ChartObject> extends React.Component<Props> {
        getCanvas(): HTMLCanvasElement;
        getChart(): ChartObj;
    }

    export class Line extends Chart<LineChartProps, LineChartObject> {
        
    }

    export class Bar extends Chart<BarChartProps, BarChartObject> {
        
    }

    export class Radar extends Chart<RadarChartProps, LineChartObject> {
        
    }
}